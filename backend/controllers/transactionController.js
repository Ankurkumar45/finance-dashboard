const transactionService = require("../services/transactionService");

const createTransaction = async (req, res, next) => {
    try {
        const transaction = await transactionService.createTransaction(req.body, req.user._id);
        res.status(201).json({
            success: true,
            message: "Transaction created successfully",
            data: { transaction },
        });
    } catch (error) {
        next(error);
    }
};

const getTransactions = async (req, res, next) => {
    try {
        const { page, limit, type, category, startDate, endDate, search, sortBy, sortOrder } = req.query;
        const result = await transactionService.getTransactions(
            { type, category, startDate, endDate, search },
            { page, limit, sortBy, sortOrder }
        );
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

const getTransactionById = async (req, res, next) => {
    try {
        const transaction = await transactionService.getTransactionById(req.params.id);
        res.status(200).json({ success: true, data: { transaction } });
    } catch (error) {
        next(error);
    }
};

const updateTransaction = async (req, res, next) => {
    try {
        const transaction = await transactionService.updateTransaction(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: "Transaction updated successfully",
            data: { transaction },
        });
    } catch (error) {
        next(error);
    }
};

const deleteTransaction = async (req, res, next) => {
    try {
        await transactionService.deleteTransaction(req.params.id);
        res.status(200).json({ success: true, message: "Transaction deleted successfully" });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createTransaction,
    getTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
};