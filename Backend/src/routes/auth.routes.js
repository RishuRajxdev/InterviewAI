const express = require("express");
const app = express();
const authMiddleware = require("../middlewares/auth.middleware.js");
const authController = require("../controllers/auth.controllers.js");

const authRouter = express.Router();
/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */
authRouter.post("/register", authController.registerUserController);
/**
 * @route POST /api/auth/login
 * @description Login user with Username or Email and password
 * @access Public
 */
authRouter.post("/login", authController.loginUserController);

/**
 * @route GET/api/auth/logout
 * @description Logout a user by removing token from user cookie and add it to Token blacklist
 * @access Public
 */
authRouter.get("/logout", authController.logoutUserController);
/**
 * @route GET /api/auth/get-me
 * @description get the current logged in user details
 * @access private
 */
authRouter.get(
  "/get-me",
  authMiddleware.authUser,
  authController.getMeController,
);

module.exports = authRouter;
