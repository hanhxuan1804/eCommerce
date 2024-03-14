const Inventories = require("../models/inventory.model");

const insertInventory = async ({
  productId,
  location = "unknown",
  stock,
  sold = 0,
  shop,
  status = "active",
  reservations = [],
}) => {
  return await Inventories.create({
    iven_productId: productId,
    iven_location: location,
    iven_stock: stock,
    iven_sold: sold,
    inven_shop: shop,
    iven_status: status,
    inven_reservations: reservations,
  });
};

module.exports = {
  insertInventory,
};
