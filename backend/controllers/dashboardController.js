const dashboardService = require("../services/dashboardService");

const getSummary = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;
        const summary = await dashboardService.getSummary({ startDate, endDate });
        res.status(200).json({ success: true, data: { summary } });
    } catch (error) {
        next(error);
    }
};

const getCategoryBreakdown = async (req, res, next) => {
    try {
        const { type, startDate, endDate } = req.query;
        const breakdown = await dashboardService.getCategoryBreakdown(type, { startDate, endDate });
        res.status(200).json({ success: true, data: { breakdown } });
    } catch (error) {
        next(error);
    }
};

const getMonthlyTrends = async (req, res, next) => {
    try {
        const year = parseInt(req.query.year) || new Date().getFullYear();
        const trends = await dashboardService.getMonthlyTrends(year);
        res.status(200).json({ success: true, data: { year, trends } });
    } catch (error) {
        next(error);
    }
};

const getWeeklyTrends = async (req, res, next) => {
    try {
        const trends = await dashboardService.getWeeklyTrends();
        res.status(200).json({ success: true, data: { trends } });
    } catch (error) {
        next(error);
    }
};

const getRecentActivity = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        const activity = await dashboardService.getRecentActivity(limit);
        res.status(200).json({ success: true, data: { activity } });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getSummary,
    getCategoryBreakdown,
    getMonthlyTrends,
    getWeeklyTrends,
    getRecentActivity,
};