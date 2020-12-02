const fs = require("fs");
const axios = require("axios");

const currencySymbols = fs.readFileSync(
  `${__dirname}/../dev-data/currency-name-symbol.json`,
  "utf-8"
);

/**
 * Send currency data to client.
 */
exports.getCurrency = async (req, res, next) => {
  // Combine api url and password.
  try {
    const currency = await axios.get(
      `https://api.exchangeratesapi.io/latest?base=USD&symbols=EUR,GBP,ILS,ZAR,KRW`
    );

    const keys = Object.keys(currency.data.rates);
    let values = Object.values(currency.data.rates);

    values = values.map((el) => {
      return el.toFixed(2);
    });

    res.status(200).json({
      status: "success",
      data: {
        keys,
        values,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Unable to fetch data.",
    });
  }
};

exports.getUserQuery = async (req, res, next) => {
  try {
    const currency = await axios.get(
      `https://api.exchangeratesapi.io/latest?base=${req.query.base}&symbols=${req.query.symbols}`
    );

    const currencyObj = currency.data.rates;
    const rates = Object.values(currencyObj);
    let amount = +rates[0] * +req.query.amount;
    amount = amount.toFixed(2);

    res.status(200).json({
      status: "success",
      data: {
        amount,
        from: req.query.base,
        to: req.query.symbols,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getTitles = async (req, res, next) => {
  try {
    const titleData = await axios.get("https://api.exchangeratesapi.io/latest");

    // Get currency abberviations
    let keys = Object.keys(titleData.data.rates);
    keys.push("EUR");
    keys = keys.sort();

    // Get currency symbols
    let symbols = JSON.parse(currencySymbols);
    symbols = Object.values(symbols);

    // Push object with currency title and code to codeData Array
    let codeData = [];
    symbols.forEach((el) => {
      keys.forEach((cur) => {
        if (cur === el.code) {
          codeData.push({
            title: `${el.name} ${el.symbol}`,
            code: el.code,
          });
        }
      });
    });

    // Sort alphabetically based on title
    codeData.sort((a, b) => {
      if (a.title < b.title) {
        return -1;
      }
      if (a.title > b.title) {
        return 1;
      }
      return 0;
    });

    res.status(200).json({
      status: "success",
      data: {
        keys: codeData,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Could not get title data.",
    });
  }
};
