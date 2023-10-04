const ShopService = require("./shop.service");
const { CreatedResponse, OkResponse } = require("../../core/success.response");

class ShopController {
  createShop = async (req, res, next) => {
    console.log(`[P]::createShop::`, req.body);
    new CreatedResponse(
      "Create shop successfully !",
      await ShopService.createShop({
        user: req.user,
        data: req.body,
      })
    ).send(res);
  };
  getShop = async (req, res, next) => {
    console.log(`[P]::getShop::`, req.user.email);
    new OkResponse(
      "Get shop successfully !",
      await ShopService.getShop({
        user: req.user,
      })
    ).send(res);
  };
  getShopById = async (req, res, next) => {
    console.log(`[P]::getShopById::`, req.params.id);
    new OkResponse(
      "Get shop by id successfully !",
      await ShopService.getShopById({
        user: req.user,
        data: req.params.id,
      })
    ).send(res);
  };
  updateShopById = async (req, res, next) => {
    console.log(`[P]::updateShopById::`, req.params.id, req.body);
    new OkResponse(
      "Update shop by id successfully !",
      await ShopService.updateShopById({
        user: req.user,
        data: req.params.id,
        body: req.body,
      })
    ).send(res);
  };
}

module.exports = new ShopController();
