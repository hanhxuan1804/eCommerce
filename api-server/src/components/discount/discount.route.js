const router = require('express').Router();
const passport = require("../../middlewares/passport");
const asyncHandler = require("../../helpers/asyncHandler");
const DiscountController = require('./discount.controller');

router.use(passport.authenticate("jwt", { session: false }));
router.post('/create', asyncHandler(DiscountController.createDiscount));
router.put('/update/:discountId', asyncHandler(DiscountController.updateDiscount));
router.delete('/delete/:discountId', asyncHandler(DiscountController.deleteDiscount));
router.get('/list/:shopId', asyncHandler(DiscountController.getListShopDiscount));
router.get('/:shopId/:discountId', asyncHandler(DiscountController.getProductsDiscount));
router.get('/amount/:discountId', asyncHandler(DiscountController.getDiscountAmount));
router.put('/apply/:discountId', asyncHandler(DiscountController.applyDiscount));
router.put('/cancel/:discountId', asyncHandler(DiscountController.cancelDiscount));

module.exports = router;