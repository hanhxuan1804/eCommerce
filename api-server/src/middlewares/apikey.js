const ApiKeyService = require("../components/apikey/apikey.service");
const { ForbiddenResponseError } = require("../core/error.response");
const HEADER = {
  APIKEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
};
const checkApiKey = async (req, res, next) => {
  const key = req.headers[HEADER.APIKEY]?.toString();
  if (!key) {
    throw new ForbiddenResponseError("Forbidden access !");
  }
  const apikeyObj = await ApiKeyService.getApiKey(key);
  if (!apikeyObj) {
    throw new ForbiddenResponseError("Forbidden access !");
  }
  req.apikeyObj = apikeyObj;
  next();
};

const permission = (permission) => {
  return (req, res, next) => {
    if (!req.apikeyObj.permissions) {
      throw new ForbiddenResponseError("Permission denied !");
    }
    const validpermission = req.apikeyObj.permissions.includes(permission);
    if (!validpermission) {
      throw new ForbiddenResponseError("Permission denied !");
    }
    return next();
  };
};
module.exports = {
  checkApiKey,
  permission,
};
