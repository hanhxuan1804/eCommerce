const _ = require("lodash");
const { Types } = require("mongoose");

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};
const unGetInfoData = ({ fields = [], object = {} }) => {
  console.log("object", object);
  console.log("fields", fields);
  console.log("_.omit(object, fields)", _.omit(object, fields));
  return _.omit(object, fields);
};

const removeUndefinedAndNull = (object = {}) => {
  return _.pickBy(object, _.identity);
};

const removeUndefinedAndNullNestedObject = (object = {}) => {
  return _.transform(object, (result, value, key) => {
    if (_.isObject(value)) {
      result[key] = removeUndefinedAndNullNestedObject(value);
    } else if (!_.isUndefined(value) && !_.isNull(value)) {
      result[key] = value;
    }
  });
};

const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((item) => [item, 1]));
};

const unGetSelectData = (select = []) => {
  return Object.fromEntries(select.map((item) => [item, 0]));
};

const convertStringToMongoId = (string = "") => {
  return Types.ObjectId(string);
};
module.exports = {
  getInfoData,
  unGetInfoData,
  removeUndefinedAndNull,
  getSelectData,
  unGetSelectData,
  removeUndefinedAndNullNestedObject,
  convertStringToMongoId,
};
