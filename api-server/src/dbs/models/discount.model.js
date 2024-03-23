const { Schema, model } = require("mongoose");
const { ObjectId } = Schema.Types;
const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "Discounts";

const discountSchema = new Schema(
  {
    discount_shop: {
      type: ObjectId,
      ref: "Shop",
      required: true,
    },
    discount_apply_to: {
      type: String,
      required: true,
      enum: ["all", "specific", "category"],
      default: "all",
    },
    discount_products: {
      type: Array,
      default: [],
    },
    discount_products_category: {
      type: Array,
      default: [],
    },
    discount_name: {
      type: String,
      required: true,
      trim: true,
    },
    discount_code: {
      type: String,
      required: true,
      trim: true,
    },
    discount_start_time: {
      type: Date,
      required: true,
    },
    discount_end_time: {
      type: Date,
      required: true,
    },
    discount_type: {
      type: String,
      required: true,
      enum: ["percentage", "amount"],
      default: "amount",
    },
    discount_value: {
      type: Number,
      required: true,
    },
    discount_max_value: {
      type: Number,
      required: true,
    },
    discount_min_order_value: {
      type: Number,
      required: true,
    },
    discount_max_use: {
      type: Number,
      required: true,
    },
    discount_used_count: {
      type: Number,
      required: true,
      default: 0,
    },
    discount_max_use_per_user: {
      type: Number,
      required: true,
    },
    discount_users_used: {
      type: Array,
      default: [],
    },
    discount_public: {
      type: Boolean,
      required: true,
      default: true,
    },
    discount_use_with_other: {
      type: Boolean,
      required: true,
      default: false,
    },
    discount_status: {
      type: String,
      required: true,
      enum: ["active", "inactive", "deleted"],
      default: "active",
    },
    discount_description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true, collection: COLLECTION_NAME }
);

module.exports = model(DOCUMENT_NAME, discountSchema);
