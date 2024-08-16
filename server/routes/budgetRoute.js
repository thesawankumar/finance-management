const express = require("express");
const router = express.Router();
const {
  monthlyBudget,
  yearlyBudget,
  getUserId,
} = require("../controllers/budget");

router.post("/budget/monthly", monthlyBudget);
router.post("/budget/yearly", yearlyBudget);
router.get("/budget/:userId", getUserId);

module.exports = router;
