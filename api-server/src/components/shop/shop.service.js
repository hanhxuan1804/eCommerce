const { Shops } = require("../../dbs/models");
const {
  ConflictResponseError,
  InternalServerError,
  NotFoundResponeError,
  BadRequestResponeError,
} = require("../../core/error.response");
const { Types } = require("mongoose");

class ShopService {
  static createShop = async ({ user, data }) => {
    const { name, address, phone, email, description } = data;
    const existingShop = await Shops.findOne({
      email: email ? email : user.email,
    }).lean();
    if (existingShop) {
      throw new ConflictResponseError("Shop already exists");
    }
    const shop = await Shops.create({
      name,
      address,
      phone,
      email: email ? email : user.email,
      description,
      user: user._id,
    });
    if (!shop) {
      throw new InternalServerError("Create shop failed !");
    }
    return shop;
  };
  static getShop = async ({ user }) => {
    const shop = await Shops.findOne({ email: user.email }).lean();
    if (!shop) {
      throw new NotFoundResponeError("Shop not found !");
    }
    return shop;
  };
  static getShopById = async ({ user, data }) => {
    if (!Types.ObjectId.isValid(data)) {
      throw new NotFoundResponeError("Shop not found !");
    }
    const shop = await Shops.findById(new Types.ObjectId(data)).lean();
    if (!shop) {
      throw new NotFoundResponeError("Shop not found !");
    }
    return shop;
  };
  static updateShopById = async ({ user, data, body }) => {
    if (!Types.ObjectId.isValid(data)) {
      throw new BadRequestResponeError("Shop not found !");
    }
    const shop = await Shops.findByIdAndUpdate(new Types.ObjectId(data), body, {
      new: true,
    }).lean();
    if (!shop) {
      throw new NotFoundResponeError("Shop not found !");
    }
    return shop;
  };
}

module.exports = ShopService;
