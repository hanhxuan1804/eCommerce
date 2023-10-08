const { Users, Keys } = require("../dbs/models");
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
  }
};

passport.use(
  new JwtStrategy(opts, async (jwtPayload, done) => {
    try {
      // const currentTimestamp = Math.floor(Date.now() / 1000);
      // if (jwtPayload.iat > currentTimestamp) {
      //   return done(null, false);
      // }
      // if (jwtPayload.exp < currentTimestamp) {
      //   const refreshToken = req.headers[HEADER.REFRESHTOKEN];
      //   if (!refreshToken) {
      //     return done(null, false);
      //   }
      //   const checkToken = await Keys.findOne({ refreshToken }).lean();
      //   if (!checkToken) {
      //     return done(null, false);
      //   }
      //   if(checkToken.refreshTokensUsed.includes(refreshToken)){
      //     //warning refresh token used before user account may be compromised
      //     return done(null, false);
      //   }
      //   const refreshTokenExpired = Math.floor(new Date(checkToken.expiredin).getTime() / 1000);
      //   if (refreshTokenExpired < currentTimestamp) {
      //     return done(null, false);
      //   }
      //   req.keyStore = checkToken;
      //   req.refreshToken = refreshToken;
      // }
      const user = await Users.findById(jwtPayload._id).lean();
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    } catch (error) {
      console.log(error);
      return done(error, false);
    }
  })
);

module.exports = passport;
