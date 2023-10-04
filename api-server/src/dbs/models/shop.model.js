const mongoose = require("mongoose"); // Erase if already required

const COLLECTION_NAME = "Shops";
const DOCUMENT_NAME = "Shop";

const shopSchema = new mongoose.Schema(
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
    phone: {
      type: String,
      trim: true,
      maxLength: 10,
    },
    address: {
      type: String,
      trim: true,
      maxLength: 150,
    },
    description: {
      type: String,
      trim: true,
      maxLength: 150,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, shopSchema);
