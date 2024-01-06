const express = require("express");
const asyncHandler = require("express-async-handler");
const User = require("../models/authSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const authRouter = express.Router();

const JWT_SECRET = "FullStack";

//creating a new user using POST method /api/auth/createuser
authRouter.post("/createuser", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({ message: "all fields are mendatory" });
  }
  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    res
      .status(400)
      .json({ message: "the user along with email already exist" });
  } else {
    try {
      const hashedPassword = await bcrypt.hash(password, 7);
      const result = await User.create({
        name,
        email,
        password: hashedPassword,
      });
      const name = result.name;
      const authToken = jwt.sign(data, JWT_SECRET);
      res
        .status(200)
        .json({
          message: "user created successfully",
          result,
          authToken,
          name,
        });
    } catch (error) {
      console.log("internal server error", error);
      res.status(400).json({ message: "internal server error" });
    }
  }
});

//login a user using POST method /api/auth/login
authRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(404).json({ message: "please enter with right credentials" });
    }
    const userDetails = await User.findOne({ email });
    if (!userDetails) {
      res.status(404).json({ message: "User does not exist", success: false });
    } else {
      const isCorrectPassword = await bcrypt.compare(
        password,
        userDetails.password
      );
      if (isCorrectPassword) {
        const data = {
          id: userDetails.id,
        };
        const userName = userDetails.name;
        const authToken = jwt.sign(data, JWT_SECRET);
        res.status(200).json({
          message: "User login successfully",
          authToken,
          success: true,
          userName,
        });
      } else {
        res.status(401).json({
          message: "Please enter with right credentials",
          success: false,
        });
      }
    }
  })
);

module.exports = authRouter;
