const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Budget = require("../models/budgetModel");
const mongoose = require("mongoose");

exports.monthlyBudget = catchAsyncErrors(async (req, res) => {
  const { user, monthlyBudget, currency } = req.body;

  // Validate user ID
  if (!mongoose.Types.ObjectId.isValid(user)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const budget = await Budget.findOneAndUpdate(
      { user },
      { $set: { monthlyBudget, currency } },
      { new: true, upsert: true }
    );

    res.status(200).json(budget);
  } catch (error) {
    console.error("Error saving monthly budget:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

exports.yearlyBudget = catchAsyncErrors(async (req, res) => {
  const { user, yearlyBudget, currency } = req.body;

  // Validate user ID
  if (!mongoose.Types.ObjectId.isValid(user)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const budget = await Budget.findOneAndUpdate(
      { user },
      { $set: { yearlyBudget, currency } },
      { new: true, upsert: true }
    );

    res.status(200).json(budget);
  } catch (error) {
    console.error("Error saving yearly budget:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
exports.getUserId = catchAsyncErrors(async (req, res) => {
  try {
    const budget = await Budget.findOne({ user: req.params.userId });
    if (!budget) {
      return res.status(404).json({ error: "Budget not found" });
    }
    res.json(budget);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});
