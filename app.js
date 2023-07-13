const express = require("express");
const productRoutes = require("./api/routes/product");
const orderRoutes = require("./api/routes/order");
const userRoutes = require("./api/routes/user");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://anandkushwaha:789aditya729A@cluster0.kd7udhp.mongodb.net/RESTAPI?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Mongodb is connected");
  })
  .catch((error) => {
    console.log(error);
  });
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/uploads", express.static("uploads"));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-with,Content-Type,Accept,Authorization"
  );

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT,POST,PATCH,DELETE,GET");
    return res.status(200).json({});
  }
  next();
});

app.use("/product", productRoutes);
app.use("/order", orderRoutes);
app.use("/user", userRoutes);
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});
module.exports = app;
