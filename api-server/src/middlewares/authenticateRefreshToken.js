const {
  NotFoundResponeError,
} = require("../core/error.response");

const authenticateRefreshToken = async (req, res, next) => {
  const refreshToken = req.headers["x-refresh-token"];
  const userId = req.headers["x-client-id"];
  if (!refreshToken) {
    throw new NotFoundResponeError("Refresh token not found !");
  }
  if (!userId) {
    throw new NotFoundResponeError("User id not found !");
  }

  const keyStore = await Keys.findOne({ user: userId }).lean();
  if (!keyStore) {
    throw new NotFoundResponeError("Key store not found !");
  }
  req.keyStore = keyStore;
  req.refreshToken = refreshToken;
  req.userId = userId;
  next();
};

module.exports = authenticateRefreshToken;
