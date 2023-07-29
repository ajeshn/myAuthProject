require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const PORT = 3000;

const routes = require("./routes/api");
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("Hello from server");
});
app.listen(process.env.PORT, () => {
  console.log("server started on locahost" + PORT);
});
