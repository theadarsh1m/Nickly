const User = require("../models/user");
const { setUser } = require("../services/auth");
const bcrypt = require("bcryptjs");

async function handleUserSignup(req, res) {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.render("signup", { error: "All fields are required" });
  }

  try {
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.render("signup", { error: "Email already in use" });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.render("signup", { error: "Username already taken" });
    }

    await User.create({
      username,
      email,
      password,
    });

    return res.redirect("/user/login");
  } catch (err) {
    console.error(err);
    return res.render("signup", { error: "Something went wrong" });
  }
}

async function handleUserLogin(req, res) {
  const { emailOrUsername, password } = req.body;
  if (!emailOrUsername || !password) {
    return res.render("login", { error: "All fields are required" });
  }

  try {
    const user = await User.findOne({ 
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }] 
    });
    if (!user) {
      return res.render("login", { error: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render("login", { error: "Invalid username or password" });
    }

    const token = setUser(user);
    res.cookie("token", token, { httpOnly: true });
    return res.redirect("/");
  } catch (err) {
    console.error(err);
    return res.render("login", { error: "Something went wrong" });
  }
}

function handleUserLogout(req, res) {
  res.clearCookie("token");
  return res.redirect("/");
}

function renderSignupPage(req, res) {
  return res.render("signup");
}

function renderLoginPage(req, res) {
  return res.render("login");
}

module.exports = {
  handleUserSignup,
  handleUserLogin,
  handleUserLogout,
  renderSignupPage,
  renderLoginPage,
};
