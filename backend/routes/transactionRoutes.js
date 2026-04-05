const express = require("express");
const router = express.Router();
const {
    createTransaction,
    getTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
} = require("../controllers/transactionController");
const { authenticate } = require("../middleware/auth");
const { authorize } = require("../middleware/rbac");
const {
    transactionValidation,
    transactionQueryValidation,
    validate,
} = require("../utils/validators");

router.use(authenticate);

// viewer, analyst, admin can view
router.get("/", transactionQueryValidation, validate, getTransactions);
router.get("/:id", getTransactionById);

// Only admin and analyst (for insight access) — but creation/update/delete = admin only
router.post("/", authorize("admin"), transactionValidation, validate, createTransaction);
router.put("/:id", authorize("admin"), transactionValidation, validate, updateTransaction);
router.delete("/:id", authorize("admin"), deleteTransaction);

module.exports = router;