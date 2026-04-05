const express = require("express");
const router = express.Router();
const {
    getSummary,
    getCategoryBreakdown,
    getMonthlyTrends,
    getWeeklyTrends,
    getRecentActivity,
} = require("../controllers/dashboardController");
const { authenticate } = require("../middleware/auth");

// All roles can access dashboard
router.use(authenticate);

router.get("/summary", getSummary);
router.get("/recent-activity", getRecentActivity);

// analyst and admin only for detailed insights
router.get("/category-breakdown", getCategoryBreakdown);
router.get("/monthly-trends", getMonthlyTrends);
router.get("/weekly-trends", getWeeklyTrends);

module.exports = router;