const Order = require("../model/order");
const Product = require("../model/product");
exports.orders_get_all = (req, res, next) => {
  Order.find()
    .select("product quantity _id")
    .populate("product", "name")
    .exec()
    .then((doc) => {
      console.log(doc);
      res.status(200).json({
        count: doc.length,
        order: doc.map((doc) => {
          return {
            _id: doc._id,
            product: doc.product,
            quantity: doc.quantity,
          };
        }),
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
};

exports.create_Order = (req, res, next) => {
  // const order = {
  //   productId: req.body.productId,
  //   quantity: req.body.quantity,
  // };
  Product.findById(req.body.productId)
    .then((product) => {
      console.log(product);
      if (!product) {
        return res.status(400).json({
          message: "Product not found",
        });
      }
      const order = new Order({
        quantity: req.body.quantity,
        product: req.body.productId,
      });
      return order.save();
    })
    .then((doc) => {
      console.log(doc);
      res.status(201).json(doc);
    })
    .catch((error) => {
      res.status(500).json({
        message: "Product Id Not found",
        error: error,
      });
    });
};

exports.get_OrderById = (req, res, next) => {
  const id = req.params.orderID;
  Order.findById(id)
    .exec()
    .then((doc) => {
      if (doc) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({
          message: "No valid entry found",
        });
      }
    });
};

exports.update_OrderById = (req, res, next) => {
  const id = req.params.orderID;
  const update = {};
  for (const ops of req.body) {
    update[ops.propName] = ops.value;
  }
  Order.findByIdAndUpdate({ _id: id }, { $set: update })
    .exec()
    .then((doc) => {
      res.status(200).json(doc);
    })
    .catch((error) => [res.status(500).json({ error: error })]);
};

exports.delete_OrderById = (req, res, next) => {
  const id = req.params.orderID;
  Order.findByIdAndRemove({ _id: id })
    .exec()
    .then((doc) => {
      res.status(200).json(doc);
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
  // res.status(200).json({
  //   message: "Order is deleted",
  // });
};
