const {
  Product: productModel,
  Electronics: electronicsModel,
  Clothes: clothesModel,
  Furniture: furnitureModel,
  OtherProducts: otherProductsModel,
  Shops: shopModel,
} = require("../../dbs/models");
const {
  BadRequestResponeError,
  UnauthorizedResponseError,
} = require("../../core/error.response");
const {
  findAllDraftsOfShop,
  publishProductById,
  findAllPublishedOfShop,
  unpublishProductById,
  findAllProducts,
  findProductById,
  searchProduct,
} = require("../../dbs/models/repositories/product.repo");

//define product factory

class ProductFactory {
  /*
    this function will create a new product based on the product category
    type: String (Electronics, Clothes, Furniture, OtherProducts)- required
    payload: Object - required
    */
  static productsRegistery = {}; //store all product class: key: product category, value: product classref
  static registerProduct(type, productClass) {
    return (ProductFactory.productsRegistery[type] = productClass);
  }
  static async createProduct(type, payload, user) {
    //check if shop is valid
    const shop = await shopModel.findById(payload.product_shop);
    if (!shop) throw new BadRequestResponeError("Invalid shop");
    const checkShop = shop.user.toString() === user._id.toString();
    if (!checkShop) throw new BadRequestResponeError("Shop not belong to user");
    //check if product category is valid
    const productClass = ProductFactory.productsRegistery[type];
    if (!productClass)
      throw new BadRequestResponeError("Invalid product category");
    //create product
    return await new productClass(payload).createProduct();
  }
  static async findAllProducts({limit = 50, sort = "ctime", page =1, filter = { isPublished: true }}) {
    return await findAllProducts({ limit, sort, filter, page
      , select: ["productName", "productPrice", "productThumbnail"]
    })
  }
  static async findProduct({ productId, unSelect = [] }) {
    unSelect = unSelect.concat(["__v", "isDraft", "isPublished"]);
    return await findProductById({ productId, unSelect });
  }
  static async searchProduct({ keyword , unSelect = [] }) {
    unSelect = unSelect.concat(["__v", "isDraft", "isPublished"]);
    return await searchProduct({ keyword, unSelect });
  }
  //QUERY//
  static async findAllDraftsForShop({ productShop, skip = 0, limit = 60 }) {
    const query = { productShop, isDraft: true };
    return await findAllDraftsOfShop({ query, skip, limit });
  }
  static async findAllPublishedForShop({ productShop, skip = 0, limit = 60 }) {
    const query = { productShop, isPublished: true };
    return await findAllPublishedOfShop({ query, skip, limit });
  }
  //END QUERY//
  //PUT//
  static async publishProduct({ productId, user, productShop }) {
    //check if shop is belong to user
    const shop = await shopModel.findById(productShop);
    if (!shop) throw new BadRequestResponeError("Invalid shop");
    const checkShop = shop.user.toString() === user._id.toString();
    if (!checkShop)
      throw new UnauthorizedResponseError("Shop not belong to user");
    //publish product
    const modifiedCount = await publishProductById({
      productId,
      productShop,
    });
    console.log(modifiedCount);
    if (!modifiedCount) throw new BadRequestResponeError("Invalid product");
    return modifiedCount;
  }
  static async unpublishProduct({ productId, user, productShop }) {
    //check if shop is belong to user
    const shop = await shopModel.findById(productShop);
    if (!shop) throw new BadRequestResponeError("Invalid shop");
    const checkShop = shop.user.toString() === user._id.toString();
    if (!checkShop)
      throw new UnauthorizedResponseError("Shop not belong to user");
    //unpublish product
    const modifiedCount = await unpublishProductById({
      productId,
      productShop,
    });
    if (!modifiedCount) throw new BadRequestResponeError("Invalid product");
    return modifiedCount;
  }
  //END PUT//
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

//register product class
ProductFactory.registerProduct("Electronics", Electronics);
ProductFactory.registerProduct("Clothes", Clothes);
ProductFactory.registerProduct("Furniture", Furniture);
ProductFactory.registerProduct("OtherProducts", OtherProducts);

module.exports = ProductFactory;
