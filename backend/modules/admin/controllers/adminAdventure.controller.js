const { AdventureQuest, DailyTrial, Badge, UserBadge, User, Zone } = require("../../../models/associations");

const createAdventureQuest = async (req, res, next) => {
	try {
		const {
			zone_id,
			name,
			description,
			quest_type,
			xp_reward,
			start_date,
			end_date,
			questions
		} = req.body;

		if (!zone_id || !name || !start_date || !end_date || !questions) {
			return res.status(400).json({
				status: "fail",
				message: "Validation failed: zone_id, name, start_date, end_date, and questions are required."
			});
		}

		const parsedQuestions = typeof questions === "string" ? JSON.parse(questions) : questions;

		const quest = await AdventureQuest.create({
			zone_id,
			name,
			description,
			quest_type: quest_type || "weekly",
			xp_reward: Number(xp_reward) || 100,
			start_date: new Date(start_date),
			end_date: new Date(end_date),
			questions: parsedQuestions,
			is_active: true
		});

		return res.status(201).json({
			status: "success",
			message: "Adventure quest created successfully!",
			data: quest
		});
	} catch (err) {
		next(err);
	}
};

const createDailyTrial = async (req, res, next) => {
	try {
		const {
			title,
			description,
			xp_reward,
			type,
			questions,
			active_date
		} = req.body;

		if (!title || !questions || !active_date) {
			return res.status(400).json({
				status: "fail",
				message: "Validation failed: title, questions, and active_date are required."
			});
		}

		const parsedQuestions = typeof questions === "string" ? JSON.parse(questions) : questions;

		const trial = await DailyTrial.create({
			title,
			description,
			xp_reward: Number(xp_reward) || 50,
			type: type || "vocab",
			questions: parsedQuestions,
			active_date: active_date
		});

		return res.status(201).json({
			status: "success",
			message: "Daily trial created successfully!",
			data: trial
		});
	} catch (err) {
		next(err);
	}
};

const getAdventureQuestsAdmin = async (req, res, next) => {
	try {
		const { Badge } = require("../../../models/associations");
		const quests = await AdventureQuest.findAll({
			include: [{
				model: Badge,
				as: "badge",
				attributes: ["id", "name", "icon_url"]
			}],
			order: [["id", "DESC"]]
		});
		return res.status(200).json({
			status: "success",
			data: quests
		});
	} catch (err) {
		next(err);
	}
};

const getDailyTrialsAdmin = async (req, res, next) => {
	try {
		const trials = await DailyTrial.findAll({
			order: [["active_date", "DESC"], ["id", "DESC"]]
		});
		return res.status(200).json({
			status: "success",
			data: trials
		});
	} catch (err) {
		next(err);
	}
};

const updateAdventureQuest = async (req, res, next) => {
	try {
		const { id } = req.params;
		const {
			zone_id,
			name,
			description,
			quest_type,
			xp_reward,
			badge_id,
			start_date,
			end_date,
			questions,
			is_active
		} = req.body;

		const quest = await AdventureQuest.findByPk(id);
		if (!quest) {
			return res.status(404).json({
				status: "fail",
				message: "Adventure quest not found"
			});
		}

		const parsedQuestions = typeof questions === "string" ? JSON.parse(questions) : questions;

		await quest.update({
			zone_id: zone_id || quest.zone_id,
			name: name || quest.name,
			description: description !== undefined ? description : quest.description,
			quest_type: quest_type || quest.quest_type,
			xp_reward: xp_reward !== undefined ? Number(xp_reward) : quest.xp_reward,
			badge_id: badge_id !== undefined ? badge_id : quest.badge_id,
			start_date: start_date ? new Date(start_date) : quest.start_date,
			end_date: end_date ? new Date(end_date) : quest.end_date,
			questions: parsedQuestions || quest.questions,
			is_active: is_active !== undefined ? !!is_active : quest.is_active
		});

		return res.status(200).json({
			status: "success",
			message: "Adventure quest updated successfully!",
			data: quest
		});
	} catch (err) {
		next(err);
	}
};

const deleteAdventureQuest = async (req, res, next) => {
	try {
		const { id } = req.params;
		const quest = await AdventureQuest.findByPk(id);
		if (!quest) {
			return res.status(404).json({
				status: "fail",
				message: "Adventure quest not found"
			});
		}

		await quest.destroy();

		return res.status(200).json({
			status: "success",
			message: "Adventure quest deleted successfully!"
		});
	} catch (err) {
		next(err);
	}
};

const toggleAdventureQuestActive = async (req, res, next) => {
	try {
		const { id } = req.params;
		const quest = await AdventureQuest.findByPk(id);
		if (!quest) {
			return res.status(404).json({
				status: "fail",
				message: "Adventure quest not found"
			});
		}

		quest.is_active = !quest.is_active;
		await quest.save();

		return res.status(200).json({
			status: "success",
			message: `Adventure quest is now ${quest.is_active ? "active" : "hidden"}!`,
			data: quest
		});
	} catch (err) {
		next(err);
	}
};

