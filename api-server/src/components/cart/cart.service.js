/**
 * Key feature: Cart service
 *
 * 1. Add product to cart [User]
 * 2. Reduce product quantity from cart [User]
 * 3. Increase product quantity from cart [User]
 * 4. Get cart details [User]
 * 5. Delete cart [User]
 * 6. Delete product from cart [User]
 */
const { forEach } = require("lodash");
const { BadRequestResponseError } = require("../../core/error.response");
const { Carts } = require("../../dbs/models");
const { getProductById } = require("../../dbs/models/repositories/product.repo");


class CartService {
  /// START REPO CART ///
  static async createUserCart({ userId, product = {} }) {
    const query = {
      cart_owner: userId,
      cart_state: "active",
    };
    const updateOrInsert = {
      $addToSet: {
        cart_products: [product],
      },
      $inc: {
        cart_count_products: cart_count_products + 1,
      },
    };
    const options = {
      upsert: true,
      new: true,
    };
    return await Carts.findOneAndUpdate(query, updateOrInsert, options);
  }
  static async createUserCartWithProducts({ userId, products = [] }) {
    const query = {
      cart_owner: userId,
      cart_state: "active",
    };
    const updateOrInsert = {
      $addToSet: {
        cart_products: {
          $each: products,
        },
      },
      $inc: {
        cart_count_products: products.length,
      },
    };
    const options = {
      upsert: true,
      new: true,
    };
    return await Carts.findOneAndUpdate(query, updateOrInsert, options);
  }
  static async updateProductQuantity({ userId, product = {} }) {
    const query = {
      cart_owner: userId,
      "cart_products.product_id": product.product_id,
      cart_state: "active",
    };
    const update = {
      $inc: {
        "cart_products.$.quantity": product.quantity,
      },
    };
    const options = {
      upsert: true,
      new: true,
    };
    return await Carts.findOneAndUpdate(query, update, options);
  }
  /// END REPO CART ///
  static async addProductToCart({ userId, product = {} }) {
    // Add product to cart
    /**
     * product = {
     *  product_id: "product_id",
     *  shop_id: "shop_id",
     *  quantity: 1,
     *  price: 100,
     *  name: "product_name",
     * }
     */
    // Check product is available
    if (!product.product_id || !product.shop_id || !product.quantity) {
      throw BadRequestResponseError("Data not found");
    }
    const foundProduct = await getProductById(product.product_id);
    if (!foundProduct || foundProduct.isDraft || !foundProduct.isPublished || foundProduct.quantity < product.quantity) {
      throw BadRequestResponseError("Product not found");
    }
    // Check if cart exists
    const userCart = Carts.findOne({ cart_owner: userId });
    if (!userCart) {
      return await CartService.createUserCart({ userId, product });
    }
    // Cart is already created
    // Check if cart is empty
    if (userCart.cart_count_product === 0) {
      userCart.cart_products = [product];
      return await userCart.save();
    }
    // Check if product already exists in cart
    const productIndex = userCart.cart_products.findIndex(
      (p) => p.product_id === product.product_id
    );
    if (productIndex !== -1) {
      return await CartService.updateProductQuantity({ userId, product });
    }
    // Product does not exist in cart
    userCart.cart_products.push(product);
    return await userCart.save();
  }
  // update cart
  /**
   * shop_order_ids: [
   *    {
   *        shopId: "shop_id",
   *        itemProducts: [
   *          {
   *              productId: "product_id",
   *              quantity: 1,
   *              oldQuantity: 2,
   *              productPrice: 100,
   *              shopId: "shop_id",
   *              name: "product_name"
   *          },
   *        version: 1
   *    }
   * ]
   */
  //This function did not use. I will update it later
  static async addToCard({ userId, shop_order_ids = [] }) {
    // Add product to cart
    if (shop_order_ids.length === 0 || !userId) {
      throw BadRequestResponseError("Data not found");
    }
    const products = [];
    forEach(shop_order_ids, (shopOrder) => {
      forEach(shopOrder.itemProducts, (product) => {
        products.push({
          product_id: product.productId,
          shop_id: shopOrder.shopId,
          quantity: product.quantity,
          price: product.productPrice,
          name: product.name,
        });
      });
    });
    // Check if cart exists
    const userCart = Carts.findOne({ cart_owner: userId });
    if (!userCart) {
      return await CartService.createUserCartWithProducts({
        userId,
        products,
      });
    }
    // Cart is already created
    // Check if cart is empty
    if (userCart.cart_count_product === 0) {
      userCart.cart_products = products;
      userCart.cart_count_products = products.length;
      return await userCart.save();
    }
    // Check if product already exists in cart
    forEach(products, (product) => {
      const productIndex = userCart.cart_products.findIndex(
        (p) => p.product_id === product.product_id
      );
      if (productIndex !== -1) {
        if (product.quantity === 0) {
          userCart.cart_products.splice(productIndex, 1);
        } else {
          userCart.cart_products[productIndex].quantity = product.quantity;
        }
      } else {
        userCart.cart_products.push(product);
      }
    });
    return await userCart.save();
  }

