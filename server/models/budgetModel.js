const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  monthlyBudget: {
    type: Number,
    required: true,
  },
  yearlyBudget: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: "USD",
  },
});

module.exports = mongoose.model("Budget", budgetSchema);
