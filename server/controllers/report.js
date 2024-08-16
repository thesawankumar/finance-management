const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Income = require("../models/incomeModel");
const Report = require("../models/reportModel");

exports.generateReport = catchAsyncErrors(async (req, res) => {
  const { startDate, endDate, reportType } = req.body;

  // Validate incoming data
  if (!startDate || !endDate || !reportType) {
    return res.status(400).send("Missing required fields");
  }

  try {
    // Ensure dates are valid
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).send("Invalid dates");
    }

    const data = await Income.find({
      date: { $gte: start, $lte: end },
    });

    if (reportType === "pdf") {
      // Create PDF logic here
    } else if (reportType === "csv") {
      // Create CSV logic here
    } else {
      return res.status(400).send("Unsupported report type");
    }
  } catch (error) {
    res.status(500).send("Error generating report");
    console.error(error);
  }
});

exports.exportReport = catchAsyncErrors(async (req, res) => {
  const format = req.query.format || "pdf";
  const dbName = "finance"; // Replace with your database name
  const collectionName = "income"; // Replace with your collection name
  const collection = getCollection(dbName, collectionName);

  try {
    const data = await collection.find({}).toArray(); // Fetch data from MongoDB

    if (format === "pdf") {
      // Create PDF
      const doc = new PDFDocument();
      res.setHeader("Content-Disposition", 'attachment; filename="report.pdf"');
      res.setHeader("Content-Type", "application/pdf");

      doc.pipe(res);
      doc.fontSize(16).text("Income Report", { align: "center" });
      doc.moveDown();

      data.forEach((item) => {
        doc
          .fontSize(12)
          .text(`ID: ${item._id}, Amount: ${item.amount}, Date: ${item.date}`);
      });

      doc.end();
    } else if (format === "csv") {
      // Create CSV
      const csvWriter = createObjectCsvWriter({
        header: [
          { id: "_id", title: "ID" },
          { id: "amount", title: "Amount" },
          { id: "date", title: "Date" },
        ],
      });

      const stream = csvWriter.writeRecords(data);
      res.setHeader("Content-Disposition", 'attachment; filename="report.csv"');
      res.setHeader("Content-Type", "text/csv");

      stream.pipe(res);
    } else {
      res.status(400).send("Unsupported format");
    }
  } catch (error) {
    res.status(500).send("Error generating report");
    console.error(error);
  }
});
