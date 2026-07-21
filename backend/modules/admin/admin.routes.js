const express = require("express");
const { loginAdmin, registerAdmin } = require("./controllers/adminAuth.controller");
const { getAllUsers, createUser, updateUser, deleteUser, getUserPerformance, getDashboardStats, toggleReviewVisibility } = require("./controllers/adminUser.controller");
const { getAllQuizzes, createQuiz, updateQuiz, deleteQuiz } = require("./controllers/adminQuiz.controller");
const { getAdminProfile, updateAdminProfile, changeAdminPassword, getOpenRouterKey, updateOpenRouterKey, updateLandingPageConfig } = require("./controllers/adminSettings.controller");
const { generateQuizFromAI, chatWithAI } = require("./controllers/adminAI.controller");
const { createAdventureQuest, createDailyTrial, getAdventureQuestsAdmin, getDailyTrialsAdmin, updateAdventureQuest, deleteAdventureQuest, toggleAdventureQuestActive, getBadgesAdmin, createBadgeAdmin, updateBadgeAdmin, deleteBadgeAdmin, awardBadgeToUserAdmin, getZonesAdmin, createZoneAdmin, updateZoneAdmin, deleteZoneAdmin, toggleZoneActiveAdmin } = require("./controllers/adminAdventure.controller");
const { requireAdmin } = require("../../middleware/auth");
const { uploadSingleFile, uploadMultipleFiles, UPLOAD_CONFIG } = require("../../middleware/fileUpload");

const adminRoutes = express.Router();

// Public Routes
adminRoutes.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Admin Server is running",
    timestamp: new Date().toISOString(),
  });
});

adminRoutes.post("/login", loginAdmin);
adminRoutes.post("/register", registerAdmin);

// Admin Settings Routes
adminRoutes.get("/settings/profile", requireAdmin, getAdminProfile);
adminRoutes.put("/settings/profile", requireAdmin, uploadSingleFile("profiles"), updateAdminProfile);
adminRoutes.put("/settings/change-password", requireAdmin, changeAdminPassword);
adminRoutes.get("/settings/openrouter-key", requireAdmin, getOpenRouterKey);
adminRoutes.put("/settings/openrouter-key", requireAdmin, updateOpenRouterKey);
adminRoutes.put("/settings/landing-page", requireAdmin, uploadMultipleFiles("profiles"), updateLandingPageConfig);
adminRoutes.post("/ai-assistant/generate-quiz", requireAdmin, generateQuizFromAI);
adminRoutes.post("/ai-assistant/chat", requireAdmin, chatWithAI);

// Protected Admin Routes
adminRoutes.get("/users", requireAdmin, getAllUsers);
adminRoutes.post("/users", requireAdmin, uploadSingleFile("profiles"), createUser);
adminRoutes.put("/users/:userId", requireAdmin, uploadSingleFile("profiles"), updateUser);
adminRoutes.delete("/users/:userId", requireAdmin, deleteUser);
adminRoutes.get("/users/:userId/performance", requireAdmin, getUserPerformance);
adminRoutes.put("/users/:userId/review/visibility", requireAdmin, toggleReviewVisibility);
adminRoutes.get("/dashboard-stats", requireAdmin, getDashboardStats);

// Quizzes CRUD Routes
adminRoutes.get("/quizzes", requireAdmin, getAllQuizzes);
adminRoutes.post("/quizzes", requireAdmin, createQuiz);
adminRoutes.put("/quizzes/:quizId", requireAdmin, updateQuiz);
adminRoutes.delete("/quizzes/:quizId", requireAdmin, deleteQuiz);
adminRoutes.post("/quizzes/upload-image", requireAdmin, uploadSingleFile("quiz-questions"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: "fail",
        message: "No file uploaded",
      });
    }
    const fileUrl = UPLOAD_CONFIG.getUrlPath("quiz-questions", req.file.filename);
    return res.status(200).json({
      status: "success",
      message: "Question image uploaded successfully",
      data: {
        url: fileUrl,
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
});

// Admin Adventure Routes
adminRoutes.get("/adventure/quests", requireAdmin, getAdventureQuestsAdmin);
adminRoutes.post("/adventure/quests", requireAdmin, createAdventureQuest);
adminRoutes.put("/adventure/quests/:id", requireAdmin, updateAdventureQuest);
adminRoutes.delete("/adventure/quests/:id", requireAdmin, deleteAdventureQuest);
adminRoutes.put("/adventure/quests/:id/toggle-active", requireAdmin, toggleAdventureQuestActive);
adminRoutes.get("/adventure/daily-trials", requireAdmin, getDailyTrialsAdmin);
adminRoutes.post("/adventure/daily-trials", requireAdmin, createDailyTrial);

// Admin Badge Routes
adminRoutes.get("/adventure/badges", requireAdmin, getBadgesAdmin);
adminRoutes.post("/adventure/badges", requireAdmin, createBadgeAdmin);
adminRoutes.put("/adventure/badges/:id", requireAdmin, updateBadgeAdmin);
adminRoutes.delete("/adventure/badges/:id", requireAdmin, deleteBadgeAdmin);
adminRoutes.post("/adventure/badges/:id/award", requireAdmin, awardBadgeToUserAdmin);

// Admin Zone Routes
adminRoutes.get("/adventure/zones", requireAdmin, getZonesAdmin);
adminRoutes.post("/adventure/zones", requireAdmin, createZoneAdmin);
adminRoutes.put("/adventure/zones/:id", requireAdmin, updateZoneAdmin);
adminRoutes.delete("/adventure/zones/:id", requireAdmin, deleteZoneAdmin);
adminRoutes.put("/adventure/zones/:id/toggle-active", requireAdmin, toggleZoneActiveAdmin);

module.exports = adminRoutes;