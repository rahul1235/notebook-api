const mongoose = require("mongoose");

const mongooseURI = process.env.DB_CONNECTION_STRING;

const connectToMongo = async () => {
  await mongoose.connect(mongooseURI);
  // eslint-disable-next-line no-console
  console.log("connected to mongoose successfully!");
};

module.exports = {
  connectToMongo,
};
