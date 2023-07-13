const express = require("express");
const router = express.Router();
const checkAuth = require("../../middleware/check-auth");
const {
  orders_get_all,
  create_Order,
  get_OrderById,
  update_OrderById,
  delete_OrderById,
} = require("../../controllers/order");
router.get("/", checkAuth, orders_get_all);

router.post("/", checkAuth, create_Order);

router.get("/:orderID", checkAuth, get_OrderById);

router.patch("/:orderID", checkAuth, update_OrderById);

router.delete("/:orderID", checkAuth, delete_OrderById);

module.exports = router;
