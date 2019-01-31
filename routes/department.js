const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Department = mongoose.model("Department", {
  title: String
});

/* ==========> DEPARTMENT <========== */
/* READ */
router.get("/department", async (req, res) => {
  const departmentTab = await Department.find().populate({
    path: "category",
    populate: {
      path: "product"
    }
  });
  res.json(departmentTab);
});

/* CREATE */
router.post("/department/create", async (req, res) => {
  try {
    const newDepartment = new Department({
      title: req.body.title
    });
    await newDepartment.save();
    res.json({ message: "New Department Created" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/* UPDATE */
router.post("/department/update", async (req, res) => {
  try {
    if (req.query.id && req.body.title) {
      const target = await Department.findOne({ _id: req.query.id });
      target.title = req.body.title;
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
router.post("/department/delete", async (req, res) => {
  try {
    if (req.query.id) {
      const target = await Department.findOne({ _id: req.query.id });
      const subTarget = await Category.findOne({ department: req.query.id });
      const subSubTarget = await Product.findOne({ category: subTarget._id });
      await target.remove();
      await subTarget.remove();
      await subSubTarget.remove();
      res.json({ message: "Removed" });
    } else {
      res.status(400).json({ message: "Missing id" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
