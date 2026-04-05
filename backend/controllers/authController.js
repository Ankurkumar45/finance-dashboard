const authService = require("../services/authService");

const register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        const result = await authService.register({ name, email, password, role });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login({ email, password });

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const getProfile = async (req, res) => {
    res.status(200).json({
        success: true,
        data: { user: req.user },
    });
};

module.exports = { register, login, getProfile };