const mongoose = require("mongoose");
// const mongooseURI =
//   "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";
const password = "rahul";
const mongooseURI = `mongodb+srv://rahul:${password}@cluster0.t9tfi.mongodb.net/notes?retryWrites=true&w=majority`;

const connectToMongo = async () => {
  await mongoose.connect(mongooseURI);
  // eslint-disable-next-line no-console
  console.log("connected to mongoose successfully!");
};

module.exports = {
  connectToMongo,
};
