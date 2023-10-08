const { CreatedResponse } = require("../../core/success.response");
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
}

module.exports = new ProductController();
