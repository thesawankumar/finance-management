// models/Report.js
const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  startDate: Date,
  endDate: Date,
  reportType: String, // "monthly" or "yearly"
  data: mongoose.Schema.Types.Mixed, // Store your report data here
});

module.exports = mongoose.model("Report", reportSchema);
