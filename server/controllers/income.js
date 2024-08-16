const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Income = require("../models/incomeModel");
exports.createIncome = catchAsyncErrors(async (req, res) => {
  const { category, amount, date, currency, description } = req.body;
  const user = req.user._id;

  try {
    const income = await Income.create({
      category,
      amount,
      date,
      currency,
      description,
      user,
    });
    res.status(201).json(income);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});
exports.getAllIncome = catchAsyncErrors(async (req, res) => {
  try {
    const incomes = await Income.find({ user: req.user._id });
    res.status(200).json(incomes);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

exports.getTotalIncome = catchAsyncErrors(async (req, res) => {
  try {
    const income = await Income.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: null,
          totalIncome: { $sum: "$amount" },
        },
      },
      {
        $project: { _id: 0, totalIncome: 1 },
      },
    ]);

    res.status(200).json(income[0] ? income[0].totalIncome : 0);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});
exports.getSingleIncome = catchAsyncErrors(async (req, res) => {
  try {
    const income = await Income.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!income) {
      res.status(404).json({ message: "Income not found" });
    } else {
      res.status(200).json(income);
    }
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

exports.updateIncome = catchAsyncErrors(async (req, res) => {
  const { category, amount, date, currency, description } = req.body;
  const id = req.params.id;

  try {
    const income = await Income.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { category, amount, date, currency, description },
      { new: true }
    );
    if (!income) {
      res.status(404).json({ message: "Income not found" });
    } else {
      res.status(200).json(income);
    }
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

exports.deleteIncome = catchAsyncErrors(async (req, res) => {
  const id = req.params.id;

  try {
    const income = await Income.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });
    if (!income) {
      res.status(404).json({ message: "Income not found" });
    } else {
      res.status(204).json();
    }
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});
