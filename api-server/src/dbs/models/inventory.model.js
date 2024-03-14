const { Schema, model } = require("mongoose");
const { ObjectId } = Schema.Types;

const DOCUMENT_NAME = "Inventory";
const COLLECTION_NAME = "Inventories";

const inventorySchema = new Schema(
  {
    iven_productId: {
      type: ObjectId,
      ref: "Product",
      required: true,
    },
    iven_location: {
      type: String,
      required: true,
      default: "unknown",
    },
    iven_stock: {
      type: Number,
      required: true,
      default: 0,
    },
    iven_sold: {
      type: Number,
      required: true,
      default: 0,
    },
    inven_shop: {
      type: ObjectId,
      ref: "Shop",
      required: true,
    },
    iven_status: {
      type: String,
      required: true,
      enum: ["active", "inactive", "deleted"],
      default: "active",
    },
    inven_reservations: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true, collection: COLLECTION_NAME }
);

module.exports = model(DOCUMENT_NAME, inventorySchema);
