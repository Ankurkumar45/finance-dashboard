const express = require("express");
const router = express.Router();
const { register, login, getProfile } = require("../controllers/authController");
const { authenticate } = require("../middleware/auth");
const {
    registerValidation,
    loginValidation,
    validate,
} = require("../utils/validators");

router.post("/register", registerValidation, validate, register);
router.post("/login", loginValidation, validate, login);
router.get("/profile", authenticate, getProfile);

module.exports = router;