// Badges Management Controllers
const getBadgesAdmin = async (req, res, next) => {
	try {
		const badges = await Badge.findAll({
			order: [["id", "DESC"]]
		});

		const badgesWithCounts = await Promise.all(badges.map(async (badge) => {
			const earnedCount = await UserBadge.count({
				where: { badge_id: badge.id }
			});
			return {
				...badge.toJSON(),
				earnedCount
			};
		}));

		return res.status(200).json({
			status: "success",
			data: badgesWithCounts
		});
	} catch (err) {
		next(err);
	}
};

const createBadgeAdmin = async (req, res, next) => {
	try {
		const { name, description, icon_url, badge_type, xp_required, target_type, target_value, time_limit, score_limit } = req.body;
		if (!name || !description || !icon_url) {
			return res.status(400).json({
				status: "fail",
				message: "Validation failed: name, description, and icon_url are required."
			});
		}

		const badge = await Badge.create({
			name,
			description,
			icon_url,
			badge_type: badge_type || "achievement",
			xp_required: xp_required ? Number(xp_required) : null,
			target_type: target_type || null,
			target_value: target_value || null,
			time_limit: time_limit ? Number(time_limit) : null,
			score_limit: score_limit ? Number(score_limit) : null
		});

		return res.status(201).json({
			status: "success",
			message: "Badge created successfully!",
			data: badge
		});
	} catch (err) {
		next(err);
	}
};

const updateBadgeAdmin = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { name, description, icon_url, badge_type, xp_required, target_type, target_value, time_limit, score_limit } = req.body;

		const badge = await Badge.findByPk(id);
		if (!badge) {
			return res.status(404).json({
				status: "fail",
				message: "Badge not found"
			});
		}

		await badge.update({
			name: name || badge.name,
			description: description || badge.description,
			icon_url: icon_url || badge.icon_url,
			badge_type: badge_type || badge.badge_type,
			xp_required: xp_required !== undefined ? (xp_required ? Number(xp_required) : null) : badge.xp_required,
			target_type: target_type !== undefined ? target_type : badge.target_type,
			target_value: target_value !== undefined ? target_value : badge.target_value,
			time_limit: time_limit !== undefined ? (time_limit ? Number(time_limit) : null) : badge.time_limit,
			score_limit: score_limit !== undefined ? (score_limit ? Number(score_limit) : null) : badge.score_limit
		});

		return res.status(200).json({
			status: "success",
			message: "Badge updated successfully!",
			data: badge
		});
	} catch (err) {
		next(err);
	}
};

const deleteBadgeAdmin = async (req, res, next) => {
	try {
		const { id } = req.params;
		const badge = await Badge.findByPk(id);
		if (!badge) {
			return res.status(404).json({
				status: "fail",
				message: "Badge not found"
			});
		}

		await badge.destroy();

		return res.status(200).json({
			status: "success",
			message: "Badge deleted successfully!"
		});
	} catch (err) {
		next(err);
	}
};

const awardBadgeToUserAdmin = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { userId } = req.body;
		if (!userId) {
			return res.status(400).json({
				status: "fail",
				message: "User ID is required."
			});
		}

		const badge = await Badge.findByPk(id);
		if (!badge) {
			return res.status(404).json({
				status: "fail",
				message: "Badge not found"
			});
		}

		const user = await User.findByPk(userId);
		if (!user) {
			return res.status(404).json({
				status: "fail",
				message: "User not found"
			});
		}

		// Check if user already has the badge
		const existingUserBadge = await UserBadge.findOne({
			where: { user_id: userId, badge_id: id }
		});

		if (existingUserBadge) {
			return res.status(400).json({
				status: "fail",
				message: "User already has this badge."
			});
		}

		await UserBadge.create({
			user_id: userId,
			badge_id: id,
			earned_at: new Date()
		});

		return res.status(200).json({
			status: "success",
			message: `Special Badge "${badge.name}" awarded successfully to ${user.fullname}!`
		});
	} catch (err) {
		next(err);
	}
};

const getZonesAdmin = async (req, res, next) => {
	try {
		const zones = await Zone.findAll({
			order: [["sort_order", "ASC"]]
		});
		return res.status(200).json({
			status: "success",
			data: zones
		});
	} catch (err) {
		next(err);
	}
};

