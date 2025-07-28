const express = require("express");
const app = express();
const path = require("node:path");
require('dotenv').config();
const indexRouter = require("./routes/indexRouter")
//do i need this one?
const { body, validationResult } = require("express-validator");

//static assets path (CSS, etc.)
const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

//lets our app know where to look for views, and then that we intend to use EJS as a template engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//this allows the app to parse form data into req.
app.use(express.urlencoded({ extended: true }));

app.use("/", indexRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`My first Express app - listening on port ${PORT}!`);
});