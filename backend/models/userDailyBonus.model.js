const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const UserDailyBonus = sequelize.define(
	"user_daily_bonuses",
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
		last_claimed_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
	},
	{
		tableName: "user_daily_bonuses",
		freezeTableName: true,
		timestamps: false,
	}
);

module.exports = UserDailyBonus;
