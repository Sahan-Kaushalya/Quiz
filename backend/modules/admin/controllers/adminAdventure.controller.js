const { AdventureQuest, DailyTrial } = require("../../../models/associations");

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

module.exports = {
	createAdventureQuest,
	createDailyTrial,
	getAdventureQuestsAdmin,
	getDailyTrialsAdmin
};
