const { 
	AdventureQuest, 
	DailyTrial, 
	UserAdventureProgress, 
	UserDailyTrialProgress, 
	UserDailyBonus, 
	User, 
	UserLevel, 
	Badge, 
	UserBadge,
	Zone
} = require("../../../models/associations");
const { Op } = require("sequelize");
const { updateUserXPAndLevel, checkAndAwardBadges } = require("../../../managers/xpManager");

const getAdventureQuests = async (req, res, next) => {
	try {
		const userId = req.userId;
		const today = new Date();

		let user = await User.findByPk(userId);
		if (user) {
			user = await checkAndRegenerateHearts(user);
		}

		// Fetch active adventure quests
		const quests = await AdventureQuest.findAll({
			where: {
				is_active: true,
				start_date: { [Op.lte]: today },
				end_date: { [Op.gte]: today }
			},
			include: [
				{
					model: Badge,
					as: "badge",
					attributes: ["id", "name", "description", "icon_url"]
				}
			],
			order: [["id", "ASC"]]
		});

		// Fetch completed quests for this user
		const progresses = await UserAdventureProgress.findAll({
			where: { user_id: userId, status: "completed" }
		});
		const completedQuestIds = progresses.map(p => p.quest_id);

		// Fetch all active zones from DB
		const dbZones = await Zone.findAll({ where: { is_active: true }, order: [["sort_order", "ASC"]] });
		const zonesMap = {};
		dbZones.forEach(z => {
			zonesMap[z.id] = {
				id: z.id,
				name: z.name,
				shortName: z.short_name,
				status: "locked",
				trials: []
			};
		});

		// Group quests into zones
		quests.forEach(q => {
			if (zonesMap[q.zone_id]) {
				const isCompleted = completedQuestIds.includes(q.id);
				zonesMap[q.zone_id].trials.push({
					id: q.id,
					name: q.name,
					description: q.description,
					xp_reward: q.xp_reward,
					badge_id: q.badge_id,
					badge: q.badge,
					questions: q.questions,
					status: isCompleted ? "completed" : "locked",
					progress: isCompleted ? 100 : 0,
					done: isCompleted ? q.questions.length : 0,
					total: q.questions.length
				});
			}
		});

		const setTrialStatuses = (zoneObj, isActiveZone) => {
			let foundActive = false;
			zoneObj.trials.forEach(t => {
				if (t.status === "completed") {
					// stays completed
				} else if (!foundActive && isActiveZone) {
					t.status = "active";
					foundActive = true;
				} else {
					t.status = "locked";
				}
			});
		};

		// Dynamically evaluate statuses in order of pos_y
		for (let i = 0; i < dbZones.length; i++) {
			const zId = dbZones[i].id;
			const zoneObj = zonesMap[zId];
			
			// A zone is fully completed if it has trials and all are completed
			const zoneAllDone = zoneObj.trials.length > 0 && zoneObj.trials.every(t => t.status === "completed");
			
			if (i === 0) {
				// First zone is always unlocked
				if (zoneAllDone) {
					zoneObj.status = "completed";
					setTrialStatuses(zoneObj, false);
				} else {
					zoneObj.status = "current";
					setTrialStatuses(zoneObj, true);
				}
			} else {
				// Subsequent zones depend on the previous zone being completed
				const prevZoneId = dbZones[i - 1].id;
				const prevZoneObj = zonesMap[prevZoneId];
				
				if (prevZoneObj.status === "completed") {
					if (zoneAllDone) {
						zoneObj.status = "completed";
						setTrialStatuses(zoneObj, false);
					} else {
						zoneObj.status = "current";
						setTrialStatuses(zoneObj, true);
					}
				} else {
					zoneObj.status = "locked";
					setTrialStatuses(zoneObj, false);
				}
			}
		}

		const responseData = {
			hearts: user ? user.hearts : 3,
			nextHeartRegenInSeconds: user ? getNextHeartRegenSeconds(user) : 0,
			currentUserName: user ? user.fullname : "Student",
			zonesList: dbZones
		};

		dbZones.forEach(z => {
			responseData[z.id] = zonesMap[z.id];
		});

		return res.status(200).json({
			status: "success",
			data: responseData
		});
	} catch (err) {
		next(err);
	}
};

