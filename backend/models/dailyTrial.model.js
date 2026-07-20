const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const DailyTrial = sequelize.define(
	"daily_trials",
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
		},
		title: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		xp_reward: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 50,
		},
		type: {
			type: DataTypes.STRING(50),
			allowNull: false,
			defaultValue: "vocab",
		},
		questions: {
			type: DataTypes.JSON,
			allowNull: false,
		},
		active_date: {
			type: DataTypes.DATEONLY,
			allowNull: false,
		},
	},
	{
		tableName: "daily_trials",
		freezeTableName: true,
		timestamps: false,
	}
);

module.exports = DailyTrial;
