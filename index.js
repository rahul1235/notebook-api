const express = require("express");
const { getEverything } = require("./news");
const cors = require('cors')

const app = express();
const port = 4000;

app.use(cors())

app.get("/top-headlines", async (req, res) => {
  const data = await getEverything(req.query);
  console.log(req.query);
  res.send(data);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
