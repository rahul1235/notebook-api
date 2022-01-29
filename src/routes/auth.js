const express = require("express");
const bcrpt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();
const bcryptjs = require("bcryptjs");
const User = require("../models/User");
const { loginSchema, createUserSchema } = require("../validations");
const { fetchUser } = require("../middlewares/validateUser");
const { formatValidationError } = require("../utils/helper");

const { JWT_SECRET } = process.env;
const STATUS_ERROR = "ERROR";
const STATUS_SUCCESS = "SUCCESS";

router.post("/auth/create-user", async (req, res) => {
  try {
    const bodyData = req.body;
    const check = await createUserSchema(bodyData);
    if (check !== true) {
      const errors = formatValidationError({ check });
      return res.status(400).send({
        message: "Validation Error",
        errors,
      });
    }
    const salt = await bcrpt.genSalt(10);
    bodyData.password = await bcrpt.hash(bodyData.password, salt);
    const userData = await User.create(bodyData);
    const jwtData = {
      user: {
        id: userData.id,
      },
    };
    const authToken = jwt.sign(jwtData, JWT_SECRET);
    return res.send({
      status: STATUS_SUCCESS,
      message: "user created successfully",
      data: {
        authToken,
      },
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return res
      .status(500)
      .send({ status: STATUS_ERROR, message: "Internerl Server Error" });
  }
});

router.post("/auth/login", async (req, res) => {
  try {
    const bodyData = req.body;
    const check = loginSchema(bodyData);
    if (check !== true) {
      const errors = formatValidationError({ check });
      return res.status(400).send({
        message: "Validation Error",
        errors,
      });
    }
    const user = await User.findOne({ email: bodyData.email });
    if (!user) {
      return res
        .status(400)
        .send({ status: STATUS_ERROR, message: "Invalid Credentials" });
    }

    const passwordCompare = await bcryptjs.compare(
      bodyData.password,
      user.password
    );
    if (!passwordCompare) {
      return res
        .status(400)
        .send({ status: STATUS_ERROR, message: "Invalid Credentials" });
    }
    const jwtData = {
      user: {
        id: user.id,
      },
    };
    const authToken = jwt.sign(jwtData, JWT_SECRET);
    return res.send({
      status: STATUS_SUCCESS,
      data: {
        authToken,
      },
    });
  } catch (err) {
    return res
      .status(500)
      .send({ status: STATUS_ERROR, message: "Internerl Server Error" });
  }
});

router.post("/auth/fetch-user", [fetchUser], async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id).select(["-password"]);
    return res.send(user);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return res
      .status(500)
      .send({ status: STATUS_ERROR, message: "Internerl Server Error" });
  }
});
module.exports = router;
