const express = require("express");
const router = express.Router();
const { generateReport, exportReport } = require("../controllers/report");

router.post("/report/generate", generateReport);
router.post("/report/export", exportReport);
module.exports = router;
