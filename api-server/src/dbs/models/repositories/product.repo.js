const {
  Product,
  Clothes,
  Electronics,
  Furniture,
  OtherProducts,
} = require("../product.model");
const { getSelectData, unGetSelectData } = require("../../../utils");

const findAllDraftsOfShop = async ({ query, skip, limit }) => {
  return await queryproduct(query, skip, limit);
};

const findAllPublishedOfShop = async ({ query, skip, limit }) => {
  return await queryproduct(query, skip, limit);
};

const publishProductById = async ({ productId, productShop }) => {
  const product = await Product.findOne({ _id: productId, productShop })
    .lean()
    .exec();
  if (!product) return false;
  if (!product.isDraft) return false;
  product.isDraft = false;
  product.isPublished = true;
  const { modifiedCount } = await Product.updateOne(
    { _id: productId, productShop },
    product
  );

  return modifiedCount;
};
const unpublishProductById = async ({ productId, productShop }) => {
  const product = await Product.findOne({ _id: productId, productShop })
    .lean()
    .exec();
  if (!product) return false;
  if (!product.isPublished) return false;
  product.isDraft = true;
  product.isPublished = false;
  const { modifiedCount } = await Product.updateOne(
    { _id: productId, productShop },
    product
  );
  return modifiedCount;
};
const queryproduct = async (query, skip, limit) => {
  return await Product.find(query)
    .populate("productShop", "name email -_id")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

const findAllProducts = async ({ limit, page, sort, filter, select }) => {
  const skip = (page - 1) * limit;
  const sortObject = {
    ctime: { createdAt: -1 },
    relevancy: { createdAt: -1 }, //TODO: relevancy
    "price-asc": { price: 1 },
    "price-desc": { price: -1 },
    rating: { rating: -1 },
    sales: { sales: -1 },
  };
  const sortBy = sortObject[sort];
  const products = await Product.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean()
    .exec();
  return products;
};
const findProductById = async ({ productId, unSelect }) => {
  const product = await Product.findById(productId)
  .select(unGetSelectData(unSelect))
  .populate("productShop", "name email -_id")
  .lean()
  .exec();
  return product;
};
const searchProduct = async ({ keyword, unSelect }) => {
  const regexSearch = new RegExp(keyword, "i");
  const products = await Product.find({
    $or: [
      { productName: { $regex: regexSearch } },
      { productDescription: { $regex: regexSearch } },
    ],
  }).select(unGetSelectData(unSelect))
    .sort({ createdAt: -1 })
    .lean()
    .exec();
  return products;
}

module.exports = {
  findAllDraftsOfShop,
  publishProductById,
  findAllPublishedOfShop,
  unpublishProductById,
  findAllProducts,
  findProductById,
  searchProduct,
};
