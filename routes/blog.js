const express = require("express");
const { getBlogIndex, getBlogPost } = require("../controllers/blog");

const router = express.Router();

router.get("/", getBlogIndex);
router.get("/:slug", getBlogPost);

module.exports = router;
