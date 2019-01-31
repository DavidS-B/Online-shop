const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Category = mongoose.model("Category", {
  title: String,
  description: String,
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department"
  }
});

/* ==========> CATEGORY <========== */
/* READ */
router.get("/category", async (req, res) => {
  const categoryTab = await Category.find().populate("product");
  res.json(categoryTab);
});

/* CREATE */
router.post("/category/create", async (req, res) => {
  try {
    const dep = await Department.findOne({ title: req.body.department });
    const newCategory = new Category({
      title: req.body.title,
      description: req.body.description,
      department: dep
    });
    await newCategory.save();
    res.json({ message: "New Category Created" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/* UPDATE */
router.post("/category/update", async (req, res) => {
  try {
    if (
      req.query.id &&
      req.body.title &&
      req.body.description &&
      req.body.department
    ) {
      const target = await Category.findOne({ _id: req.query.id });
      target.title = req.body.title;
      target.description = req.body.description;
      target.department = req.body.department;
      await target.save();
      res.json({ message: "Updated" });
    } else {
      res.status(400).json({ message: "Missing parameter" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/* DELETE */
router.post("/category/delete", async (req, res) => {
  try {
    if (req.query.id) {
      const target = await Category.findOne({ _id: req.query.id });
      const subTarget = await Product.findOne({ category: req.query.id });
      await target.remove();
      await subTarget.remove();
      res.json({ message: "Removed" });
    } else {
      res.status(400).json({ message: "Missing id" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
