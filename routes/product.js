const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Product = mongoose.model("Product", {
  title: String,
  description: String,
  price: Number,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review"
    }
  ],
  averageRating: { type: Number, min: 0, max: 5 }
});

/* ==========> PRODUCT <========== */
/* READ */
router.get("/product", async (req, res) => {
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
router.post("/product/create", async (req, res) => {
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
router.post("/product/update", async (req, res) => {
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
router.post("/product/delete", async (req, res) => {
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

module.exports = router;
