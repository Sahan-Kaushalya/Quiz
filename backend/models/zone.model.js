const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const Zone = sequelize.define(
	"zones",
	{
		id: {
			type: DataTypes.STRING(50),
			primaryKey: true,
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		short_name: {
			type: DataTypes.STRING(50),
			allowNull: false,
		},
		xp: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 300,
		},
		gradient: {
			type: DataTypes.STRING(100),
			allowNull: false,
			defaultValue: "from-slate-400 to-slate-500",
		},
		border_color: {
			type: DataTypes.STRING(100),
			allowNull: false,
			defaultValue: "border-slate-300",
		},
		shadow_color: {
			type: DataTypes.STRING(100),
			allowNull: false,
			defaultValue: "shadow-slate-200",
		},
		bg_light: {
			type: DataTypes.STRING(100),
			allowNull: false,
			defaultValue: "bg-slate-50",
		},
		image_url: {
			type: DataTypes.STRING(500),
			allowNull: true,
		},
		pos_x: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 100,
		},
		pos_y: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 100,
		},
		delay: {
			type: DataTypes.STRING(20),
			allowNull: false,
			defaultValue: "0s",
		},
		is_active: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true,
		},
		sort_order: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1,
		},
	},
	{
		tableName: "zones",
		freezeTableName: true,
		timestamps: false,
	}
);

module.exports = Zone;
