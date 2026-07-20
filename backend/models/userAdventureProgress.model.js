const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const UserAdventureProgress = sequelize.define(
	"user_adventure_progresses",
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
		quest_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "adventure_quests",
				key: "id",
			},
			onUpdate: "CASCADE",
			onDelete: "CASCADE",
		},
		status: {
			type: DataTypes.ENUM("completed", "failed"),
			allowNull: false,
			defaultValue: "completed",
		},
		completed_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
	},
	{
		tableName: "user_adventure_progresses",
		freezeTableName: true,
		timestamps: false,
	}
);

module.exports = UserAdventureProgress;
