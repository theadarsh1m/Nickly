const express = require('express');
const router = express.Router(); // to handle modular routes.

router.get("/", (req, res) => {
    return res.render("home");
})

module.exports = router;