const createZoneAdmin = async (req, res, next) => {
	try {
		const {
			id,
			name,
			short_name,
			xp,
			gradient,
			border_color,
			shadow_color,
			bg_light,
			image_url,
			pos_x,
			pos_y,
			delay,
			is_active,
			sort_order
		} = req.body;

		if (!id || !name || !short_name) {
			return res.status(400).json({
				status: "fail",
				message: "Zone ID, Name and Short Name are required."
			});
		}

		const cleanId = id.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
		if (!cleanId) {
			return res.status(400).json({
				status: "fail",
				message: "Invalid Zone ID format."
			});
		}

		// Ensure unique ID
		const existingZone = await Zone.findByPk(cleanId);
		if (existingZone) {
			return res.status(400).json({
				status: "fail",
				message: `Zone with ID "${cleanId}" already exists. Please choose a different unique ID.`
			});
		}

		const zone = await Zone.create({
			id: cleanId,
			name,
			short_name,
			xp: xp || 300,
			gradient: gradient || "from-slate-400 to-slate-500",
			border_color: border_color || "border-slate-300",
			shadow_color: shadow_color || "shadow-slate-200",
			bg_light: bg_light || "bg-slate-50",
			image_url: image_url || null,
			pos_x: pos_x || 100,
			pos_y: pos_y || 100,
			delay: delay || "0s",
			is_active: is_active !== undefined ? is_active : true,
			sort_order: sort_order !== undefined ? parseInt(sort_order) : 1
		});

		return res.status(201).json({
			status: "success",
			message: "Adventure Zone created successfully!",
			data: zone
		});
	} catch (err) {
		next(err);
	}
};

const updateZoneAdmin = async (req, res, next) => {
	try {
		const { id } = req.params;
		const {
			name,
			short_name,
			xp,
			gradient,
			border_color,
			shadow_color,
			bg_light,
			image_url,
			pos_x,
			pos_y,
			delay,
			is_active,
			sort_order
		} = req.body;

		const zone = await Zone.findByPk(id);
		if (!zone) {
			return res.status(404).json({
				status: "fail",
				message: "Zone not found"
			});
		}

		await zone.update({
			name: name !== undefined ? name : zone.name,
			short_name: short_name !== undefined ? short_name : zone.short_name,
			xp: xp !== undefined ? xp : zone.xp,
			gradient: gradient !== undefined ? gradient : zone.gradient,
			border_color: border_color !== undefined ? border_color : zone.border_color,
			shadow_color: shadow_color !== undefined ? shadow_color : zone.shadow_color,
			bg_light: bg_light !== undefined ? bg_light : zone.bg_light,
			image_url: image_url !== undefined ? image_url : zone.image_url,
			pos_x: pos_x !== undefined ? pos_x : zone.pos_x,
			pos_y: pos_y !== undefined ? pos_y : zone.pos_y,
			delay: delay !== undefined ? delay : zone.delay,
			is_active: is_active !== undefined ? is_active : zone.is_active,
			sort_order: sort_order !== undefined ? parseInt(sort_order) : zone.sort_order
		});

		return res.status(200).json({
			status: "success",
			message: "Adventure Zone updated successfully!",
			data: zone
		});
	} catch (err) {
		next(err);
	}
};

const toggleZoneActiveAdmin = async (req, res, next) => {
	try {
		const { id } = req.params;
		const zone = await Zone.findByPk(id);
		if (!zone) {
			return res.status(404).json({
				status: "fail",
				message: "Zone not found"
			});
		}

		await zone.update({
			is_active: !zone.is_active
		});

		return res.status(200).json({
			status: "success",
			message: `Adventure Zone is now ${zone.is_active ? "visible" : "hidden"} to students!`,
			data: zone
		});
	} catch (err) {
		next(err);
	}
};

const deleteZoneAdmin = async (req, res, next) => {
	try {
		const { id } = req.params;
		const zone = await Zone.findByPk(id);
		if (!zone) {
			return res.status(404).json({
				status: "fail",
				message: "Zone not found"
			});
		}

		// Check if any adventure quests are currently linked to this zone
		const linkedQuestsCount = await AdventureQuest.count({
			where: { zone_id: id }
		});

		if (linkedQuestsCount > 0) {
			return res.status(400).json({
				status: "fail",
				message: `Cannot delete this zone. It has ${linkedQuestsCount} linked adventure quests. Delete or reassign those quests first.`
			});
		}

		await zone.destroy();

		return res.status(200).json({
			status: "success",
			message: "Adventure Zone deleted successfully!"
		});
	} catch (err) {
		next(err);
	}
};

module.exports = {
	createAdventureQuest,
	createDailyTrial,
	getAdventureQuestsAdmin,
	getDailyTrialsAdmin,
	updateAdventureQuest,
	deleteAdventureQuest,
	toggleAdventureQuestActive,
	getBadgesAdmin,
	createBadgeAdmin,
	updateBadgeAdmin,
	deleteBadgeAdmin,
	awardBadgeToUserAdmin,
	getZonesAdmin,
	createZoneAdmin,
	updateZoneAdmin,
	deleteZoneAdmin,
	toggleZoneActiveAdmin,
};
