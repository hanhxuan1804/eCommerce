const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DOCUMENT_NAME = "Apikey";
const COLLECTION_NAME = "Apikeys";

const apikeySchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: Number,
      default: 1,
    },
    permissions: {
      type: Array,
      required: true,
      emum: ["0000", "0001", "0010", "0011", "0100", "0101", "0110", "0111"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      expires: "30d",
    },
    updatedAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = mongoose.model(DOCUMENT_NAME, apikeySchema);
