const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.json());

mongoose.connect(
  "mongodb://localhost/Online-shop",
  { useNewUrlParser: true }
);

/* MODELS */
const Department = mongoose.model("Department", {
  title: String
});

const Category = mongoose.model("Category", {
  title: String,
  description: String,
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department"
  }
});

const Product = mongoose.model("Product", {
  title: String,
  description: String,
  price: Number,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  }
});

/* ==========> DEPARTMENT <========== */
/* READ */
app.get("/department", async (req, res) => {
  const departmentTab = await Department.find().populate({
    path: "category",
    populate: {
      path: "product"
    }
  });
  res.json(departmentTab);
});

/* CREATE */
app.post("/department/create", async (req, res) => {
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
app.post("/department/update", async (req, res) => {
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
app.post("/department/delete", async (req, res) => {
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

/* ==========> CATEGORY <========== */
/* READ */
app.get("/category", async (req, res) => {
  const categoryTab = await Category.find().populate("product");
  res.json(categoryTab);
});

/* CREATE */
app.post("/category/create", async (req, res) => {
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
app.post("/category/update", async (req, res) => {
  try {
    if (req.query.id && req.body.title) {
      const target = await Category.findOne({ _id: req.query.id });
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
app.post("/category/delete", async (req, res) => {
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

/* ==========> PRODUCT <========== */
/* READ */
app.get("/product", async (req, res) => {
  const productTab = await Product.find();
  res.json(productTab);
});

/* CREATE */
app.post("/product/create", async (req, res) => {
  const cat = await Category.findOne({ title: req.body.category });
  try {
    const newProduct = new Product({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      category: cat
    });
    await newProduct.save();
    res.json({ message: "New Product Created" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/* UPDATE */
app.post("/product/update", async (req, res) => {
  try {
    if (req.query.id && req.body.title) {
      const target = await Product.findOne({ _id: req.query.id });
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
app.post("/product/delete", async (req, res) => {
  try {
    if (req.query.id) {
      const target = await Product.findOne({ _id: req.query.id });
      await target.remove();
      res.json({ message: "Removed" });
    } else {
      res.status(400).json({ message: "Missing id" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/* ==========> SERVER RUNNING <========== */
app.listen(3001, () => {
  console.log("Server started");
});
