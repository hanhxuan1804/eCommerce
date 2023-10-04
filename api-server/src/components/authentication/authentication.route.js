const express = require("express");
const authenticationController = require("./authentication.controller");
const asyncHandler = require("../../helpers/asyncHandler");

const router = express.Router();

router.get("", (req, res, next) => {
  return res.status(200).json({
    message: "Authentication",
  });
});
router.post("/signup", asyncHandler(authenticationController.signUp));
router.post("/signin", asyncHandler(authenticationController.signIn));

module.exports = router;
