const express = require("express");
const bodyParser = require("body-parser");
const currencyRoutes = require("./server/routes/currencyRoutes");

const app = express();

app.use(bodyParser.json());
bodyParser.urlencoded({ extended: true });
app.use(express.json({ limit: "10kb" }));

app.use("/api/request/data", currencyRoutes);

module.exports = app;
