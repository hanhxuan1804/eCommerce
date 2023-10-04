const { Keys } = require("../../dbs/models");
class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, refreshToken }) => {
    try {
      const filter = { user: userId },
        update = { publicKey, refreshToken },
        options = { upsert: true, new: true, setDefaultsOnInsert: true };
      const tokens = await Keys.findOneAndUpdate(filter, update, options);
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };
}

module.exports = KeyTokenService;
