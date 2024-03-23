const CartController = require("./cart.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const passport = require("../../middlewares/passport");
const express = require("express");
const router = express.Router();

router.use(passport.authenticate("jwt", { session: false }));
router.post("/add", CartController.addProductToCart
    /* 
    #swagger.summary = "Add product to cart"
    #swagger.description = "Endpoint to add product to cart"
    #swagger.parameters['product'] = {
        in: 'body',
        description: 'Product to add object',
        required: true,
        schema: { 
            product_id: "60c9e3e0b3d0c20015f2b3b8",
            shop_id: "60c9e3e0b3d0c20015f2b3b8",
            quantity: 1,
            price: 10.5,
            name: "Product name",
         }
    }
    #swagger.responses[200] = {
        description: "Product added to cart successfully"
    }
    #swagger.security = [{
        "bearerAuth": []
    }]
    */
);
router.post("/reduce", CartController.reduceProductQuantity);
router.post("/increase", CartController.increaseProductQuantity);
router.post("/remove", CartController.removeProductFromCart);
router.get("/details", CartController.getCartDetails);
router.post("/clear", CartController.deleteAllProductInCart);
router.post("/change-state", CartController.changeCartState);

module.exports = router;