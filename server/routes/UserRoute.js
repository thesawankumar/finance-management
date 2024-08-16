const express = require("express");
const { isAuthenticatedUser } = require("../middleware/auth");
const {
  registerUser,
  loginUser,
  logout,
  getUser,
} = require("../controllers/user");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logout);
router.get("/me", isAuthenticatedUser, getUser);

module.exports = router;
