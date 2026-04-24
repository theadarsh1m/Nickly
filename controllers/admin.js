const URL = require("../models/url");
const User = require("../models/user");

async function renderAdminPage(req, res) {
  try {
    const sortParam = req.query.sort || "newest";
    const typeFilter = req.query.type || "all";
    const searchQuery = req.query.search || "";

    let sortOption = { createdAt: -1 };
    if (sortParam === "oldest") sortOption = { createdAt: 1 };
    else if (sortParam === "text-first") sortOption = { entryType: 1, createdAt: -1 };
    else if (sortParam === "url-first") sortOption = { entryType: -1, createdAt: -1 };

    let query = {};
    if (typeFilter === "url") query.entryType = "url";
    else if (typeFilter === "text") query.entryType = "text";

    if (searchQuery.trim()) {
      query.$or = [
        { shortId: { $regex: searchQuery, $options: "i" } },
        { redirectURL: { $regex: searchQuery, $options: "i" } },
        { textContent: { $regex: searchQuery, $options: "i" } },
      ];
    }

    const allUrls = await URL.find(query).sort(sortOption).lean();
    const allUsers = await User.find({}).select("-password").lean();
    const stats = {
      totalLinks: await URL.countDocuments({}),
      totalUrls: await URL.countDocuments({ entryType: "url" }),
      totalTexts: await URL.countDocuments({ entryType: "text" }),
      totalUsers: await User.countDocuments({}),
    };

    const baseURL = process.env.BASE_URL || `http://localhost:${process.env.PORT || 8001}`;

    return res.render("admin", {
      urls: allUrls,
      users: allUsers,
      stats,
      baseURL,
      user: req.user,
      currentSort: sortParam,
      currentType: typeFilter,
      searchQuery,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
}

async function handleDeleteLink(req, res) {
  try {
    const { id } = req.params;
    await URL.findByIdAndDelete(id);
    return res.redirect("/admin");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
}

async function handleDeleteUser(req, res) {
  try {
    const { id } = req.params;
    // Don't allow deleting yourself
    if (id === req.user._id.toString() || id === req.user._id) {
      return res.redirect("/admin?error=Cannot delete yourself");
    }
    await User.findByIdAndDelete(id);
    // Also delete all links created by this user
    await URL.deleteMany({ createdBy: id });
    return res.redirect("/admin");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
}

async function handleToggleRole(req, res) {
  try {
    const { id } = req.params;
    if (id === req.user._id.toString() || id === req.user._id) {
      return res.redirect("/admin?error=Cannot change your own role");
    }
    const targetUser = await User.findById(id);
    if (!targetUser) return res.redirect("/admin");
    targetUser.role = targetUser.role === "admin" ? "user" : "admin";
    await targetUser.save();
    return res.redirect("/admin");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
}

module.exports = {
  renderAdminPage,
  handleDeleteLink,
  handleDeleteUser,
  handleToggleRole,
};
