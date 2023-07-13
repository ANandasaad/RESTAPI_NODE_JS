const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
exports.create_User = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "User is exist already",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            res.status(500).json({
              error: err,
            });
          } else {
            const user = new User({
              email: req.body.email,
              password: hash,
            });

            user
              .save()
              .then((doc) => {
                console.log(doc);
                res.status(201).json({
                  message: "User created",
                  createUser: {
                    email: doc.email,
                    password: doc.password,
                    id: doc._id,
                  },
                });
              })
              .catch((error) => {
                console.log(error);
                res.status(500).json({
                  error: error,
                });
              });
          }
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: error });
    });
};

exports.login_User = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          messsge: "Auth failed",
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            messsge: "Auth failed",
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id,
            },
            "secret",
            { expiresIn: "1h" }
          );
          return res.status(200).json({
            message: "Auth successful",
            token: token,
          });
        }
        res.status(401).json({
          messsge: "Auth failed",
        });
      });
    })
    .catch((error) => {
      return res.status(500).json({
        error: error,
      });
    });
};

exports.delete_User = (req, res, next) => {
  User.find({ _id: req.params.userId })
    .then((doc) => {
      console.log(doc);
      if (doc.length <= 0) {
        res.status(500).json({
          message: "User is not found",
        });
      } else {
        User.findByIdAndRemove({ _id: req.params.userId })
          .exec()
          .then((doc) => {
            res.status(200).json({
              message: "User deleted",
            });
          })
          .catch((error) => {
            res.status(500).json({
              error: error,
            });
          });
      }
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
};
