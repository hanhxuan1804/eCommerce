const { CreatedResponse, OkResponse } = require("../../core/success.response");
const ProductServices = require("./product.service");

class ProductController {
  createProduct = async (req, res, next) => {
    console.log(`[P]::createProduct::`, req.body);
    const { product_category } = req.body;
    new CreatedResponse(
      "Product created successfully",
      await ProductServices.createProduct(product_category, req.body, req.user)
    ).send(res);
  };
  //update product
  updateProduct = async (req, res, next) => {
    console.log(`[P]::updateProduct::`, req.params, req.body);
    const { product_category } = req.body;
    new OkResponse(
      "Product updated successfully",
      await ProductServices.updateProduct(
        product_category,
        req.params.productId,
        req.body,
        req.user
      )
    ).send(res);
  };
  findAllProducts = async (req, res, next) => {
    console.log(`[G]::findAllProducts::`, req.query);
    new OkResponse(
      "Get all products successfully",
      await ProductServices.findAllProducts(req.query)
    ).send(res);
  };
  findProductById = async (req, res, next) => {
    console.log(`[G]::findProductById::`, req.params);
    new OkResponse(
      "Get product successfully",
      await ProductServices.findProduct({
        productId: req.params.productId,
      })
    ).send(res);
  };
  searchProduct = async (req, res, next) => {
    console.log(`[G]::searchProduct::`, req.params);
    new OkResponse(
      "Search product successfully",
      await ProductServices.searchProduct({
        keyword: req.params.keyword,
      })
    ).send(res);
  };
  //QUERY//
  /**
   * @description Get all drafts of a shop
   * @param { String } productShop - required
   * @param { Number } skip - optional
   * @param { Number } limit - optional
   * @returns { Object } { message, metadata }
   */
  getDraftsForShop = async (req, res, next) => {
    console.log(`[G]::getDraftsForShop::`, { ...req.params, ...req.query });
    const { productShop } = req.params;
    const { skip, limit } = req.query;
    new OkResponse(
      "Get drafts successfully",
      await ProductServices.findAllDraftsForShop({
        product_shop: productShop,
        skip,
        limit,
      })
    ).send(res);
  };
  /**
   * @description Get all published products of a shop
   * @param { String } productShop - required
   * @param { Number } skip - optional
   * @param { Number } limit - optional
   * @returns { Object } { message, metadata }
   */
  getPublishedForShop = async (req, res, next) => {
    console.log(`[G]::getPublishedForShop::`, { ...req.params, ...req.query });
    const { productShop } = req.params;
    const { skip, limit } = req.query;
    new OkResponse(
      "Get published products successfully",
      await ProductServices.findAllPublishedForShop({
        product_shop: productShop,
        skip,
        limit,
      })
    ).send(res);
  };
  //END QUERY//
  //PUT//
  /**
   * @description Publish a product
   * @param { String } productId - required
   * @param { String } productShop - required
   * @returns { Object } { message, metadata }
   */
  publishProduct = async (req, res, next) => {
    console.log(`[PUT]::publishProduct::`, req.params);
    const { productShop, productId } = req.params;
    new OkResponse(
      "Publish product successfully",
      await ProductServices.publishProduct({
        product_id: productId,
        product_shop: productShop,
        user: req.user,
      })
    ).send(res);
  };
  /**
   * @description Unpublish a product
   * @param { String } productId - required
   * @param { String } productShop - required
   * @returns { Object } { message, metadata }
   */
  unpublishProduct = async (req, res, next) => {
    console.log(`[PUT]::unpublishProduct::`, req.params);
    const { productShop, productId } = req.params;
    new OkResponse(
      "Unpublish product successfully",
      await ProductServices.unpublishProduct({
        product_id: productId,
        product_shop: productShop,
        user: req.user,
      })
    ).send(res);
  };
  //END PUT//
}

module.exports = new ProductController();
