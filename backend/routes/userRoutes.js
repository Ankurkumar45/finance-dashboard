const express = require("express");
const router = express.Router();
const { getAllUsers, getUserById, updateUser, deleteUser } = require("../controllers/userController");
const { authenticate } = require("../middleware/auth");
const { authorize } = require("../middleware/rbac");
const { updateUserValidation, validate } = require("../utils/validators");

router.use(authenticate);

// analyst and admin can view users
router.get("/", authorize("admin", "analyst"), getAllUsers);
router.get("/:id", authorize("admin", "analyst"), getUserById);

// Only admin can modify users
router.put("/:id", authorize("admin"), updateUserValidation, validate, updateUser);
router.delete("/:id", authorize("admin"), deleteUser);

module.exports = router;