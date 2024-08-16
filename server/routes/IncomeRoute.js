const express = require("express");
const { isAuthenticatedUser } = require("../middleware/auth");
const {
  createIncome,
  getAllIncome,
  getSingleIncome,
  updateIncome,
  deleteIncome,
  getTotalIncome,
} = require("../controllers/income");
const router = express.Router();

router.post("/income", isAuthenticatedUser, createIncome);
router.get("/income/all", isAuthenticatedUser, getAllIncome);
router.get("/income/total", isAuthenticatedUser, getTotalIncome);
router.get("/income/:id", isAuthenticatedUser, getSingleIncome);
router.put("/income/:id", isAuthenticatedUser, updateIncome);
router.delete("/income/:id", isAuthenticatedUser, deleteIncome);

module.exports = router;
