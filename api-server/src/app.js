require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const { default: helmet } = require("helmet");
const compression = require("compression");
const passport = require("./helpers/passport");
const routes = require("./routes.js");

const app = express();

// Set up middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev")); // log requests to the console
app.use(helmet()); // secure apps by setting various HTTP headers
app.use(compression()); // compress all responses, gzip compression, reduce size of response body
app.use(passport.initialize());

// Load routes
app.use("/", require("./routes"));

// Set up db
require("./dbs/init.mongodb");
//require('./helpers/check.connect').checkOverload();

// Set up error handling
app.use((err, req, res, next) => {
  res.status(500).send({ error: err.message });
});

module.exports = app;
