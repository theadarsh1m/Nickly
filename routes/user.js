const express = require("express");
const {
  handleUserSignup,
  handleUserLogin,
  handleUserLogout,
  renderSignupPage,
  renderLoginPage,
} = require("../controllers/user");

const router = express.Router();

router.get("/signup", renderSignupPage);
router.post("/signup", handleUserSignup);

router.get("/login", renderLoginPage);
router.post("/login", handleUserLogin);

router.get("/logout", handleUserLogout);

module.exports = router;
