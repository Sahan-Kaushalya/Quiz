const { LandingPageConfig } = require("../../../models/associations");

const getLandingPageConfig = async (req, res, next) => {
  try {
    let config = await LandingPageConfig.findOne();
    if (!config) {
      config = await LandingPageConfig.create({
        logo_url: null,
        icon_url: null,
        theme_color: "indigo",
        hero_title: "Master Every Subject",
        hero_sinhala: "විෂය සියල්ල ජය ගන්න",
        hero_desc: "Comprehensive practice for Mathematics, Sinhala, Environment & IQ — all in one place.",
        hero_design: "design1",
        subjects_design: "design1",
        features_design: "design1",
        testimonials_design: "design1",
      });
    }
    return res.status(200).json({
      status: "success",
      data: config,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLandingPageConfig,
};
