const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const AdventureQuest = sequelize.define(
	"adventure_quests",
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
		},
		zone_id: {
			type: DataTypes.STRING(50),
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		quest_type: {
			type: DataTypes.ENUM("daily", "weekly", "monthly"),
			allowNull: false,
			defaultValue: "weekly",
		},
		xp_reward: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 100,
		},
		badge_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: "badges",
				key: "id",
			},
			onUpdate: "CASCADE",
			onDelete: "SET NULL",
		},
		start_date: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		end_date: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		questions: {
			type: DataTypes.JSON,
			allowNull: false,
		},
		is_active: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true,
		},
	},
	{
		tableName: "adventure_quests",
		freezeTableName: true,
		timestamps: false,
	}
);

module.exports = AdventureQuest;
