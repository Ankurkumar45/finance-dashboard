const Transaction = require("../models/Transaction");

const createTransaction = async (data, userId) => {
    const transaction = await Transaction.create({ ...data, createdBy: userId });
    return transaction.populate("createdBy", "name email");
};

const getTransactions = async (filters = {}, options = {}) => {
    const {
        type,
        category,
        startDate,
        endDate,
        search,
        page = 1,
        limit = 10,
        sortBy = "date",
        sortOrder = "desc",
    } = { ...filters, ...options };

    const query = {};

    if (type) query.type = type;
    if (category) query.category = category;

    if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = new Date(startDate);
        if (endDate) query.date.$lte = new Date(endDate);
    }

    if (search) {
        query.description = { $regex: search, $options: "i" };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

    const [transactions, total] = await Promise.all([
        Transaction.find(query)
            .populate("createdBy", "name email")
            .sort(sort)
            .skip(skip)
            .limit(Number(limit)),
        Transaction.countDocuments(query),
    ]);

    return {
        transactions,
        pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / Number(limit)),
            hasNextPage: Number(page) < Math.ceil(total / Number(limit)),
            hasPrevPage: Number(page) > 1,
        },
    };
};

const getTransactionById = async (id) => {
    const transaction = await Transaction.findById(id).populate("createdBy", "name email");
    if (!transaction) {
        const error = new Error("Transaction not found");
        error.statusCode = 404;
        throw error;
    }
    return transaction;
};

const updateTransaction = async (id, data) => {
    const transaction = await Transaction.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true, runValidators: true }
    ).populate("createdBy", "name email");

    if (!transaction) {
        const error = new Error("Transaction not found");
        error.statusCode = 404;
        throw error;
    }
    return transaction;
};

// Soft delete
const deleteTransaction = async (id) => {
    const transaction = await Transaction.findByIdAndUpdate(
        id,
        { isDeleted: true, deletedAt: new Date() },
        { new: true }
    );
    if (!transaction) {
        const error = new Error("Transaction not found");
        error.statusCode = 404;
        throw error;
    }
    return transaction;
};

module.exports = {
    createTransaction,
    getTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
};