const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Category = require("../models/categoryModel");

exports.createCategory = catchAsyncErrors(async (req, res) => {
  const { name, type } = req.body;
  const user = req.user._id;

  try {
    const category = await Category.create({ name, type, user });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

exports.getAllCategory = catchAsyncErrors(async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user._id });
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

exports.getSingleCategory = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findOne({ _id: id, user: req.user._id });
    if (!category) {
      res.status(404).json({ message: "Category not found" });
    } else {
      res.status(200).json(category);
    }
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

exports.updateCategory = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;
  const { name, type } = req.body;

  try {
    const category = await Category.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { name, type },
      { new: true }
    );

    if (!category) {
      res.status(404).json({ message: "Category not found" });
    } else {
      res.status(200).json(category);
    }
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

exports.deleteCategory = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    if (!category) {
      res.status(404).json({ message: "Category not found" });
    } else {
      res.status(204).json({ message: "Category deleted successfully" });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});
