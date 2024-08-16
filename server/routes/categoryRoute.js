const express = require("express");
const {
  createCategory,
  getAllCategory,
  getSingleCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category");
const { isAuthenticatedUser } = require("../middleware/auth");
const router = express.Router();

router.post("/category", isAuthenticatedUser, createCategory);
router.get("/category/all", isAuthenticatedUser, getAllCategory);
router.get("/category/:id", isAuthenticatedUser, getSingleCategory);
router.put("/category/:id", isAuthenticatedUser, updateCategory);
router.delete("/category/:id", isAuthenticatedUser, deleteCategory);

module.exports = router;
