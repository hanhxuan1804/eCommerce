const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const ShopController = require("./shop.controller");
const router = express.Router();
const passport = require("../../middlewares/passport");

router.get("", (req, res, next) => {
  return res.status(200).json({
    message: "Shop",
  });
});
router.use(passport.authenticate("jwt", { session: false }));
router.post("/create", asyncHandler(ShopController.createShop));
router.get("/get", asyncHandler(ShopController.getShop));
router.get("/get/:id", asyncHandler(ShopController.getShopById));
router.put("/update/:id", asyncHandler(ShopController.updateShopById));

module.exports = router;
