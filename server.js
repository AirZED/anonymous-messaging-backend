const dotenv = require("dotenv");

dotenv.config({
  path: "./config.env",
});

const db = require("./db");
const app = require("./app");
const port = process.env.PORT || 3000;

// starting the database
db();

app.listen(port, () => {
  console.log(`Server has started on port ${process.env.PORT}`);
});
