const Users = require("../dbs/models/user.model");
const Keys = require("../dbs/models/keytoken.model");
const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");

const loadPublicKey = (userId) => {
  return new Promise((resolve, reject) => {
    Keys.findOne({ user: userId }, (err, key) => {
      if (err) {
        reject(err);
      }
      if (key) {
        resolve(key.publicKey);
      } else {
        resolve(null);
      }
    });
  });
};

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKeyProvider: async (req, rawJwtToken, done) => {
    try {
      const publicKey = await loadPublicKey(rawJwtToken._id);
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
