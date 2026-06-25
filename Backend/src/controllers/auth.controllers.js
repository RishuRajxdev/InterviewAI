const express = require("express");
const app = express();
const userModel = require("../models/user.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const tokenBlackListModel = require("../models/blacklist.model.js");
/**
 * 
 * @name registerUserController
 * @description register a new user, expects username,email and password
 * @returns PUBLIC
 */
async function registerUserController(req, res) {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({
      message: "Please Provide the username,email and password",
    });
  }
  const isUserAlreadyExist = await userModel.findOne({
    $or: [{ username }, { email }],
  });
  if (isUserAlreadyExist) {
    return res.status(400).json({
      message: `Account already exists ${isUserAlreadyExist.username= username}`,
    });
  }
  const hash = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    username,
    email,
    password: hash,
  });
  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );
  res.cookie("token", token);
  res.status(201).json({
    message: "User successfully registered",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}
/**
 
 * @name  loginUserController
 * @description  login a user, expoects email and password in the request body
 * @access Public
 */


async function loginUserController(req, res) {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(400).json({
      message: "Invalid email or password",
    });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({
      message: "Invalid email or Password",
    });
  }
  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );
  res.cookie("token", token);
  res.status(200).json({
    message: "User LoggedIN successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}
/**
 * @name logoutUserController
 * @description Logut the user and set the token in Blacklist.
 */
async function logoutUserController(req, res) {
  const token = req.cookies.token;
  if (token) {
    await tokenBlackListModel.create({ token });
  }
  res.clearCookie("token");
  res.status(200).json({
    message: "User logged out successfully",
  });
}
/**
 * 
 *@description Get the current logged user. 
 */
async function getMeController(req, res) {
  const user = await userModel.findById(req.user.id);
  res.status(200).json({
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

module.exports = {
  registerUserController,
  loginUserController,
  logoutUserController,
  getMeController,
};
