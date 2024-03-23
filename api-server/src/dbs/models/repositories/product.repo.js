const {
  Product,
  Clothes,
  Electronics,
  Furniture,
  OtherProducts,
} = require("../product.model");
const { getSelectData, unGetSelectData, convertStringToMongoId } = require("../../../utils");
const sortObject = {
  ctime: { createdAt: -1 },
  relevancy: { createdAt: -1 },
  "price-asc": { price: 1 },
  "price-desc": { price: -1 },
  rating: { rating: -1 },
  sales: { sales: -1 },
};

const findAllDraftsOfShop = async ({ query, skip, limit }) => {
  return await queryProduct(query, skip, limit);
};

const findAllPublishedOfShop = async ({ query, skip, limit }) => {
  return await queryProduct(query, skip, limit);
};

const publishProductById = async ({ product_id, product_shop }) => {
  const product = await Product.findOne({ _id: product_id, product_shop })
    .lean()
    .exec();
  if (!product) return false;
  if (!product.isDraft) return false;
  product.isDraft = false;
  product.isPublished = true;
  const { modifiedCount } = await Product.updateOne(
    { _id: product_id, product_shop },
    product
  );

  return modifiedCount;
};
const unpublishProductById = async ({ product_id, product_shop }) => {
  const product = await Product.findOne({ _id: product_id, product_shop })
    .lean()
    .exec();
  if (!product) return false;
  if (!product.isPublished) return false;
  product.isDraft = true;
  product.isPublished = false;
  const { modifiedCount } = await Product.updateOne(
    { _id: product_id, product_shop },
    product
  );
  return modifiedCount;
};
const queryProduct = async (query, skip, limit) => {
  return await Product.find(query)
    .populate("product_shop", "name email -_id")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

const findAllProducts = async ({ limit, page, sort, filter, select }) => {
  const skip = (page - 1) * limit;
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
const findProductById = async ({ product_id, unSelect = [] }) => {
  const product = await Product.findById(product_id)
    .select(unGetSelectData(unSelect))
    .populate("product_shop", "name email -_id")
    .lean()
    .exec();
  return product;
};
const searchProduct = async ({ keyword, unSelect = [] }) => {
  const regexSearch = new RegExp(keyword, "i");
  const products = await Product.find({
    $or: [
      { product_name: { $regex: regexSearch } },
      { product_description: { $regex: regexSearch } },
    ],
  })
    .select(unGetSelectData(unSelect))
    .sort({ createdAt: -1 })
    .lean()
    .exec();
  return products;
};
const updateProductById = async ({
  product_id,
  payload,
  model,
  isNew = true,
  unSelect = [],
}) => {
  return await model
    .findByIdAndUpdate(product_id, payload, { new: isNew })
    .select(unGetSelectData(unSelect));
};

const getProductById = async (product_id) => {
    return await Product.findOne({ _id: convertStringToMongoId(product_id)}).lean().exec();
}

module.exports = {
  findAllDraftsOfShop,
  publishProductById,
  findAllPublishedOfShop,
  unpublishProductById,
  findAllProducts,
  findProductById,
  searchProduct,
  updateProductById,
  getProductById
};