const submitQuest = async (req, res, next) => {
	try {
		const userId = req.userId;
		const { id } = req.params;

		const quest = await AdventureQuest.findByPk(id);
		if (!quest) {
			return res.status(404).json({
				status: "fail",
				message: "Adventure quest not found"
			});
		}

		const { answers } = req.body;
		if (!answers || !Array.isArray(answers)) {
			return res.status(400).json({
				status: "fail",
				message: "Verification failed: answers array is required."
			});
		}

		let progress = await UserAdventureProgress.findOne({
			where: { user_id: userId, quest_id: quest.id }
		});

		if (progress && progress.status === "completed") {
			return res.status(400).json({
				status: "fail",
				message: "You have already completed this quest."
			});
		}

		const questions = quest.questions;
		if (answers.length !== questions.length) {
			return res.status(400).json({
				status: "fail",
				message: "Verification failed: number of answers does not match questions."
			});
		}

		let allCorrect = true;
		for (let i = 0; i < questions.length; i++) {
			const q = questions[i];
			const selectedOptionLabel = answers[i];
			const correctOption = q.options.find(opt => opt.isCorrect);
			if (!correctOption || correctOption.label !== selectedOptionLabel) {
				allCorrect = false;
				break;
			}
		}

		if (!allCorrect) {
			if (progress) {
				progress.status = "failed";
				progress.completed_at = new Date();
				await progress.save();
			} else {
				await UserAdventureProgress.create({
					user_id: userId,
					quest_id: quest.id,
					status: "failed",
					completed_at: new Date()
				});
			}

			return res.status(400).json({
				status: "fail",
				message: "Verification failed: some answers are incorrect."
			});
		}

		if (progress) {
			progress.status = "completed";
			progress.completed_at = new Date();
			await progress.save();
		} else {
			progress = await UserAdventureProgress.create({
				user_id: userId,
				quest_id: quest.id,
				status: "completed",
				completed_at: new Date()
			});
		}

		// Award XP
		const xpUpdate = await updateUserXPAndLevel(userId, quest.xp_reward);

		// Evaluate and award dynamic badges
		const newlyAwardedBadges = await checkAndAwardBadges(userId);
		const badgeAwarded = newlyAwardedBadges[0] || null;

		return res.status(200).json({
			status: "success",
			message: "Quest completed successfully!",
			data: {
				xpGained: quest.xp_reward,
				currentXP: xpUpdate.currentXP,
				leveledUp: xpUpdate.leveledUp,
				currentLevel: xpUpdate.currentLevel,
				badgeAwarded
			}
		});
	} catch (err) {
		next(err);
	}
};

const getDailyTrials = async (req, res, next) => {
	try {
		const userId = req.userId;
		const todayStr = new Date().toISOString().split('T')[0];

		// Fetch daily trials for today
		const trials = await DailyTrial.findAll({
			where: { active_date: todayStr }
		});

		// Fetch completed daily trials for this user today
		const completedTrials = await UserDailyTrialProgress.findAll({
			where: { user_id: userId },
			include: [
				{
					model: DailyTrial,
					as: "trial",
					where: { active_date: todayStr },
					required: true
				}
			]
		});
		const completedIds = completedTrials.map(p => p.trial_id);

		const data = trials.map(t => ({
			id: t.id,
			title: t.title,
			description: t.description,
			xp_reward: t.xp_reward,
			type: t.type,
			questions: t.questions,
			isCompleted: completedIds.includes(t.id)
		}));

		return res.status(200).json({
			status: "success",
			data
		});
	} catch (err) {
		next(err);
	}
};

const submitDailyTrial = async (req, res, next) => {
	try {
		const userId = req.userId;
		const { id } = req.params;

		const trial = await DailyTrial.findByPk(id);
		if (!trial) {
			return res.status(404).json({
				status: "fail",
				message: "Daily trial not found"
			});
		}

		const alreadyCompleted = await UserDailyTrialProgress.findOne({
			where: { user_id: userId, trial_id: trial.id }
		});

		if (alreadyCompleted) {
			return res.status(400).json({
				status: "fail",
				message: "You have already completed this daily trial today."
			});
		}
		const { answers } = req.body;
		if (!answers || !Array.isArray(answers)) {
			return res.status(400).json({
				status: "fail",
				message: "Verification failed: answers array is required."
			});
		}

		const questions = trial.questions;
		if (answers.length !== questions.length) {
			return res.status(400).json({
				status: "fail",
				message: "Verification failed: number of answers does not match questions."
			});
		}

		let allCorrect = true;
		for (let i = 0; i < questions.length; i++) {
			const q = questions[i];
			const selectedOptionLabel = answers[i];
			const correctOption = q.options.find(opt => opt.isCorrect);
			if (!correctOption || correctOption.label !== selectedOptionLabel) {
				allCorrect = false;
				break;
			}
		}

		if (!allCorrect) {
			return res.status(400).json({
				status: "fail",
				message: "Verification failed: some answers are incorrect."
			});
		}

		await UserDailyTrialProgress.create({
			user_id: userId,
			trial_id: trial.id,
			completed_at: new Date()
		});

		// Award XP
		const xpUpdate = await updateUserXPAndLevel(userId, trial.xp_reward);

		// Evaluate and award dynamic daily trial badges
		const newlyAwardedBadges = await checkAndAwardBadges(userId);
		const badgeAwarded = newlyAwardedBadges[0] || null;

		return res.status(200).json({
			status: "success",
			message: "Daily trial completed successfully!",
			data: {
				xpGained: trial.xp_reward,
				currentXP: xpUpdate.currentXP,
				leveledUp: xpUpdate.leveledUp,
				currentLevel: xpUpdate.currentLevel,
				badgeAwarded
			}
		});
	} catch (err) {
		next(err);
	}
};

