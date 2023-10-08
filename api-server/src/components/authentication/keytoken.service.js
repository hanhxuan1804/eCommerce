const { InternalServerError } = require("../../core/error.response");
const { Keys } = require("../../dbs/models");
class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    refreshToken,
    oldRefreshToken,
    expired,
  }) => {
    try {
      const filter = { user: userId },
        update = {
          publicKey,
          refreshToken,
          $push: { refreshTokensUsed: oldRefreshToken },
          expiredin: expired,
        },
        options = { upsert: true, new: true, setDefaultsOnInsert: true };
      const tokens = await Keys.findOneAndUpdate(filter, update, options);
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      throw new InternalServerError(error);
    }
  };
  static deleteKeyToken = async ({ userId }) => {
    try {
      const filter = { user: userId };
      const tokens = await Keys.findOneAndDelete(filter);
      return tokens ? true : false;
    } catch (error) {
      throw new InternalServerError(error);
    }
  };
}

module.exports = KeyTokenService;
