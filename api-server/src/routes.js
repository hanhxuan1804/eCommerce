const express = require("express");
const router = express.Router();
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger-output.json");
const authRouter = require("./components/authentication/authentication.route");
const shopRouter = require("./components/shop/shop.route");
const productRouter = require("./components/product/product.route");
const discountRouter = require("./components/discount/discount.route");
const cartRouter = require("./components/cart/cart.route");
const passport = require("./middlewares/passport");
const { checkApiKey, permission } = require("./middlewares/apikey");
const asyncHandler = require("./helpers/asyncHandler");
const configs = require("./configs");

router.get("/", (req, res, next) => {
  return res.status(200).json({
    message: `This is the root of the api, please use ${configs.api.url} to access the api, for more information please check the documentation at ${configs.api.url}/docs`,
  });
});
router.use("/v1/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//init passport
router.use(passport.initialize());
//check api key
router.use(asyncHandler(checkApiKey));
//check permission
router.use(asyncHandler(permission("0000")));

router.get(
  "/v1/api",
  // #swagger.tags = ['API']
  (req, res, next) => {
    return res.status(200).json({
      message: "eCommerce api",
    });
  }
);

router.use(
  "/v1/api/auth",
  authRouter
  /*
#swagger.tags = ['Authentication']
#swagger.description = 'Endpoint for authentication'
*/
);
router.use(
  "/v1/api/shops",
  shopRouter
  /*
#swagger.tags = ['Shop']
#swagger.description = 'Endpoints for shop'
*/
);
router.use(
  "/v1/api/products",
  productRouter
  /*
#swagger.tags = ['Product']
#swagger.description = 'Endpoints for product'
*/
);
router.use(
  "/v1/api/discounts",
  discountRouter
  /*
#swagger.tags = ['Discount']
#swagger.description = 'Endpoints for discount'
*/
);
router.use(
  "/v1/api/cart",
  cartRouter
  /*
#swagger.tags = ['Cart']
#swagger.description = 'Endpoints for cart'
*/
);

module.exports = router;
