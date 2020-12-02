const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const currencyRoutes = require("./server/routes/currencyRoutes");

const app = express();

app.use(bodyParser.json());
bodyParser.urlencoded({ extended: true });
app.use(express.json({ limit: "10kb" }));

app.use(express.static(path.join(__dirname, "build")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.use("/api/request/data", currencyRoutes);

app.all("*", (req, res, next) => {
  res.redirect("/");
});

module.exports = app;
