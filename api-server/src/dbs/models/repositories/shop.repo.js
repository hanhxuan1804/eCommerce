const Shop = require("../shop.model");

const checkShopOwner = async ({ userId, shopId }) => {
  const shop = await Shop.findOne({ _id: shopId, shop_owner: userId })
    .lean()
    .exec();
  if (!shop) return false;
  return true;
};

const checkShopExist = async ({ shopId }) => {
  const shop = await Shop.findOne({ _id: shopId }).lean().exec();
  if (!shop) return false;
  return true;
};

module.exports = {
  checkShopOwner,
  checkShopExist,
};
