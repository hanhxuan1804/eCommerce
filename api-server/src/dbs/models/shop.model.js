const mongoose = require("mongoose"); // Erase if already required

const COLLECTION_NAME = "Shops";
const DOCUMENT_NAME = "Shop";
// Declare the Schema of the Mongo model
var shopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxLength: 150,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    verify: {
      type: mongoose.Schema.Types.Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    roles: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collation: COLLECTION_NAME,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, shopSchema);
