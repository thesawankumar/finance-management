const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const user = require("./routes/UserRoute");
const expense = require("./routes/ExpenseRoute");
const income = require("./routes/IncomeRoute");
const category = require("./routes/categoryRoute");
const budget = require("./routes/budgetRoute");
const report = require("./routes/reportRoute");
const { connect } = require("./config/db");

dotenv.config({ path: "server/.env" });
const PORT = process.env.PORT || 5000;

connect();
const corsOptions = {
  origin: "http://localhost:5173", // Your client’s origin
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  credentials: true, // Allow credentials (cookies)
};
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

app.use("/api/v1", user);
app.use("/api/v1", expense);
app.use("/api/v1", income);
app.use("/api/v1", category);
app.use("/api/v1", budget);
app.use("/api/v1", report);

app.listen(PORT, () => {
  console.log(`Server start at ${PORT}`);
});

app.use(express.static(path.join(__dirname, "../client/dist")));

// Route to serve index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/dist", "index.html"));
});

module.exports = app;
