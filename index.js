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

const Review = mongoose.model("Review", {
  score: Number,
  comment: String,
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }
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
  if (
    req.query.priceMin &&
    req.query.priceMax === undefined &&
    req.query.category === undefined
  ) {
    console.log(1);
    const productTab = await Product.find({
      price: { $gte: req.query.priceMin }
    });
    res.json(productTab);
  } else if (
    req.query.priceMax &&
    req.query.priceMin === undefined &&
    req.query.category === undefined
  ) {
    console.log(2);
    const productTab = await Product.find({
      price: { $lte: req.query.priceMax }
    });
    res.json(productTab);
  } else if (
    req.query.priceMin &&
    req.query.priceMax &&
    req.query.category === undefined
  ) {
    console.log(3);
    const productTab = await Product.find({
      price: { $gte: req.query.priceMin, $lte: req.query.priceMax }
    });
    res.json(productTab);
  } else if (
    req.query.category &&
    req.query.priceMin === undefined &&
    req.query.priceMax === undefined
  ) {
    console.log(4);
    const productTab = await Product.find({ category: req.query.category });
    res.json(productTab);
  } else if (
    req.query.priceMin &&
    req.query.category &&
    req.query.priceMax === undefined
  ) {
    console.log(5);
    const productTab = await Product.find({
      category: req.query.category,
      price: { $gte: req.query.priceMin }
    });
    res.json(productTab);
  } else if (
    req.query.priceMax &&
    req.query.category &&
    req.query.priceMin === undefined
  ) {
    console.log(6);
    const productTab = await Product.find({
      category: req.query.category,
      price: { $lte: req.query.priceMax }
    });
    res.json(productTab);
  } else if (req.query.category && req.query.priceMin && req.query.priceMax) {
    console.log(7);
    const productTab = await Product.find({
      category: req.query.category,
      price: { $gte: req.query.priceMin, $lte: req.query.priceMax }
    });
    res.json(productTab);
  } else if (req.query.sort === "price-asc" && req.query.title === false) {
    console.log(8);
    const sort = await Product.find({}).sort({ price: 1 });
    res.json(sort);
  } else if (req.query.sort === "price-dsc" && req.query.title === false) {
    console.log(9);
    const sort = await Product.find({}).sort({ price: -1 });
    res.json(sort);
  } else if (req.query.sort === "price-asc" && req.query.title) {
    console.log(10);
    antiCasse = req.query.title.toUpperCase();
    const sort = await Product.find({ title: antiCasse }).sort({
      price: 1
    });
    res.json(sort);
  } else if (req.query.sort === "price-dsc" && req.query.title) {
    console.log(11);
    antiCasse = req.query.title.toUpperCase();
    const sort = await Product.find({ title: antiCasse }).sort({
      price: -1
    });
    res.json(sort);
  } else {
    console.log(12);
    const productTab = await Product.find();
    res.json(productTab);
  }
});

/* CREATE */
app.post("/product/create", async (req, res) => {
  const cat = await Category.findOne({ title: req.body.category });
  try {
    const newProduct = new Product({
      title: req.body.title.toUpperCase(),
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
    if (
      req.query.id &&
      req.body.title &&
      req.body.description &&
      req.body.price &&
      req.body.category
    ) {
      const target = await Product.findOne({ _id: req.query.id });
      target.title = req.body.title;
      target.description = req.body.description;
      target.price = req.body.price;
      target.category = req.body.category;
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
      const subTarget = await Review.findOne({ product: req.query.id });
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

/* ==========> REVIEW <========== */
/* READ */
app.get("/review", async (req, res) => {
  const reviewTab = await Review.find().populate({
    path: "product"
  });
  res.json(reviewTab);
});

/* CREATE */
app.post("/review/create", async (req, res) => {
  if (req.query.title && req.body.score && req.body.comment) {
    try {
      const prod = await Product.findOne({ title: req.query.title });
      const newReview = new Review({
        score: req.body.score,
        comment: req.body.comment,
        product: prod
      });
      await newReview.save();
      res.json({ message: "New Review Created" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else {
    res.status(400).json({ message: "Missing parameter" });
  }
});

/* UPDATE */
app.post("/product/update", async (req, res) => {
  try {
    if (
      req.query.id &&
      req.body.score &&
      req.body.comment &&
      req.body.product
    ) {
      const target = await Review.findOne({ _id: req.query.id });
      target.score = req.body.score;
      target.comment = req.body.comment;
      target.product = req.body.product;
      await target.save();
      res.json({ message: "Review Updated" });
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
      const target = await Review.findOne({ _id: req.query.id });
      await target.remove();
      res.json({ message: "Review Removed" });
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
