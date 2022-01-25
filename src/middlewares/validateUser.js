const jwt = require("jsonwebtoken");

const { JWT_SECRET } = process.env;

// eslint-disable-next-line consistent-return
const fetchUser = async (req, res, next) => {
  try {
    // get the user from jwt token and add into request
    const { token } = req.headers;
    if (!token) {
      return res.status(401).send({
        status: "ERROR",
        message: "Invalid token",
      });
    }
    const data = jwt.verify(token, JWT_SECRET);
    if (!data) {
      return res.status(401).send({
        status: "ERROR",
        message: "Invalid token",
      });
    }
    req.user = data.user;
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return res.status(400).send({
        status: "ERROR",
        message: "given token is invalid",
      });
    }
    return res.status(500).send({
      status: "ERROR",
      message: "Internel server error",
    });
  }
};

module.exports = {
  fetchUser,
};
