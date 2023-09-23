const express = require('express');
const config = require('./configs/config');
const routes = require('./routes');
const morgan = require('morgan');
const { default: helmet } = require('helmet');
const compression = require('compression');

const app = express();

// Set up middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());

// Load routes
//routes(app);

// Set up db


// Set up error handling
app.use((err, req, res, next) => {
  res.status(500).send({ error: err.message });
});

module.exports = app;