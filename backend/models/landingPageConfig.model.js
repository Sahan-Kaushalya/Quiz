const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const LandingPageConfig = sequelize.define(
	"landing_page_configs",
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
		},
		logo_url: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		icon_url: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		theme_color: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: "indigo", // indigo, emerald, violet, rose, sky
		},
		hero_title: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: "Master Every Subject",
		},
		hero_sinhala: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: "විෂය සියල්ල ජය ගන්න",
		},
		hero_desc: {
			type: DataTypes.TEXT,
			allowNull: false,
			defaultValue: "Comprehensive practice for Mathematics, Sinhala, Environment & IQ — all in one place.",
		},
		hero_design: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: "design1", // design1, design2, design3
		},
		subjects_design: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: "design1", // design1, design2, design3
		},
		features_design: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: "design1", // design1, design2
		},
		testimonials_design: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: "design1", // design1, design2, design3
		},
	},
	{
		tableName: "landing_page_configs",
		freezeTableName: true,
		timestamps: false,
	}
);

module.exports = LandingPageConfig;
