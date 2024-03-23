const DiscountService = require("./discount.service");
/**
 * DiscountController
 * @class
 * @classdesc Class used to manage discount
 * @description This class will manage discount
 * @version 1.0.0
 */
class DiscountController {
  createDiscount = async (req, res, next) => {
    console.log(`[P]::createDiscount::`, req.body);
    new CreatedResponse(
      "Discount created successfully",
      await DiscountService.createDiscount({
        userId: req.user._id,
        payload: req.body,
      })
    ).send(res);
  };
  updateDiscount = async (req, res, next) => {
    console.log(`[P]::updateDiscount::`, req.params, req.body);
    new OkResponse(
      "Discount updated successfully",
      await DiscountService.updateDiscount({
        userId: req.user._id,
        discountId: req.params.discountId,
        payload: req.body,
      })
    ).send(res);
  };
  deleteDiscount = async (req, res, next) => {
    console.log(`[P]::deleteDiscount::`, req.params);
    new OkResponse(
      "Discount deleted successfully",
      await DiscountService.deleteDiscount({
        discountId: req.params.discountId,
        userId: req.user._id,
      })
    ).send(res);
  };
  getListShopDiscount = async (req, res, next) => {
    console.log(`[P]::getListShopDiscount::`, req.params, req.query);
    new OkResponse(
      "List shop discount",
      await DiscountService.getListDiscountCode({
        shopId: req.params.shopId,
        limit: req.query.limit,
        page: req.query.page,
        userId: req.user._id,
      })
    ).send(res);
  };
  getProductsDiscount = async (req, res, next) => {
    console.log(`[P]::getProductsDiscount::`, req.params, req.query);
    new OkResponse(
      "List products discount",
      await DiscountService.getProductsDiscount({
        shopId: req.params.shopId,
        discountId: req.params.discountId,
        limit: req.query.limit,
        page: req.query.page,
        userId: req.user._id,
      })
    ).send(res);
  }
  getDiscountAmount = async (req, res, next) => {
    console.log(`[P]::getDiscountAmount::`, req.params);
    new OkResponse(
      "Discount amount",
      await DiscountService.getDiscountAmount({
        discountId: req.params.discountId,
        shopId: req.params.shopId,
        userId: req.user._id,
        products: req.body.products,
      })
    ).send(res);
  }
  applyDiscount = async (req, res, next) => {
    console.log(`[P]::applyDiscount::`, req.params);
    new OkResponse(
      "Discount applied",
      await DiscountService.applyDiscountCode({
        discountId: req.params.discountId,
        userId: req.user._id,
      })
    ).send(res);
  }
  cancelDiscount = async (req, res, next) => {
    console.log(`[P]::cancelDiscount::`, req.params);
    new OkResponse(
      "Discount cancel",
      await DiscountService.cancelDiscountCode({
        discountId: req.params.discountId,
        userId: req.user._id,
      })
    ).send(res);
  }
}

module.exports = new DiscountController();
