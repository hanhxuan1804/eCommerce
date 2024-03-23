require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const { default: helmet } = require("helmet");
const compression = require("compression");
const routes = require("./routes.js");

const app = express();

// Set up middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev")); // log requests to the console
app.use(helmet()); // secure apps by setting various HTTP headers
app.use(compression()); // compress all responses, gzip compression, reduce size of response body

// Load routes
app.use(
  require("./routes")
  /* #swagger.security = [{
            "apiKeyAuth": []
    }] */
);

// Set up db
require("./dbs/init.mongodb").connect();
//require('./helpers/check.connect').checkOverload();

// Set up error handling
app.use((req, res, next) => {
  const error = new Error("Resource not found");
  error.status = 404;
  next(error);
});
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    status: "error",
    code: statusCode,
    stack: process.env.NODE_ENV === "production" ? "" : err.stack,
    message: err.message || "Internal server error",
  });
});

module.exports = app;
