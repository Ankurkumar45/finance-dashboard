const Transaction = require("../models/Transaction");

const getSummary = async (dateRange = {}) => {
    const matchStage = { isDeleted: { $ne: true } };

    if (dateRange.startDate || dateRange.endDate) {
        matchStage.date = {};
        if (dateRange.startDate) matchStage.date.$gte = new Date(dateRange.startDate);
        if (dateRange.endDate) matchStage.date.$lte = new Date(dateRange.endDate);
    }

    const summary = await Transaction.aggregate([
        { $match: matchStage },
        {
            $group: {
                _id: "$type",
                total: { $sum: "$amount" },
                count: { $sum: 1 },
            },
        },
    ]);

    const income = summary.find((s) => s._id === "income") || { total: 0, count: 0 };
    const expense = summary.find((s) => s._id === "expense") || { total: 0, count: 0 };

    return {
        totalIncome: income.total,
        totalExpenses: expense.total,
        netBalance: income.total - expense.total,
        incomeCount: income.count,
        expenseCount: expense.count,
        totalTransactions: income.count + expense.count,
    };
};

const getCategoryBreakdown = async (type = null, dateRange = {}) => {
    const matchStage = { isDeleted: { $ne: true } };
    if (type) matchStage.type = type;

    if (dateRange.startDate || dateRange.endDate) {
        matchStage.date = {};
        if (dateRange.startDate) matchStage.date.$gte = new Date(dateRange.startDate);
        if (dateRange.endDate) matchStage.date.$lte = new Date(dateRange.endDate);
    }

    const breakdown = await Transaction.aggregate([
        { $match: matchStage },
        {
            $group: {
                _id: { type: "$type", category: "$category" },
                total: { $sum: "$amount" },
                count: { $sum: 1 },
            },
        },
        {
            $group: {
                _id: "$_id.type",
                categories: {
                    $push: {
                        category: "$_id.category",
                        total: "$total",
                        count: "$count",
                    },
                },
                typeTotal: { $sum: "$total" },
            },
        },
        { $sort: { _id: 1 } },
    ]);

    return breakdown;
};

const getMonthlyTrends = async (year = new Date().getFullYear()) => {
    const trends = await Transaction.aggregate([
        {
            $match: {
                isDeleted: { $ne: true },
                date: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31T23:59:59`),
                },
            },
        },
        {
            $group: {
                _id: {
                    month: { $month: "$date" },
                    type: "$type",
                },
                total: { $sum: "$amount" },
                count: { $sum: 1 },
            },
        },
        { $sort: { "_id.month": 1 } },
    ]);

    // Shape into 12-month structure
    const months = Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        monthName: new Date(year, i, 1).toLocaleString("default", { month: "long" }),
        income: 0,
        expense: 0,
        net: 0,
    }));

    trends.forEach(({ _id, total }) => {
        const month = months[_id.month - 1];
        if (_id.type === "income") month.income = total;
        if (_id.type === "expense") month.expense = total;
        month.net = month.income - month.expense;
    });

    return months;
};

const getWeeklyTrends = async () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const trends = await Transaction.aggregate([
        {
            $match: {
                isDeleted: { $ne: true },
                date: { $gte: sevenDaysAgo },
            },
        },
        {
            $group: {
                _id: {
                    date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                    type: "$type",
                },
                total: { $sum: "$amount" },
            },
        },
        { $sort: { "_id.date": 1 } },
    ]);

    return trends;
};

const getRecentActivity = async (limit = 5) => {
    return Transaction.find()
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 })
        .limit(limit);
};

module.exports = {
    getSummary,
    getCategoryBreakdown,
    getMonthlyTrends,
    getWeeklyTrends,
    getRecentActivity,
};