const axios = require("axios");

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

    console.log(currency.data);

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
  console.log(req.query);
  try {
    const currency = await axios.get(
      `https://api.exchangeratesapi.io/latest?base=${req.query.base}&symbols=${req.query.symbols}`
    );

    const currencyObj = currency.data.rates;
    const rates = Object.values(currencyObj);
    let amount = +rates[0] * +req.query.amount;
    amount = amount.toFixed(2);
    console.log(rates);

    console.log(amount);

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

    let keys = Object.keys(titleData.data.rates);
    keys.push("EUR");
    console.log(keys);
    res.status(200).json({
      status: "success",
      data: {
        keys,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Could not get title data.",
    });
  }
};
