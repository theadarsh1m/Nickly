const express = require("express");
const { renderHome } = require("../controllers/url");

const router = express.Router();

router.get("/", renderHome);

module.exports = router;
