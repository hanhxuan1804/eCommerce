const mongoose = require('mongoose');
const config = require('../configs/config');

// Define the schema for the data model
const schema = new mongoose.Schema({
  // Define the fields and their types
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

// Define the model for the data
const User = mongoose.model('User', schema);

// Connect to the database using the configuration settings
function connect() {
  return mongoose.connect(config.database.url, config.database.options);
}

// Export the model and the connect function
module.exports = {
  User,
  connect
};