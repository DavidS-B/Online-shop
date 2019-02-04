const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.json());

mongoose.connect(
  process.env.MONGODB_URI ||
    "mongodb://heroku_rst5zh91:6oij7kf9mblj7b3k2k8ie09dc4@ds219879.mlab.com:19879/heroku_rst5zh91",
  {
    useNewUrlParser: true
  }
);

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
