const { Users, Keys } = require("../dbs/models");
const asyncHandler = require("../helpers/asyncHandler");
const crypto = require("node:crypto");
const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const { UnauthorizedResponseError } = require("../core/error.response");
const { Types } = require("mongoose");
const HEADER = require("../configs/config").reqheader;

const loadPublicKey = async (userId) => {
  const key = await Keys.findOne({
    user: new Types.ObjectId(userId),
  }).lean();
  if (!key) {
    throw new UnauthorizedResponseError();
  }
  const publicKeyObj = crypto.createPublicKey(key.publicKey);
  return publicKeyObj;
};

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKeyProvider: async (req, rawToken, done) => {
    try {
      const userId = req.headers[HEADER.CLIENT_ID];
      const publicKey = await loadPublicKey(userId);
      done(null, publicKey);
    } catch (error) {
      done(error);
    }
  },
};
passport.use(
  new JwtStrategy(opts, async (jwtPayload, done) => {
    try {
      const user = await Users.findById(jwtPayload._id).lean();
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  })
);

module.exports = passport;
