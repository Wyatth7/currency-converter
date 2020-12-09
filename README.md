# About
Curringo is an app built with React.js, and was created to ease the process of converting all size amounts of currency.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

# Backend 
## About
Curringo's backend is quite simple as it only has very few endpoints. 

## Third Pary API's
Curringo only uses one external API, which is used to gather currency data.

## Paths
### `/`
The root path sends the final build html file to the client.
````
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
````
All paths other than `/` are redirected to `/`.

````
app.all("*", (req, res, next) => {
  res.redirect("/");
});
````

### `/api/equest/data`
Base path for recieveing currency data.

#### `/`
Gets data from server with a base currency of USD which is compared to the EUR, GBP, ILS, ZAR, KRW.
This data is currently being used for the functionality of the infinite pulsing effect on the left portion of the application.

````
// In currency router:
router.get("/", currencyController.getCurrency);
````
````
// In currency controller:
// Method that gets data third pary API and sends processed data to client.
exports.getCurrency = async (req, res, next) => {
  
  try {
  // Fetch data from API
    const currency = await axios.get(
      `https://api.exchangeratesapi.io/latest?base=USD&symbols=EUR,GBP,ILS,ZAR,KRW`
    );

  // Create Arrays out of keys and values.
  // Keys = currency names
  // Values = currency prices
    const keys = Object.keys(currency.data.rates);
    let values = Object.values(currency.data.rates);

  // Sets values to 2 decimal places.
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
````

#### `/query`
Gets data specific to the specifications sent by the user.
Example: 
  If the user inputs United States Dollar (USD) as a base, then selects the Great British Pound (GBP) as the currency be compared, then `/query` will send the client the dollar amount to the nearest tenth.

````
// In currency router: 
router.get("/query", currencyController.getUserQuery);
````

`getUserQuery` requires three string parameters: `amount`, `base`, and `symbols`. `base` is the currency that will be converted, `symbols` is the currency to convert to. Limited to a maximum of one `base` and `symbols` per request.

Upon success, the server will send the client the final calculated amount, `base`, and `symbols`.

````
// In currency controller: 
// Method that sends specific data passed by the user.
exports.getUserQuery = async (req, res, next) => {
  try {
  // Gets data based on 'base' and 'symbols'.
    const currency = await axios.get(
      `https://api.exchangeratesapi.io/latest?base=${req.query.base}&symbols=${req.query.symbols}`
    );

  // Gets the rate, then multiplies it by 'amount', and finally fixes the value to a max of two decimal places.
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
````

#### `/title` 
Upon request, sends client an array of all names.

````
// In currency routes:
router.get("/title", currencyController.getTitles);
````

Common nation/currency titles are not included within the third party API, so the app uses a json file called `currency-name-symbol.json`. This JSON file is used when sending title data to the client.
````
const currencySymbols = fs.readFileSync(
  `${__dirname}/../dev-data/currency-name-symbol.json`,
  "utf-8"
);
````

````
// In currency controller:
exports.getTitles = async (req, res, next) => {
  try {
  // Get all data
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
````
