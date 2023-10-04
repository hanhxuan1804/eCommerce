const express = require("express");
const router = express.Router();
const authRouter = require("./components/authentication").router;
const shopRouter = require("./components/shop").router;
const passport = require("./middlewares/passport");
const { checkApiKey, permission } = require("./middlewares/apikey");
const asyncHandler = require("./helpers/asyncHandler");

//init passport
router.use(passport.initialize());
//check api key
router.use(asyncHandler(checkApiKey));
//check permission
router.use(asyncHandler(permission("0000")));

router.get("/v1/api", (req, res, next) => {
  return res.status(200).json({
    message: "eCommerce api",
  });
});
router.use("/v1/api/auth", authRouter);
router.use(
  "/v1/api/shops",
  passport.authenticate("jwt", { session: false }),
  shopRouter
);

module.exports = router;
