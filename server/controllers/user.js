const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/errorhandler");
const User = require("../models/userModel");
const sendToken = require("../utils/JwtToken");

exports.registerUser = catchAsyncErrors(async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password });
    sendToken(user, 201, res);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
});
// Login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email & Password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  sendToken(user, 200, res);
});

// Logout User
exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});
exports.getUser = catchAsyncErrors(async (req, res) => {
  try {
    const userId = req.user.id; 

    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(403).json({ err: "can not fectch user" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ err: "server error" });
  }
});
