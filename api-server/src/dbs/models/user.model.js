const mongoose = require("mongoose"); // Erase if already required

const COLLECTION_NAME = "Users";
const DOCUMENT_NAME = "User";
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email_verified: {
      type: mongoose.Schema.Types.Boolean,
      default: false,
    },

    password: {
      type: String,
      required: true,
    },
    roles: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, userSchema);
