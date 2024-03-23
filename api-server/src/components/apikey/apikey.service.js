const { Apikeys } = require("../../dbs/models");
const crypto = require("node:crypto");

class ApiKeyService {
  static generateApiKey = async (permission='0000') => {
    try {
      const key = crypto.randomBytes(16).toString("hex");
      const apikeyObj = await Apikeys.create({ key, permissions: permission});
      return apikeyObj ? apikeyObj : null;
    } catch (error) {
      return error;
    }
  };
  static getApiKey = async (key) => {
    try {
      const apikeyObj = await Apikeys.findOne({ key, status: 1 }).lean();
      return apikeyObj ? apikeyObj : null;
    } catch (error) {
      return error;
    }
  };
}
module.exports = ApiKeyService;
