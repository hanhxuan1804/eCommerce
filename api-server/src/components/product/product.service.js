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
  updateProductById,
} = require("../../dbs/models/repositories/product.repo");
const {
  removeUndefinedAndNull,
  removeUndefinedAndNullNestedObject,
  getInfoData,
  unGetInfoData,
} = require("../../utils");

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
  static async updateProduct(type, product_id, payload, user) {
    //check if shop is valid
    const shop = await shopModel.findById(payload.product_shop);
    if (!shop) throw new BadRequestResponeError("Invalid shop");
    const checkShop = shop.user.toString() === user._id.toString();
    if (!checkShop) throw new BadRequestResponeError("Shop not belong to user");
    //check if product category is valid
    const productClass = ProductFactory.productsRegistery[type];
    if (!productClass)
      throw new BadRequestResponeError("Invalid product category");

    return await new productClass(payload).updateProduct(product_id);
  }

  static async findAllProducts({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { isPublished: true },
  }) {
    return await findAllProducts({
      limit,
      sort,
      filter,
      page,
      select: ["product_name", "product_price", "product_thumbnail"],
    });
  }
  static async findProduct({ product_id, unSelect = [] }) {
    unSelect = unSelect.concat(["__v", "isDraft", "isPublished"]);
    return await findProductById({ product_id, unSelect });
  }
  static async searchProduct({ keyword, unSelect = [] }) {
    unSelect = unSelect.concat(["__v", "isDraft", "isPublished"]);
    return await searchProduct({ keyword, unSelect });
  }
  //QUERY//
  static async findAllDraftsForShop({ product_shop, skip = 0, limit = 60 }) {
    const query = { product_shop, isDraft: true };
    return await findAllDraftsOfShop({ query, skip, limit });
  }
  static async findAllPublishedForShop({ product_shop, skip = 0, limit = 60 }) {
    const query = { product_shop, isPublished: true };
    return await findAllPublishedOfShop({ query, skip, limit });
  }
  //END QUERY//
  //PUT//
  static async publishProduct({ product_id, user, product_shop }) {
    //check if shop is belong to user
    const shop = await shopModel.findById(product_shop);
    if (!shop) throw new BadRequestResponeError("Invalid shop");
    const checkShop = shop.user.toString() === user._id.toString();
    if (!checkShop)
      throw new UnauthorizedResponseError("Shop not belong to user");
    //publish product
    const modifiedCount = await publishProductById({
      product_id,
      product_shop,
    });
    console.log(modifiedCount);
    if (!modifiedCount) throw new BadRequestResponeError("Invalid product");
    return modifiedCount;
  }
  static async unpublishProduct({ product_id, user, product_shop }) {
    //check if shop is belong to user
    const shop = await shopModel.findById(product_shop);
    if (!shop) throw new BadRequestResponeError("Invalid shop");
    const checkShop = shop.user.toString() === user._id.toString();
    if (!checkShop)
      throw new UnauthorizedResponseError("Shop not belong to user");
    //unpublish product
    const modifiedCount = await unpublishProductById({
      product_id,
      product_shop,
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
    this.product_category = product_category;
    this.product_attributes = product_attributes;
    this.product_shop = product_shop;
  }
  //define method to create product
  async createProduct(product_id) {
    return await productModel.create({
      ...this,
      _id: product_id,
    });
  }
  //define method to update product
  async updateProduct(product_id, payload) {
    return await updateProductById({
      product_id: product_id,
      payload,
      model: productModel,
      unSelect: ["__v", "createdAt", "updatedAt", "isDraft", "isPublished"],
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
  async updateProduct(product_id) {
    const objectParams = removeUndefinedAndNullNestedObject(this);
    if (objectParams.product_attributes) {
      const newAttributes = await updateProductById({
        product_id: product_id,
        payload: objectParams.product_attributes,
        model: electronicsModel,
        unSelect: ["__v", "_id", "createdAt", "updatedAt"],
      });
      objectParams.product_attributes = newAttributes;
    }
    const updateClothes = super.updateProduct(product_id, objectParams);
    return updateClothes;
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
  async updateProduct(product_id) {
    const objectParams = removeUndefinedAndNullNestedObject(this);
    if (objectParams.product_attributes) {
      const newAttributes = await updateProductById({
        product_id: product_id,
        payload: objectParams.product_attributes,
        model: clothesModel,
        unSelect: ["__v", "_id", "createdAt", "updatedAt"],
      });
      objectParams.product_attributes = newAttributes;
    }
    const updateClothes = super.updateProduct(product_id, objectParams);
    return updateClothes;
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
  async updateProduct(product_id) {
    const objectParams = removeUndefinedAndNull(this);
    objectParams.product_attributes = removeUndefinedAndNull(
      objectParams.product_attributes
    );
    if (objectParams.product_attributes) {
      const newAttributes = await updateProductById({
        product_id: product_id,
        payload: objectParams.product_attributes,
        model: furnitureModel,
        unSelect: ["__v", "_id", "createdAt", "updatedAt"],
      });
      objectParams.product_attributes = newAttributes;
    }
    const updateClothes = super.updateProduct(product_id, objectParams);
    return updateClothes;
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
  async updateProduct(product_id) {
    const objectParams = removeUndefinedAndNull(this);
    objectParams.product_attributes = removeUndefinedAndNull(
      objectParams.product_attributes
    );
    if (objectParams.product_attributes) {
      const newAttributes = await updateProductById({
        product_id: product_id,
        payload: objectParams.product_attributes,
        model: otherProductsModel,
        unSelect: ["__v", "_id", "createdAt", "updatedAt"],
      });
      objectParams.product_attributes = newAttributes;
    }
    const updateClothes = super.updateProduct(product_id, objectParams);
    return updateClothes;
  }
}

//register product class
ProductFactory.registerProduct("Electronics", Electronics);
ProductFactory.registerProduct("Clothes", Clothes);
ProductFactory.registerProduct("Furniture", Furniture);
ProductFactory.registerProduct("OtherProducts", OtherProducts);

module.exports = ProductFactory;
