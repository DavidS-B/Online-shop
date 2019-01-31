const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Review = mongoose.model("Review", {
  score: Number,
  comment: String,
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }
});

/* ==========> REVIEW <========== */
/* READ */
router.get("/review", async (req, res) => {
  const reviewTab = await Review.find().populate({
    path: "product"
  });
  res.json(reviewTab);
});

/* CREATE */
router.post("/review/create", async (req, res) => {
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
router.post("/product/update", async (req, res) => {
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
router.post("/product/delete", async (req, res) => {
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

module.exports = router;
