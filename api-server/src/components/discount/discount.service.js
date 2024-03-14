const {
  checkShopExist,
  checkShopOwner,
} = require("@models/repositories/shop.repo");
const {
  findAllDiscountCodeUnselect,
} = require("@models/repositories/discount.repo");
const { findAllProducts } = require("@models/repositories/product.repo");
const {
  NotFoundResponseError,
  BadRequestResponseError,
} = require("../../core/error.response");
const { convertStringToMongoId } = require("../../utils/index");
const Discount = require("@models/discount.model");
const {
  checkDiscountExist,
} = require("../../dbs/models/repositories/discount.repo");
/**
 * Discount Service
 * @class DiscountService
 * @description
 *  This is the discount service class which is used to manage the discount data.
 * @version 1.0.0
 * 1-Generator Discount Code[Shop Owner]
 * 2-Get Discount Amount[User]
 * 3-Get All Discount Code[Shop Owner | User]
 * 4-Apply Discount Code[User]
 * 5-Delete Discount Code[Shop Owner]
 * 6-Cancel Discount Code[User]
 * 7-Get Products Discount[User]
 */

class DiscountService {
  static async createDiscount({ userId, payload }) {
    const {
      discount_shop,
      discount_apply_to,
      discount_products,
      discount_products_category,
      discount_name,
      discount_code,
      discount_start_time,
      discount_end_time,
      discount_type,
      discount_value,
      discount_max_value,
      discount_min_order_value,
      discount_max_use,
      discount_used_count,
    } = payload;
    //1-check if the shop is exist
    if (!(await checkShopExist({ shopId: discount_shop }))) {
      throw new NotFoundResponseError("Shop not found");
    }
    //2-check if the user is the shop owner
    if (!(await checkShopOwner({ userId, shopId: discount_shop }))) {
      throw new BadRequestResponseError("You are not the shop owner");
    }
    //3-check if the discount code is exist
    const discount = await Discount.findOne({
      discount_code,
      discount_shop,
      discount_end_time: { $gte: new Date() },
    }).lean();
    if (discount) {
      throw new BadRequestResponseError("Discount code already exist");
    }
    //4- check date
    if (discount_start_time > discount_end_time) {
      throw new BadRequestResponseError(
        "Start time must be less than end time"
      );
    }
    if (discount_end_time < new Date()) {
      throw new BadRequestResponseError(
        "End time must be greater than current time"
      );
    }

    //create new discount
    const newDiscount = new Discount({
      discount_shop,
      discount_apply_to,
      discount_products,
      discount_products_category,
      discount_name,
      discount_code,
      discount_start_time,
      discount_end_time,
      discount_type,
      discount_value,
      discount_max_value,
      discount_min_order_value,
      discount_max_use,
      discount_used_count,
    });
    await newDiscount.save();
    return newDiscount;
  }
  static async upDateDiscount({ userId, discountId, payload }) {
    //TODO: update discount
    const {
      discount_shop,
      discount_apply_to,
      discount_products,
      discount_products_category,
      discount_name,
      discount_code,
      discount_start_time,
      discount_end_time,
      discount_type,
      discount_value,
      discount_max_value,
      discount_min_order_value,
      discount_max_use,
      discount_used_count,
    } = payload;
    //1-check if the discount code is exist
    const foundDiscount = await checkDiscountExist({
      filter: {
        _id: convertStringToMongoId(discountId),
      },
    });
    if (!foundDiscount) {
      throw new NotFoundResponseError("Discount code not found");
    }
    //2-check if the user is the shop owner
    if (
      !(await checkShopOwner({ userId, shopId: foundDiscount.discount_shop }))
    ) {
      throw new BadRequestResponseError("You are not the shop owner");
    }
    //3- check date
    if (discount_start_time > discount_end_time) {
      throw new BadRequestResponseError(
        "Start time must be less than end time"
      );
    }
    if (discount_end_time < new Date()) {
      throw new BadRequestResponseError(
        "End time must be greater than current time"
      );
    }
    //update discount
    foundDiscount.discount_shop = discount_shop;
    foundDiscount.discount_apply_to = discount_apply_to;
    foundDiscount.discount_products = discount_products;
    foundDiscount.discount_products_category = discount_products_category;
    foundDiscount.discount_name = discount_name;
    foundDiscount.discount_code = discount_code;
    foundDiscount.discount_start_time = discount_start_time;
    foundDiscount.discount_end_time = discount_end_time;
    foundDiscount.discount_type = discount_type;
    foundDiscount.discount_value = discount_value;
    foundDiscount.discount_max_value = discount_max_value;
    foundDiscount.discount_min_order_value = discount_min_order_value;
    foundDiscount.discount_max_use = discount_max_use;
    foundDiscount.discount_used_count = discount_used_count;
    await foundDiscount.save();
    return foundDiscount;
  }
  static async deleteDiscount({ userId, discountId }) {
    //check if the discount code is exist
    const foundDiscount = await checkDiscountExist({
      filter: {
        _id: convertStringToMongoId(discountId),
      },
    });
    if (!foundDiscount) {
      throw new NotFoundResponseError("Discount code not found");
    }
    //check if the user is the shop owner
    if (
      !(await checkShopOwner({ userId, shopId: foundDiscount.discount_shop }))
    ) {
      throw new BadRequestResponseError("You are not the shop owner");
    }
    //delete discount
    foundDiscount.discount_status = "deleted";
    await foundDiscount.save();
    return foundDiscount;
  }
  //  Get Products Of A Discount[User]
  static async getProductsDiscount({
    shopId,
    discount_code,
    userId,
    limit,
    page,
  }) {
    //1-check if the shop is exist and the user is the shop owner
    if (!(await checkShopExist({ shopId }))) {
      throw new BadRequestResponseError("Shop not found");
    }
    //2-check if the discount code is exist
    const discount = await Discount.findOne({
      discount_code,
      discount_shop: convertStringToMongoId(shopId),
      discount_end_time: { $gte: new Date() },
    }).lean();
    if (
      !discount ||
      discount.discount_max_use === discount.discount_used_count ||
      discount.discount_start_time > new Date() ||
      discount.discount_end_time < new Date() ||
      discount.discount_status !== "active"
    ) {
      throw new BadRequestResponseError("Discount code not found");
    }
    switch (discount.discount_apply_to) {
      case "all":
        return await findAllProducts({
          limit,
          page,
          filter: {
            product_shop: convertStringToMongoId(shopId),
            isPublished: true,
          },
          select: ["product_name", "product_price"],
          sort: "ctime",
        });
      case "specific":
        return await findAllProducts({
          limit,
          page,
          filter: {
            _id: { $in: discount.discount_products },
            product_shop: convertStringToMongoId(shopId),
            isPublished: true,
          },
          select: ["product_name", "product_price"],
          sort: "ctime",
        });
      case "category":
        return await findAllProducts({
          limit,
          page,
          filter: {
            product_category: { $in: discount.discount_products_category },
            product_shop: convertStringToMongoId(shopId),
            isPublished: true,
          },
          select: ["product_name", "product_price"],
          sort: "ctime",
        });
      default:
        throw new BadRequestResponseError("Discount code not found");
    }
  }
  //Get List Discount Code Of Shop[Shop Owner | User]
  static async getListDiscountCode({ shopId, limit, page, userId }) {
    //1-check if the shop is exist and the user is the shop owner
    if (!(await checkShopExist({ shopId }))) {
      throw new BadRequestResponseError("Shop not found");
    }
    let unSelect;
    if (userId && (await checkShopOwner({ userId, shopId }))) {
      unSelect = ["__v"];
    } else {
      unSelect = [
        "__v",
        "discount_products",
        "discount_products_category",
        "discount_status",
      ];
    }
    const discount = await findAllDiscountCodeUnselect({
      filter: {
        discount_shop: convertStringToMongoId(shopId),
        discount_end_time: { $gte: new Date() },
        discount_status: "active",
      },
      unSelect: [
        "discount_products",
        "discount_products_category",
        "__v",
        "discount_status",
      ],
      sort: "ctime",
      limit,
      page,
    });
    return discount;
  }
  //Get All Discount Amount[User] || Apply Discount Code[User]
  /*
    products: [
      {
        product_id: "id",
        product_price: 100,
        product_quantity: 1,
        product_shop: "id",
      },
    ],
  */
  static async getDiscountAmount({ discountId, products, shopId, userId }) {
    //check if the discount code is exist
    const foundDiscount = await checkDiscountExist({
      filter: {
        _id: convertStringToMongoId(discountId),
        discount_shop: convertStringToMongoId(shopId),
      },
    });
    if (!foundDiscount) {
      throw new NotFoundResponseError("Discount code not found");
    }
    const {
      discount_apply_to,
      discount_products,
      discount_products_category,
      discount_type,
      discount_value,
      discount_max_value,
      discount_min_order_value,
      discount_max_use,
      discount_used_count,
      discount_start_time,
      discount_end_time,
      discount_shop,
      discount_users_used,
      discount_max_use_per_user,
    } = foundDiscount;
    if (discount_max_use === discount_used_count) {
      throw new BadRequestResponseError("Discount code is expired");
    }
    if (discount_start_time > new Date() || discount_end_time < new Date()) {
      throw new BadRequestResponseError("Discount code is not available now");
    }
    let availableProducts;
    switch (discount_apply_to) {
      case "all":
        availableProducts = products.filter(
          (product) => product.product_shop === discount_shop
        );
        break;
      case "specific":
        availableProducts = products.filter((product) =>
          discount_products.includes(product.product_id)
        );
        break;
      case "category":
        availableProducts = products.filter((product) =>
          discount_products_category.includes(product.product_category)
        );
        break;
      default:
        throw new BadRequestResponseError("Discount code not found");
    }
    if (availableProducts.length === 0) {
      throw new BadRequestResponseError(
        "This discount code is not available for your products"
      );
    }
    let totalAmount = 0;
    if (discount_min_order_value > 0) {
      totalAmount = availableProducts.reduce(
        (total, product) =>
          total + product.product_price * product.product_quantity,
        0
      );
      if (totalAmount < discount_min_order_value) {
        throw new BadRequestResponseError(
          `The minimum order value is ${discount_min_order_value}`
        );
      }
    }
    if (discount_max_use_per_user > 0) {
      const used = discount_users_used.find((user) => user._id === userId);
      if (used && used.used >= discount_max_use_per_user) {
        throw new BadRequestResponseError(
          `You have used this discount code ${discount_max_use_per_user} times`
        );
      }
    }
    let discountAmount = 0;
    switch (discount_type) {
      case "percentage":
        discountAmount = totalAmount * discount_value * 0.01;
        break;
      case "amount":
        discountAmount = discount_value;
        break;
      default:
        throw new BadRequestResponseError("Discount code not found");
    }
    if (discount_max_value > 0) {
      discountAmount =
        discountAmount > discount_max_value
          ? discount_max_value
          : discountAmount;
    }
    return {
      products: availableProducts,
      totalAmount,
      discountAmount,
      totalPrice: totalAmount - discountAmount,
    };
  }
  //Apply Discount Code[User]
  static async applyDiscountCode({ discountId, userId }) {
    const foundDiscount = await checkDiscountExist({
      filter: {
        _id: convertStringToMongoId(discountId),
      },
    });
    if (!foundDiscount) {
      throw new NotFoundResponseError("Discount code not found");
    }
    if (foundDiscount.discount_max_use === foundDiscount.discount_used_count) {
      throw new BadRequestResponseError("Discount code is expired");
    }
    if (
      foundDiscount.discount_start_time > new Date() ||
      foundDiscount.discount_end_time < new Date()
    ) {
      throw new BadRequestResponseError("Discount code is not available now");
    }
    if (foundDiscount.discount_max_use_per_user > 0) {
      const used = foundDiscount.discount_users_used.find(
        (user) => user._id === userId
      );
      if (used && used.used >= foundDiscount.discount_max_use_per_user) {
        throw new BadRequestResponseError(
          `You have used this discount code ${foundDiscount.discount_max_use_per_user} times`
        );
      }
    }
    foundDiscount.discount_used_count += 1;
    const used = foundDiscount.discount_users_used.find(
      (user) => user._id === userId
    );
    if (used) {
      used.used += 1;
    } else {
      foundDiscount.discount_users_used.push({
        _id: userId,
        used: 1,
      });
    }
    await foundDiscount.save();
    return foundDiscount;
  }
  //Cancel Discount Code[User]
  static async cancelDiscountCode({ discountId, userId }) {
    const foundDiscount = await checkDiscountExist({
      filter: {
        _id: convertStringToMongoId(discountId),
      },
    });
    if (!foundDiscount) {
      throw new NotFoundResponseError("Discount code not found");
    }
    const result = Discount.findByIdAndUpdate(
      convertStringToMongoId(discountId),
      {
        $pull: {
          discount_users_used: {
            _id: userId,
          },
        },
        $inc: {
          discount_used_count: -1,
        },
      }
    );
    return result;
  }
}
