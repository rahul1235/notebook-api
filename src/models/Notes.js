const mongoose = require("mongoose");

const { Schema } = mongoose;

const modelName = "Notes";
const NotesSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: { type: String, required: true },
    description: { type: String, required: true },
    tag: { type: String, default: "General" },
    date: { type: String, default: Date.now() },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(modelName, NotesSchema);
