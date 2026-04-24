const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET || "SuperSecretKey@123";

function setUser(user) {
  const payload = {
    _id: user._id,
    email: user.email,
    username: user.username,
    role: user.role || "user",
  };
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}

function getUser(token) {
  if (!token) return null;
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
}

module.exports = {
  setUser,
  getUser,
};
