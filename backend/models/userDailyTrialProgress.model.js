const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const UserDailyTrialProgress = sequelize.define(
	"user_daily_trial_progresses",
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "users",
				key: "id",
			},
			onUpdate: "CASCADE",
			onDelete: "CASCADE",
		},
		trial_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "daily_trials",
				key: "id",
			},
			onUpdate: "CASCADE",
			onDelete: "CASCADE",
		},
		completed_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
	},
	{
		tableName: "user_daily_trial_progresses",
		freezeTableName: true,
		timestamps: false,
	}
);

module.exports = UserDailyTrialProgress;
