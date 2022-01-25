const mongoose = require("mongoose");

const { Schema } = mongoose;

const modelName = "User";
const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    date: { type: String, default: Date.now() },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(modelName, UserSchema);
