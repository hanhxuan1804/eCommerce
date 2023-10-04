const { Apikeys } = require("../../dbs/models");
const crypto = require("node:crypto");

class ApiKeyService {
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