const getDailyBonusStatus = async (req, res, next) => {
	try {
		const userId = req.userId;
		const bonus = await UserDailyBonus.findOne({ where: { user_id: userId } });

		if (!bonus) {
			return res.status(200).json({
				status: "success",
				data: {
					canClaim: true,
					secondsRemaining: 0
				}
			});
		}

		const now = new Date();
		const lastClaimed = new Date(bonus.last_claimed_at);
		const diffMs = now - lastClaimed;
		const diffHours = diffMs / (1000 * 60 * 60);

		if (diffHours >= 24) {
			return res.status(200).json({
				status: "success",
				data: {
					canClaim: true,
					secondsRemaining: 0
				}
			});
		} else {
			const remainingMs = (24 * 60 * 60 * 1000) - diffMs;
			return res.status(200).json({
				status: "success",
				data: {
					canClaim: false,
					secondsRemaining: Math.ceil(remainingMs / 1000)
				}
			});
		}
	} catch (err) {
		next(err);
	}
};

const claimDailyBonus = async (req, res, next) => {
	try {
		const userId = req.userId;
		let bonus = await UserDailyBonus.findOne({ where: { user_id: userId } });

		const now = new Date();
		if (bonus) {
			const lastClaimed = new Date(bonus.last_claimed_at);
			const diffMs = now - lastClaimed;
			const diffHours = diffMs / (1000 * 60 * 60);

			if (diffHours < 24) {
				const remainingMs = (24 * 60 * 60 * 1000) - diffMs;
				return res.status(400).json({
					status: "fail",
					message: "Daily bonus is only claimable once every 24 hours.",
					secondsRemaining: Math.ceil(remainingMs / 1000)
				});
			}

			bonus.last_claimed_at = now;
			await bonus.save();
		} else {
			bonus = await UserDailyBonus.create({
				user_id: userId,
				last_claimed_at: now
			});
		}

		// Award 10 XP
		const xpUpdate = await updateUserXPAndLevel(userId, 10);

		return res.status(200).json({
			status: "success",
			message: "Daily bonus claimed successfully! (+10 XP)",
			data: {
				xpGained: 10,
				currentXP: xpUpdate.currentXP,
				leveledUp: xpUpdate.leveledUp,
				currentLevel: xpUpdate.currentLevel
			}
		});
	} catch (err) {
		next(err);
	}
};

