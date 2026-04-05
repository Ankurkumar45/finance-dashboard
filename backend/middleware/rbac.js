/**
 * Role-Based Access Control Middleware
 *
 * Role Hierarchy:
 * - viewer: Can only GET dashboard & transactions
 * - analyst: Can GET everything including insights/summaries
 * - admin: Full CRUD access on all resources
 */

const ROLE_PERMISSIONS = {
    viewer: ["read:dashboard", "read:transactions"],
    analyst: ["read:dashboard", "read:transactions", "read:insights", "read:users"],
    admin: [
      "read:dashboard",
      "read:transactions",
      "read:insights",
      "read:users",
      "write:transactions",
      "delete:transactions",
      "manage:users",
    ],
  };
  
  // Check if role has a specific permission
  const hasPermission = (role, permission) => {
    return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
  };
  
  // Middleware factory: restrict by role
  const authorize = (...allowedRoles) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ success: false, message: "Not authenticated." });
      }
  
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Required role: ${allowedRoles.join(" or ")}. Your role: ${req.user.role}`,
        });
      }
  
      next();
    };
  };
  
  // Middleware factory: restrict by permission
  const requirePermission = (permission) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ success: false, message: "Not authenticated." });
      }
  
      if (!hasPermission(req.user.role, permission)) {
        return res.status(403).json({
          success: false,
          message: `You do not have permission to perform this action. Required: ${permission}`,
        });
      }
  
      next();
    };
  };
  
  module.exports = { authorize, requirePermission, hasPermission, ROLE_PERMISSIONS };