  static async reduceProductQuantity(userId, product = {}) {
    // Reduce product quantity from cart
    // Check if cart exists and product exists in cart
    const userCart = Carts.findOne({ cart_owner: userId, cart_state: "active"});
    if (!userCart) {
      throw BadRequestResponseError("Data not found");
    }
    const productIndex = userCart.cart_products.findIndex(
      (p) => p.product_id === product.product_id
    );
    if (productIndex === -1) {
      throw BadRequestResponseError("Data not found");
    }
    // Reduce product quantity
    userCart.cart_products[productIndex].quantity -= product.quantity;
    return await userCart.save();
  }

  static async increaseProductQuantity(userId, productId, quantity) {
    // Increase product quantity from cart
    // Check if cart exists and product exists in cart
    const userCart = Carts.findOne({ cart_owner: userId, cart_state: "active"});
    if (!userCart) {
      throw BadRequestResponseError("Data not found");
    }
    const productIndex = userCart.cart_products.findIndex(
      (p) => p.product_id === productId
    );
    if (productIndex === -1) {
      throw BadRequestResponseError("Data not found");
    }
    // Increase product quantity
    userCart.cart_products[productIndex].quantity += quantity;
    return await userCart.save();

  }

  static async getCartDetails(userId) {
    // Get cart details
    
    return await Carts.findOne({ cart_owner: userId, cart_state: "active"});
  }

  static async deleteAllProductInCart(userId) {
    // Delete all products in cart
    // Check if cart exists
    const userCart = Carts.findOne({ cart_owner: userId, cart_state: "active"});
    if (!userCart) {
      throw BadRequestResponseError("Data not found");
    }
    // Delete all products in cart
    userCart.cart_products = [];
    userCart.cart_count_products = 0;
    return await userCart.save();
  }

  static async deleteProductFromCart(userId, productId) {
    // Delete product from cart
    // Check if cart exists and product exists in cart
    const userCart = Carts.findOne({ cart_owner: userId, cart_state: "active"});
    if (!userCart) {
      throw BadRequestResponseError("Data not found");
    }
    const productIndex = userCart.cart_products.findIndex(
      (p) => p.product_id === productId
    );
    if (productIndex === -1) {
      throw BadRequestResponseError("Data not found");
    }
    // Delete product from cart
    userCart.cart_products.splice(productIndex, 1);
    userCart.cart_count_products -= 1;
    return await userCart.save();
  }

  static async changeCartState({userId, state}) {
    // Change cart state
    // Check if cart exists
    const userCart = Carts.findOne({ cart_owner: userId, cart_state: "active"});
    if (!userCart) {
      throw BadRequestResponseError("Data not found");
    }
    // Change cart state
    userCart.cart_state = state;
    return await userCart.save();
  }

}

module.exports = CartService