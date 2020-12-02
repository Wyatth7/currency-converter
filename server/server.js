const dotenv = require("dotenv");
const path = require("path");

const app = require("./../app");

dotenv.config({ path: path.resolve(__dirname, "./../config.env") });

const port = process.env.PORT || 2020;
app.listen(port, () => console.log(`Listening on port ${port}`));