const getAdventureLeaderboard = async (req, res, next) => {
	try {
		const today = new Date();

		// Fetch all active quests and trials
		const activeQuests = await AdventureQuest.findAll({
			where: {
				is_active: true,
				start_date: { [Op.lte]: today },
				end_date: { [Op.gte]: today }
			},
			attributes: ["id", "xp_reward"]
		});
		const activeQuestIds = activeQuests.map(q => q.id);
		const questXpMap = {};
		activeQuests.forEach(q => questXpMap[q.id] = q.xp_reward);

		const activeTrials = await DailyTrial.findAll({
			attributes: ["id", "xp_reward"]
		});
		const trialXpMap = {};
		activeTrials.forEach(t => trialXpMap[t.id] = t.xp_reward);

		// Get all users
		const allUsers = await User.findAll({
			include: [
				{
					model: UserLevel,
					as: "currentLevel",
					attributes: ["level_no", "level_name"]
				}
			],
			attributes: ["id", "fullname", "profile_url"]
		});

		// Fetch all quest completions
		const questProgresses = await UserAdventureProgress.findAll({
			where: { quest_id: { [Op.in]: activeQuestIds }, status: "completed" },
			attributes: ["user_id", "quest_id"]
		});

		// Fetch all trial completions
		const trialProgresses = await UserDailyTrialProgress.findAll({
			attributes: ["user_id", "trial_id"]
		});

		const userXpTotals = {};
		allUsers.forEach(u => {
			userXpTotals[u.id] = 0;
		});

		questProgresses.forEach(p => {
			if (userXpTotals[p.user_id] !== undefined) {
				userXpTotals[p.user_id] += (questXpMap[p.quest_id] || 0);
			}
		});

		trialProgresses.forEach(p => {
			if (userXpTotals[p.user_id] !== undefined && trialXpMap[p.trial_id]) {
				userXpTotals[p.user_id] += trialXpMap[p.trial_id];
			}
		});

		const leaderboardList = allUsers.map(user => ({
			id: user.id,
			name: user.fullname,
			xp: userXpTotals[user.id],
			level: user.currentLevel?.level_no || 1,
			badge: user.currentLevel?.level_name || "Starter",
			profile_url: user.profile_url,
			trend: "Hold"
		}));

		// Sort by adventure XP descending
		leaderboardList.sort((a, b) => b.xp - a.xp);

		// Assign ranks
		const finalizedList = leaderboardList.map((item, index) => ({
			...item,
			rank: index + 1
		}));

		return res.status(200).json({
			status: "success",
			data: finalizedList
		});
	} catch (err) {
		next(err);
	}
};

const checkAndRegenerateHearts = async (user) => {
	if (user.hearts < 3 && user.last_heart_lost_at) {
		const elapsedMs = Date.now() - new Date(user.last_heart_lost_at).getTime();
		const regenTime = 30 * 60 * 1000; // 30 minutes in ms
		const regenerated = Math.floor(elapsedMs / regenTime);
		if (regenerated > 0) {
			const newHearts = Math.min(3, user.hearts + regenerated);
			user.hearts = newHearts;
			if (newHearts === 3) {
				user.last_heart_lost_at = null;
			} else {
				user.last_heart_lost_at = new Date(new Date(user.last_heart_lost_at).getTime() + regenerated * regenTime);
			}
			await user.save();
		}
	} else if (user.hearts < 3 && !user.last_heart_lost_at) {
		user.last_heart_lost_at = new Date();
		await user.save();
	}
	return user;
};

const getNextHeartRegenSeconds = (user) => {
	if (user.hearts >= 3 || !user.last_heart_lost_at) {
		return 0;
	}
	const elapsedMs = Date.now() - new Date(user.last_heart_lost_at).getTime();
	const regenTime = 30 * 60 * 1000;
	const nextHeartAt = new Date(user.last_heart_lost_at).getTime() + regenTime;
	const remainingSeconds = Math.max(0, Math.ceil((nextHeartAt - Date.now()) / 1000));
	return remainingSeconds;
};

const getHearts = async (req, res, next) => {
	try {
		const userId = req.userId;
		let user = await User.findByPk(userId);
		if (!user) {
			return res.status(404).json({
				status: "fail",
				message: "User not found"
			});
		}

		user = await checkAndRegenerateHearts(user);
		const nextHeartRegenInSeconds = getNextHeartRegenSeconds(user);

		return res.status(200).json({
			status: "success",
			data: {
				hearts: user.hearts,
				nextHeartRegenInSeconds
			}
		});
	} catch (err) {
		next(err);
	}
};

const deductHeart = async (req, res, next) => {
	try {
		const userId = req.userId;
		let user = await User.findByPk(userId);
		if (!user) {
			return res.status(404).json({
				status: "fail",
				message: "User not found"
			});
		}

		user = await checkAndRegenerateHearts(user);

		if (user.hearts > 0) {
			if (user.hearts === 3) {
				user.last_heart_lost_at = new Date();
			}
			user.hearts = user.hearts - 1;
			await user.save();
		}

		const nextHeartRegenInSeconds = getNextHeartRegenSeconds(user);

		return res.status(200).json({
			status: "success",
			data: {
				hearts: user.hearts,
				nextHeartRegenInSeconds
			}
		});
	} catch (err) {
		next(err);
	}
};

module.exports = {
	getAdventureQuests,
	submitQuest,
	getDailyTrials,
	submitDailyTrial,
	getDailyBonusStatus,
	claimDailyBonus,
	getAdventureLeaderboard,
	getHearts,
	deductHeart
};
