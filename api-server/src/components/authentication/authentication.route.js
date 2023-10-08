const express = require("express");
const authenticationController = require("./authentication.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const authenticateRefreshToken = require("../../middlewares/authenticateRefreshToken");
const router = express.Router();

router.get("", (req, res, next) => {
  return res.status(200).json({
    message: "Authentication",
  });
});
router.post("/signup", asyncHandler(authenticationController.signUp));
router.post("/signin", asyncHandler(authenticationController.signIn));

router.use(authenticateRefreshToken);
router.get("/refresh", asyncHandler(authenticationController.refreshToken));
router.post("/signout", asyncHandler(authenticationController.signOut));

module.exports = router;
