const express = require("express");
const currencyController = require("./../controllers/currencyController");

const router = express.Router();

router.get("/", currencyController.getCurrency);
router.get("/query", currencyController.getUserQuery);
router.get("/title", currencyController.getTitles);

module.exports = router;
