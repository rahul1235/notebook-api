require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectToMongo } = require("./db");
const authRoutes = require("./routes/auth");
const notesRoutes = require("./routes/notes");

connectToMongo();
const app = express();
app.use(cors());

app.use(express.json());
app.get("/", (req, res) =>
  res.send({
    message: "home",
  })
);
app.use("/api", authRoutes);
app.use("/api", notesRoutes);
// app.get("/api/notes", require('./routes/notes'));

module.exports = app;
