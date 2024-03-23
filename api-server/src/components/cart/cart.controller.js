const CartService = require("./cart.service");
const { CreatedResponse,
    OkResponse,
} = require("../../utils");

class CartController {
   addProductToCart = async (req, res, next) => {
        console.log(`[P]::addProductToCart::`, req.body);
        new OkResponse(
            "Product added to cart successfully",
            await CartService.addProductToCart({
                userId: req.user._id,
                product: req.body.product,
            })
        ).send(res);
    };
    reduceProductQuantity = async (req, res, next) => {
        console.log(`[P]::reduceProductQuantity::`, req.body);
        new OkResponse(
            "Product quantity reduced successfully",
            await CartService.reduceProductQuantity({
                userId: req.user._id,
                product: req.body,
            })
        ).send(res);
    };
    increaseProductQuantity = async (req, res, next) => {
        console.log(`[P]::increaseProductQuantity::`, req.body);
        new OkResponse(
            "Product quantity increased successfully",
            await CartService.increaseProductQuantity({
                userId: req.user._id,
                product: req.body,
            })
        ).send(res);
    };
    removeProductFromCart = async (req, res, next) => {
        console.log(`[P]::removeProductFromCart::`, req.body);
        new OkResponse(
            "Product removed from cart successfully",
            await CartService.removeProductFromCart({
                userId: req.user._id,
                product: req.body,
            })
        ).send(res);
    };
    getCartDetails = async (req, res, next) => {
        console.log(`[P]::getCartDetails::`, req.body);
        new OkResponse(
            "Cart details",
            await CartService.getCartDetails({
                userId: req.user._id,
            })
        ).send(res);
    };
    deleteAllProductInCart = async (req, res, next) => {
        console.log(`[P]::deleteAllProductInCart::`, req.body);
        new OkResponse(
            "All products removed from cart successfully",
            await CartService.deleteAllProductInCart({
                userId: req.user._id,
            })
        ).send(res);
    };
    changeCartState = async (req, res, next) => {
        console.log(`[P]::changeCartState::`, req.body);
        new OkResponse(
            "Cart state changed successfully",
            await CartService.changeCartState({
                userId: req.user._id,
                state: req.body.state,
            })
        ).send(res);
    };
};

module.exports = new CartController();