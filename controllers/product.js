const Product = require("../model/product");

exports.get_productAll = (req, res, next) => {
  Product.find()
    .select("name price productImage")
    .exec()
    .then((doc) => {
      const response = {
        count: doc.length,
        products: doc.map((doc) => {
          return {
            _id: doc._id,
            name: doc.name,
            price: doc.price,
            productImage: doc.productImage,
            request: {
              type: "GET",
              url: "http://localhost:5000/product/" + doc._id,
            },
          };
        }),
      };

      res.status(200).json(response);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: error });
    });
};

exports.create_Product = (req, res, next) => {
  console.log("hit");

  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path,
  });
  product
    .save()
    .then((doc) => {
      console.log(doc);
      res.status(201).json({
        createProduct: {
          name: doc.name,
          price: doc.price,
          product: doc.productImage,
          _id: doc._id,
          request: {
            type: "GET",
            url: "http://localhost:5000/product/" + doc._id,
          },
        },
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: error });
    });
};

exports.get_ProductById = (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .exec()
    .then((doc) => {
      console.log(doc);
      if (doc) {
        res.status(200).json({ doc });
      }
      res.status(404).json({ message: "No valid entry found for provide iD" });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: error });
    });
  // if (id === "special") {
  //   res.status(200).json({
  //     message: "You discovered the special ID",
  //     id: id,
  //   });
  // } else {
  //   res.status(200).json({
  //     message: "You passed an ID",
  //   });
  // }
};

exports.update_ProductById = (req, res, next) => {
  const id = req.params.productId;
  const update = {};
  for (const ops of req.body) {
    update[ops.propName] = ops.value;
  }
  Product.findByIdAndUpdate({ _id: id }, { $set: update })
    .exec()
    .then((doc) => {
      console.log(doc);
      res.status(200).json(doc);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: error });
    });
};

exports.delete_ProductById = (req, res, next) => {
  const id = req.params.productId;
  Product.findByIdAndRemove({ _id: id })
    .exec()
    .then((doc) => {
      console.log(doc);
      res.status(200).json(doc);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: error,
      });
    });

  // res.status(200).json({
  //   message: "Deleted Product",
  // });
};
