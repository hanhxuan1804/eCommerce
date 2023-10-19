const { CreatedResponse, OkResponse } = require("../../core/success.response");
const ProductServices = require("./product.service");

class ProductController {
  createProduct = async (req, res, next) => {
    console.log(`[P]::createProduct::`, req.body);
    const { product_category } = req.body;
    new CreatedResponse({
      message: "Product created successfully",
      metadata: await ProductServices.createProduct(
        product_category,
        req.body,
        req.user
      ),
    }).send(res);
  };
  findAllProducts = async (req, res, next) => {
    console.log(`[P]::findAllProducts::`, req.query);
    new OkResponse({
      message: "Get all products successfully",
      metadata: await ProductServices.findAllProducts(req.query),
    }).send(res);
  }
  findProductById = async (req, res, next) => {
    console.log(`[P]::findProductById::`, req.params);
    new OkResponse({
      message: "Get product successfully",
      metadata: await ProductServices.findProduct({
        productId: req.params.productId
      }),
    }).send(res);
  }
  searchProduct = async (req, res, next) => {
    console.log(`[P]::searchProduct::`, req.params);
    new OkResponse({
      message: "Search product successfully",
      metadata: await ProductServices.searchProduct({
        keyword: req.params.keyword,
      }),
    }).send(res);
  }
  //QUERY//
  /**
   * @description Get all drafts of a shop
   * @param { String } productShop - required
   * @param { Number } skip - optional
   * @param { Number } limit - optional
   * @returns { Object } { message, metadata }
   */
  getDraftsForShop = async (req, res, next) => {
    console.log(`[P]::getDraftsForShop::`, { ...req.params, ...req.query});
    const { productShop } = req.params;
    const { skip, limit } = req.query;
    new OkResponse({
      message: "Get drafts successfully",
      metadata: await ProductServices.findAllDraftsForShop({
        productShop,
        skip,
        limit,
      }),
    }).send(res);
  };
  /**
   * @description Get all published products of a shop
   * @param { String } productShop - required
   * @param { Number } skip - optional
   * @param { Number } limit - optional
   * @returns { Object } { message, metadata }
   */
  getPublishedForShop = async (req, res, next) => {
    console.log(`[P]::getPublishedForShop::`, { ...req.params, ...req.query });
    const { productShop } = req.params;
    const { skip, limit } = req.query;
    new OkResponse({
      message: "Get published products successfully",
      metadata: await ProductServices.findAllPublishedForShop({
        productShop,
        skip,
        limit,
      }),
    }).send(res);
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
    console.log(`[P]::publishProduct::`, req.params);
    const { productShop, productId } = req.params;
    new OkResponse({
      message: "Publish product successfully",
      metadata: await ProductServices.publishProduct({
        productId,
        productShop,
        user: req.user,
      }),
    }).send(res);
  };
  /**
   * @description Unpublish a product
   * @param { String } productId - required
   * @param { String } productShop - required
   * @returns { Object } { message, metadata }
   */
  unpublishProduct = async (req, res, next) => {
    console.log(`[P]::unpublishProduct::`, req.params);
    const { productShop, productId } = req.params;
    new OkResponse({
      message: "Unpublish product successfully",
      metadata: await ProductServices.unpublishProduct({
        productId,
        productShop,
        user: req.user,
      }),
    }).send(res);
  };
  //END PUT//
}

module.exports = new ProductController();
