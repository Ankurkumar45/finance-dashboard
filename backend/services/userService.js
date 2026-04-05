const User = require("../models/User");

const getAllUsers = async (filters = {}) => {
    const { status, role, page = 1, limit = 10 } = filters;
    const query = {};

    if (status) query.status = status;
    if (role) query.role = role;

    const skip = (Number(page) - 1) * Number(limit);

    const [users, total] = await Promise.all([
        User.find(query).select("-password").sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
        User.countDocuments(query),
    ]);

    return {
        users,
        pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / Number(limit)),
        },
    };
};

const getUserById = async (id) => {
    const user = await User.findById(id).select("-password");
    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }
    return user;
};

const updateUser = async (id, data, requestingUser) => {
    // Only admins can change roles
    if (data.role && requestingUser.role !== "admin") {
        const error = new Error("Only admins can change user roles");
        error.statusCode = 403;
        throw error;
    }

    // Prevent self-deactivation
    if (data.status === "inactive" && id === requestingUser._id.toString()) {
        const error = new Error("You cannot deactivate your own account");
        error.statusCode = 400;
        throw error;
    }

    const user = await User.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }
    return user;
};

// Soft delete user
const deleteUser = async (id, requestingUserId) => {
    if (id === requestingUserId.toString()) {
        const error = new Error("You cannot delete your own account");
        error.statusCode = 400;
        throw error;
    }

    const user = await User.findByIdAndUpdate(
        id,
        { isDeleted: true, status: "inactive" },
        { new: true }
    );

    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }
    return user;
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser };