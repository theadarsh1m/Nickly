const express = require("express");
const {
  renderAdminPage,
  handleDeleteLink,
  handleDeleteUser,
  handleToggleRole,
} = require("../controllers/admin");

const router = express.Router();

// Admin middleware - checks if the logged-in user has admin role
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).send("Access denied. Admins only.");
  }
  next();
}

router.use(requireAdmin);

router.get("/", renderAdminPage);
router.post("/delete-link/:id", handleDeleteLink);
router.post("/delete-user/:id", handleDeleteUser);
router.post("/toggle-role/:id", handleToggleRole);

module.exports = router;
