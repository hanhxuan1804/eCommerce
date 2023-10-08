const { Users } = require("../../dbs/models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("node:crypto");
const KeyTokenService = require("./keytoken.service");
const { appuserroles } = require("../../configs/config");
const { getInfoData } = require("../../utils");
const {
  ConflictResponseError,
  InternalServerError,
  UnauthorizedResponseError,
} = require("../../core/error.response");

class AuthenticationService {
  static signUp = async ({ name, email, password }) => {
    // Step 1: Check if email exists
    const existingUser = await Users.findOne({ email }).lean();
    if (existingUser) {
      throw new ConflictResponseError("Email already exists");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await Users.create({
      name,
      email,
      password: hashPassword,
      roles: [appuserroles["user"]],
    });
    if (newUser) {
      const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: "pkcs1",
          format: "pem",
        },
        privateKeyEncoding: {
          type: "pkcs1",
          format: "pem",
        },
      });
      const accessToken = jwt.sign(
        {
          _id: newUser._id,
          email: newUser.email,
          name: newUser.name, // Include additional user information here
          roles: newUser.roles, // Include any other user-related data
        },
        privateKey,
        {
          algorithm: "RS256",
          expiresIn: "1d",
        }
      );
      const refreshToken = jwt.sign(
        {
          _id: newUser._id,
          email: newUser.email,
          name: newUser.name, // Include additional user information here
          roles: newUser.roles, // Include any other user-related data
        },
        privateKey,
        {
          algorithm: "RS256",
          expiresIn: "7d",
        }
      );
      const publicKeyString = await KeyTokenService.createKeyToken({
        userId: newUser._id,
        publicKey,
        refreshToken,
        expired: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
      if (!publicKeyString) {
        throw new InternalServerError("Error creating keytoken");
      }
      return {
        code: "success",
        metadata: {
          user: getInfoData({
            fields: ["_id", "name", "email", "roles"],
            object: newUser,
          }),
          tokens: {
            accessToken,
            refreshToken,
          },
        },
      };
    }
    throw new InternalServerError("Error creating user");
  };

  static signIn = async ({ email, password, refreshToken = null }) => {
    const user = await Users.findOne({ email }).lean();
    if (!user) {
      throw new UnauthorizedResponseError(
        "The email or password is incorrect!"
      );
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedResponseError(
        "The email or password is incorrect!"
      );
    }
    const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
    });

    const accessToken = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        name: user.name, // Include additional user information here
        roles: user.roles, // Include any other user-related data
      },
      privateKey,
      {
        algorithm: "RS256",
        expiresIn: "1m",
      }
    );
    const newRefreshToken = jwt.sign(
      {
        _id: user._id,
        email: user.email,

        name: user.name, // Include additional user information here
        roles: user.roles, // Include any other user-related data
      },
      privateKey,
      {
        algorithm: "RS256",
        expiresIn: "7d",
      }
    );
    const publicKeyString = await KeyTokenService.createKeyToken({
      userId: user._id,
      publicKey,
      refreshToken: newRefreshToken,
      oldRefreshToken: refreshToken,
      expired: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    if (!publicKeyString) {
      throw new InternalServerError("Error creating keytoken");
    }
    return {
      code: "success",
      metadata: {
        user: getInfoData({
          fields: ["_id", "name", "email", "roles"],
          object: user,
        }),
        tokens: {
          accessToken,
          refreshToken: newRefreshToken,
        },
      },
    };
  };

  static refreshToken = async ({ refreshToken, userId, keyStore }) => {
    if(!userId || !keyStore || !refreshToken){
      throw new UnauthorizedResponseError("Access token still valid");
    }
    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      await KeyTokenService.deleteKeyToken({ userId });
      throw new ForbiddenResponseError(
        "Something went wrong, please login again"
      );
    }
    const user = await Users.findById(userId).lean();
    if (!user) {
      throw new UnauthorizedResponseError("User not recognized");
    }

    if (keyStore.refreshToken !== refreshToken) {
      throw new UnauthorizedResponseError("User not recognized");
    }
    
    const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
    });

    const accessToken = jwt.sign(
      {
        _id: userId,
        email,
        name: user.name, // Include additional user information here
        roles: user.roles, // Include any other user-related data
      },
      privateKey,
      {
        algorithm: "RS256",
        expiresIn: "1m",
      }
    );
    const newRefreshToken = jwt.sign(
      {
        _id: userId,
        email,
        name: user.name, // Include additional user information here
        roles: user.roles, // Include any other user-related data
      },
      privateKey,
      {
        algorithm: "RS256",
        expiresIn: "7d",
      }
    );

    const publicKeyString = await KeyTokenService.createKeyToken({
      userId,
      publicKey,
      refreshToken: newRefreshToken,
      oldRefreshToken: refreshToken,
      expired: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    if (!publicKeyString) {
      throw new InternalServerError("Error creating keytoken");
    }
    return {
      code: "success",
      metadata: {
        user: getInfoData({
          fields: ["_id", "name", "email", "roles"],
          object: user,
        }),
        tokens: {
          accessToken,
          refreshToken: newRefreshToken,
        },
      },
    };
  };

  static signOut = async (userId) => {
    if(!userId){
      throw new UnauthorizedResponseError("User not recognized");
    }
    const isDeleted = await KeyTokenService.deleteKeyToken({ userId });
    if (!isDeleted) {
      throw new InternalServerError("Something went wrong");
    }
    return {
      code: "success",
      metadata: {},
    };
  }
}

module.exports = AuthenticationService;
