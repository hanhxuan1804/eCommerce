const router = require("express").Router();

const asyncHandler = require("../../helpers/asyncHandler");
const ProductController = require("./product.controller");

router.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "Products",
  });
});
router.post("/create", asyncHandler(ProductController.createProduct));

module.exports = router;
