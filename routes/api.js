const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const db = process.env.mongo_db;

const User = require("../models/user");
const user = require("../models/user");
mongoose
  .connect(db)
  .then(() => console.log("connected to db"))
  .catch((err) => console.log("db connect error" + err));

function verifyToken(req, res, next) {
  if (!req.headers.autherization) {
    return res.status(401).send("no token present");
  }
  let token = req.headers.autherization.split(" ")[1];

  if (token === "null") {
    return res.status(401).send("null token");
  }

  let payload = jwt.verify(token, "secretKey");
  if (!payload) {
    return res.status(401).send("verification failed");
  }

  req.userId = payload.subject;
  next();
}

router.get("/", (req, res) => {
  res.send("from api");
});

router.post("/register", (req, res) => {
  let userData = req.body;
  let user = new User(userData);

  user
    .save()
    .then((registeredUser) => {
      let payload = { subject: registeredUser._id };
      let token = jwt.sign(payload, "secretKey");
      res.status(200).send({ token });
    })
    .catch((err) => console.log(err));
});

router.post("/login", (req, res) => {
  let userdata = req.body;

  User.findOne({ email: userdata.email }).then((user) => {
    if (!user) {
      res.status(401).send("invalid email");
    } else if (user.password !== userdata.password) {
      res.status(401).send("invalid password");
    } else {
      let payload = { subject: user._id };
      let token = jwt.sign(payload, "secretKey");

      res.status(200).send({ token });
    }
  });
});
router.get("/employees", (req, res) => {
  let employees = [
    {
      id: "1",
      name: "John Varghese",
      description: "Manager",
    },
    {
      id: "2",
      name: "Thomas P",
      description: "Accountant",
    },
    {
      id: "3",
      name: "Rani M Nair",
      description: "Auditor",
    },
  ];
  res.json(employees);
});

router.get("/managers", verifyToken, (req, res) => {
  let managers = [
    {
      id: "1",
      name: "John Varghese",
      description: "Manager",
    },
    {
      id: "2",
      name: "Thomas P",
      description: "Manager",
    },
    {
      id: "3",
      name: "Rani M Nair",
      description: "Manager",
    },
  ];
  res.json(managers);
});

module.exports = router;
