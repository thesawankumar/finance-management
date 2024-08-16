const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Expense = require("../models/expenseModel");

exports.createExpense = catchAsyncErrors(async (req, res) => {
  const { category, amount, date, currency, description } = req.body;
  const user = req.user._id;

  try {
    const expense = await Expense.create({
      category,
      amount,
      date,
      currency,
      description,
      user,
    });
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//getall expenses
exports.getAllExpense = catchAsyncErrors(async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id });
    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//get single expense
exports.getSingleExpense = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;

  try {
    const expense = await Expense.findOne({ _id: id, user: req.user._id });
    if (!expense) {
      res.status(404).json({ message: "Expense not found" });
    } else {
      res.status(200).json(expense);
    }
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//update expense

exports.updateExpense = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;
  const { category, amount, date, currency, description } = req.body;

  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { category, amount, date, currency, description },
      { new: true }
    );
    if (!expense) {
      res.status(404).json({ message: "Expense not found" });
    } else {
      res.status(200).json(expense);
    }
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//delete expense

exports.deleteExpense = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;
  try {
    const expense = await Expense.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });
    if (!expense) {
      res.status(404).json({ message: "Expense not found" });
    } else {
      res.status(204).json({ message: "Expense deleted successfully" });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// expenseController.js

// Get expense breakdown by category
exports.getExpenseBreakdown = catchAsyncErrors(async (req, res) => {
  try {
    const expenses = await Expense.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
        },
      },
      { $project: { _id: 0, category: "$_id", totalAmount: 1 } },
    ]);

    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});
// Get expenses over time (monthly)
exports.getExpensesOverTime = catchAsyncErrors(async (req, res) => {
  try {
    const expenses = await Expense.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          totalAmount: 1,
        },
      },
    ]);

    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});
