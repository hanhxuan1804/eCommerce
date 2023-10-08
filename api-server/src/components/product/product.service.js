const {
  Product: productModel,
  Electronics: electronicsModel,
  Clothes: clothesModel,
  Furniture: furnitureModel,
  OtherProducts: otherProductsModel,
  Shops: shopModel,
} = require("../../dbs/models");
const { BadRequestResponeError } = require("../../core/error.response");

//define product factory

class ProductFactory {
  /*
    this function will create a new product based on the product category
    type: String (Electronics, Clothes, Furniture, OtherProducts)- required
    payload: Object - required
    */
  static async createProduct(type, payload, user) {
    //check if shop is valid
    const shop = await shopModel.findById(payload.product_shop);
    if (!shop) throw new BadRequestResponeError("Invalid shop");
    const checkShop = shop.user.toString() === user._id.toString();
    if (!checkShop) throw new BadRequestResponeError("Shop not belong to user");

    switch (type) {
      case "Electronics":
        return await new Electronics(payload).createProduct();
      case "Clothes":
        return await new Clothes(payload).createProduct();
      case "Furniture":
        return await new Furniture(payload).createProduct();
      case "OtherProducts":
        return await new OtherProducts(payload).createProduct();
      default:
        throw new BadRequestResponeError("Invalid product category");
    }
  }
}
//define base product class
class Product {
  constructor({
    product_name,
    product_price,
    product_description,
    product_thumbnail,
    product_quantity,
    product_category,
    product_attributes,
    product_shop,
  }) {
    this.product_name = product_name;
    this.product_price = product_price;
    this.product_description = product_description;
    this.product_thumbnail = product_thumbnail;
    this.product_quantity = product_quantity;
    this.profuct_category = product_category;
    this.product_attributes = product_attributes;
    this.product_shop = product_shop;
  }

  async createProduct(product_id) {
    return await productModel.create({
      _id: product_id,
      productName: this.product_name,
      productPrice: this.product_price,
      productDescription: this.product_description,
      productThumbnail: this.product_thumbnail,
      productQuantity: this.product_quantity,
      productCategory: this.profuct_category,
      productAttributes: this.product_attributes,
      productShop: this.product_shop,
    });
  }
}

//define sub-class for electronics

class Electronics extends Product {
  async createProduct() {
    const newElectronics = await electronicsModel.create(
      this.product_attributes
    );
    if (!newElectronics)
      throw new BadRequestResponeError("Failed to create new product");
    const newProduct = await super.createProduct(newElectronics._id);
    if (!newProduct)
      throw new BadRequestResponeError("Failed to create new product");
    return newProduct;
  }
}

//define sub-class for clothes
class Clothes extends Product {
  async createProduct() {
    const newClothes = await clothesModel.create(this.product_attributes);
    if (!newClothes)
      throw new BadRequestResponeError("Failed to create new product");
    const newProduct = await super.createProduct(newClothes._id);
    if (!newProduct)
      throw new BadRequestResponeError("Failed to create new product");
    return newProduct;
  }
}
//define sub-class for furniture
class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furnitureModel.create(this.product_attributes);
    if (!newFurniture)
      throw new BadRequestResponeError("Failed to create new product");

    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct)
      throw new BadRequestResponeError("Failed to create new product");
    return newProduct;
  }
}
//define sub-class for other products
class OtherProducts extends Product {
  async createProduct() {
    const newOtherProducts = await otherProductsModel.create(
      this.product_attributes
    );
    if (!newOtherProducts)
      throw new BadRequestResponeError("Failed to create new product");

    const newProduct = await super.createProduct(newOtherProducts._id);
    if (!newProduct)
      throw new BadRequestResponeError("Failed to create new product");
    return newProduct;
  }
}

module.exports = ProductFactory;
