const { Schema, model } = require("mongoose");
const { schema } = require("./shop.model");

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

const productSchema = new Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    productPrice: {
      type: Number,
      required: true,
      trim: true,
    },
    productThumbnail: {
      type: String,
      required: true,
      trim: true,
    },
    productDescription: {
      type: String,
      trim: true,
    },
    productQuantity: {
      type: Number,
      required: true,
      trim: true,
    },
    productCategory: {
      type: String,
      required: true,
      enum: ["Electronics", "Clothes", "Furniture", "Others"],
    },
    productShop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    productRating: {
      type: Number,
      default: 0,
    },
    productAttributes: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true, collection: COLLECTION_NAME }
);

const electronicsSchema = new Schema(
  {
    manufacturer: {
      type: String,
      required: true,
      trim: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
    },
    color: {
      type: String,
      required: true,
      trim: true,
    },
    size: {
      type: String,
      trim: true,
    },
    weight: {
      type: String,
      required: true,
      trim: true,
    },
    material: {
      type: String,
      required: true,
      trim: true,
    },
    powerSource: {
      type: String,
      trim: true,
    },
    battery: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true, collection: "Electronics" }
);

const clothesSchema = new Schema(
  {
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    size: {
      type: String,
      required: true,
      trim: true,
    },
    color: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true, collection: "Clothes" }
);

const furnitureSchema = new Schema(
  {
    material: {
      type: String,
      required: true,
      trim: true,
    },
    color: {
      type: String,
      trim: true,
    },
    size: {
      type: String,
      trim: true,
    },
    weight: {
      type: String,
      trim: true,
    },
    powerSource: {
      type: String,
      trim: true,
    },
    battery: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true, collection: "Furniture" }
);

const othersSchema = new Schema(
  {
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true, collection: "OtherProducts" }
);

const Product = model(DOCUMENT_NAME, productSchema);
const Electronics = model("Electronics", electronicsSchema);
const Clothes = model("Clothes", clothesSchema);
const Furniture = model("Furniture", furnitureSchema);
const OtherProducts = model("OtherProducts", othersSchema);

module.exports = {
  Product,
  Electronics,
  Clothes,
  Furniture,
  OtherProducts,
};
