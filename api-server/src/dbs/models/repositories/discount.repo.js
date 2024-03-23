"use strict";
const Discount = require("../discount.model");
const { getSelect, unGetSelectData, convertStringToMongoId } = require("../../../utils");
const sortObject = {
  ctime: { createdAt: -1 },
  relevancy: { createdAt: -1 }, 
  "value-asc": { discount_value: 1 },
  "value-desc": { discount_value: -1 },
  "expire-asc": { discount_end_time: 1 },
  "expire-desc": { discount_end_time: -1 },
};
const findAllDiscountCodeSelect = async ({
  filter = {},
  select = [],
  sort = "ctime",
  limit = 10,
  page = 1,
}) => {
  const skip = limit * (page - 1);
  const sortBy = sortObject[sort];
  return await Discount.find(filter)
    .select(getSelect(select))
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .lean();
};
const findAllDiscountCodeUnselect = async ({
  filter = {},
  unSelect = [],
  sort = "ctime",
  limit = 10,
  page = 1,
}) => {
  const skip = limit * (page - 1);
  const sortBy = sortObject[sort];
  return await Discount.find(filter)
    .select(unGetSelectData(unSelect))
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .lean();
};
const checkDiscountExist = async ({ filter }) => {
  return await Discount.findOne(filter).lean().exec();
}

module.exports = {
  findAllDiscountCodeUnselect,
  findAllDiscountCodeSelect,
  checkDiscountExist,
};
