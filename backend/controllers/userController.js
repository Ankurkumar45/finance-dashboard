const userService = require("../services/userService");

const getAllUsers = async (req, res, next) => {
    try {
        const { status, role, page, limit } = req.query;
        const result = await userService.getAllUsers({ status, role, page, limit });
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

const getUserById = async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.params.id);
        res.status(200).json({ success: true, data: { user } });
    } catch (error) {
        next(error);
    }
};

const updateUser = async (req, res, next) => {
    try {
        const user = await userService.updateUser(req.params.id, req.body, req.user);
        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: { user },
        });
    } catch (error) {
        next(error);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        await userService.deleteUser(req.params.id, req.user._id);
        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser };