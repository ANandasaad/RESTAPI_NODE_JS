const express = require("express");
const Product = require("../../model/product");
const mongoose = require("mongoose");
const router = express.Router();
const multer = require("multer");
const checkAuth = require("../../middleware/check-auth");
const {
  get_productAll,
  create_Product,
  get_ProductById,
  update_ProductById,
  delete_ProductById,
} = require("../../controllers/product");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: fileFilter,
});

// Parse JSON request body

router.get("/", checkAuth, get_productAll);

router.post("/", checkAuth, upload.single("ProductImage"), create_Product);

router.get("/:productId", checkAuth, get_ProductById);

router.patch("/:productId", checkAuth, update_ProductById);

router.delete("/:productId", checkAuth, delete_ProductById);

module.exports = router;
