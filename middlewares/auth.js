const { getUser } = require("../services/auth");

function checkForAuthentication(req, res, next) {
  const tokenCookie = req.cookies?.token;
  req.user = null;

  if (!tokenCookie) return next();

  const user = getUser(tokenCookie);
  if (user) {
    req.user = user;
  }
  return next();
}

module.exports = {
  checkForAuthentication,
};
