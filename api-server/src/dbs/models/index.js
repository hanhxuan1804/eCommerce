const Shops = require("./shop.model");
const Users = require("./user.model");
const Apikeys = require("./apikey.model");
const Keys = require("./keytoken.model");
const Inventories = require("./inventory.model");
const Carts = require("./cart.model");

const {
  Product,
  Electronics,
  Clothes,
  Furniture,
  OtherProducts,
} = require("./product.model");

module.exports = {
  Shops,
  Users,
  Apikeys,
  Keys,
  Product,
  Electronics,
  Clothes,
  Furniture,
  OtherProducts,
  Inventories,
  Carts,
};