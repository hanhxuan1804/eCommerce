const express = require('express');
const config = require('./configs/config');
const routes = require('./routes');

const app = express();

// Set up middleware
app.use(express.json());

// Load routes
routes(app);

// Start server
app.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`);
});