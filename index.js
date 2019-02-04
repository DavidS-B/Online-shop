const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.json());

mongoose.connect(mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/Online-shop", { useNewUrlParser: true });

/* ==========> express.Router() <========== */
const departmentRoutes = require("./routes/department");
app.use(departmentRoutes);

const categoryRoutes = require("./routes/category");
app.use(categoryRoutes);

const productRoutes = require("./routes/product");
app.use(productRoutes);

const reviewRoutes = require("./routes/review");
app.use(reviewRoutes);

/* ==========> SERVER RUNNING <========== */
app.listen(process.env.PORT || 3001, () => {
  console.log("Server started");
});
