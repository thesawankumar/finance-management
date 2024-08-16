const express = require("express");
const {
  createExpense,
  getAllExpense,
  getSingleExpense,
  updateExpense,
  deleteExpense,
  getExpenseBreakdown,
  getExpensesOverTime,
} = require("../controllers/expense");
const { isAuthenticatedUser } = require("../middleware/auth");

const router = express.Router();

router.post("/expense", isAuthenticatedUser, createExpense);
router.get("/expense/all", isAuthenticatedUser, getAllExpense);
router.get("/expense/:id", isAuthenticatedUser, getSingleExpense);
router.put("/expense/:id", isAuthenticatedUser, updateExpense);
router.delete("/expense/:id", isAuthenticatedUser, deleteExpense);
router.get("/expense/breakdown", isAuthenticatedUser, getExpenseBreakdown);
router.get("/expense/over-time", isAuthenticatedUser, getExpensesOverTime);

module.exports = router;
