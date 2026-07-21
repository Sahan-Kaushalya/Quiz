const express = require("express");
const { getGrades, getSubjectsByGrade, getTopRankedUsers, getLeaderboard, getSubjects } = require("./controllers/grade.controller");
const { getPapers, createPaper, updatePaper, downloadPaper, bookmarkPaper, completePaper, createSubject, createYear } = require("./controllers/paper.controller");
const { getQuizzes, getQuizById, submitQuiz } = require("./controllers/quiz.controller");
const { getLandingPageReviews } = require("./controllers/reviews.controller");
const { getLandingPageConfig } = require("./controllers/config.controller");
const {
  getAdventureQuests,
  submitQuest,
  getDailyTrials,
  submitDailyTrial,
  getDailyBonusStatus,
  claimDailyBonus,
  getAdventureLeaderboard,
  getHearts,
  deductHeart
} = require("./controllers/adventure.controller");
const { requireUser, requireUserOrAdmin } = require("../../middleware/auth");
const { uploadMultipleFiles } = require("../../middleware/fileUpload");

const applicationRoutes = express.Router();

// Public Routes
applicationRoutes.get("/health", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Application Server is running",
        timestamp: new Date().toISOString(),
    });
});

applicationRoutes.get("/grades", getGrades);
applicationRoutes.get("/grades/:gradeId/subjects", getSubjectsByGrade);
applicationRoutes.get("/leaderboard/top-3", getTopRankedUsers);
applicationRoutes.get("/reviews", getLandingPageReviews);
applicationRoutes.get("/config/landing-page", getLandingPageConfig);

// Protected routes for registered users
applicationRoutes.get("/papers", requireUserOrAdmin, getPapers);
applicationRoutes.post("/papers", requireUserOrAdmin, uploadMultipleFiles("papers"), createPaper);
applicationRoutes.put("/papers/:paperId", requireUserOrAdmin, uploadMultipleFiles("papers"), updatePaper);
applicationRoutes.get("/subjects", requireUser, getSubjects);
applicationRoutes.post("/subjects", requireUserOrAdmin, createSubject);
applicationRoutes.post("/years", requireUserOrAdmin, createYear);
applicationRoutes.post("/papers/:paperId/download", requireUserOrAdmin, downloadPaper);
applicationRoutes.post("/papers/:paperId/bookmark", requireUserOrAdmin, bookmarkPaper);
applicationRoutes.post("/papers/:paperId/complete", requireUserOrAdmin, completePaper);

// Quizzes
applicationRoutes.get("/quizzes", requireUser, getQuizzes);
applicationRoutes.get("/quizzes/:quizId", requireUser, getQuizById);
applicationRoutes.post("/quizzes/:quizId/submit", requireUser, submitQuiz);

// Leaderboard
applicationRoutes.get("/leaderboard", requireUser, getLeaderboard);

// Adventure Quests
applicationRoutes.get("/adventure/quests", requireUser, getAdventureQuests);
applicationRoutes.post("/adventure/quests/:id/submit", requireUser, submitQuest);
applicationRoutes.get("/adventure/daily-trials", requireUser, getDailyTrials);
applicationRoutes.post("/adventure/daily-trials/:id/submit", requireUser, submitDailyTrial);
applicationRoutes.get("/adventure/daily-bonus", requireUser, getDailyBonusStatus);
applicationRoutes.post("/adventure/daily-bonus/claim", requireUser, claimDailyBonus);
applicationRoutes.get("/adventure/leaderboard", requireUser, getAdventureLeaderboard);
applicationRoutes.get("/adventure/hearts", requireUser, getHearts);
applicationRoutes.post("/adventure/hearts/deduct", requireUser, deductHeart);

module.exports = applicationRoutes;
