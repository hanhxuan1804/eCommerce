const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "Cart";
const COLLECTION_NAME = "Carts";

const cartSchema = new Schema(
  {
    cart_state: {
      type: String,
      enum: ["active", "completed", "cancelled", "returned", "refunded"],
      default: "active",
    },
    cart_products: [
      {
        product_id: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        shop_id: {
          type: Schema.Types.ObjectId,
          ref: "Shop",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
        },
        name: {
          type: String,
        },
      },
    ],
    cart_count_products: {
      type: Number,
      default: 0,
    },
    cart_owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { collection: COLLECTION_NAME, timestamps: true }
);


module.exports = model(DOCUMENT_NAME, cartSchema);
