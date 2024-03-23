const router = require("express").Router();
const passport = require("../../middlewares/passport");

const asyncHandler = require("../../helpers/asyncHandler");
const ProductController = require("./product.controller");
router.get("/", asyncHandler(ProductController.findAllProducts));
router.get("/:productId", asyncHandler(ProductController.findProductById));
router.get("/search/:keyword", asyncHandler(ProductController.searchProduct));

//auth
router.use(
  passport.authenticate("jwt", { session: false })
);
//POST//
router.post(
  "/",
  asyncHandler(ProductController.createProduct)
);
router.patch("/:productId", asyncHandler(ProductController.updateProduct));
//QUERY//
router.get(
  "/drafts/:productShop",
  asyncHandler(ProductController.getDraftsForShop)
);
router.get(
  "/published/:productShop",
  asyncHandler(ProductController.getPublishedForShop)
);
//END QUERY//
//PUT//
router.put(
  "/publish/:productShop/:productId",
  asyncHandler(ProductController.publishProduct)
);
router.put(
  "/unpublish/:productShop/:productId",
  asyncHandler(ProductController.unpublishProduct)
);
//END PUT//

module.exports = router;
