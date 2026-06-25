const jwt = require("jsonwebtoken");
const tokenBlackListModel = require("../models/blacklist.model");

async function authUser(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      message: "Token not provided",
    });
  }
// if we get the token will check if its blacklisted or not.
  const isTokenBlacklisted = await tokenBlackListModel.findOne({ token });
  if (isTokenBlacklisted) {
    return res.staus(401).json({
      message: "Token Invalid.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);//Throws Errror if not verified or Expired Token.
    req.user = decoded;//New Property add req.user and added the decoded data.
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid Token",
    });
  }
}
module.exports = { authUser };
