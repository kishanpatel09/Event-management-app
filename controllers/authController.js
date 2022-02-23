const express = require("express");
const User = require("../models/User");

exports.register = async (req, res, next) => {
  const { name, email, password, role } = req.body;

  //create user
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  sendTokenResponse(user, 200, res);
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  //validate email & password
  if (!email || !password) {
    return next("give email and password");
  }

  //create token
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("give correct ans"));
  }

  //check if password matches
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next("give correct ans");
  }
  sendTokenResponse(user, 200, res);
};

//get token from model, create cookie and end response
const sendTokenResponse = (user, statusCode, res) => {
  //create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token });
};
