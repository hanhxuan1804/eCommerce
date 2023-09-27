const express = require("express");
const router = express.Router();
const authRouter = require('./components/authentication').router

router.get('/v1/api', (req, res, next) => {
  return res.status(200).json({
    message: "eCommerce api",
  });});
router.use('/v1/api/auth', authRouter);

module.exports = router;
