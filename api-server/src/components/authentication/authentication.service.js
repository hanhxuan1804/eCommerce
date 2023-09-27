const { Users } = require("../../dbs/models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("node:crypto");
const KeyTokenService = require("./keytoken.service");
const { appuserroles } = require("../../configs/config");
const { getInfoData } = require("../../utils");

class AuthenticationService {
  static signUp = async ({ name, email, password }) => {
    try {
      // Step 1: Check if email exists
      const existingUser = await Users.findOne({ email }).lean();
      if (existingUser) {
        return {
          status: 409, // Conflict
          res: {
            code: "email_exists",
            message: "The email has been used!",
          },
        };
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

        const publicKeyString = await KeyTokenService.createKeyToken({
          userId: newUser._id,
          publicKey,
        });
        if (!publicKeyString) {
          return {
            status: 500,
            res: {
              code: "keytoken_error",
              message: "The keytoken errors",
            },
          };
        }
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
        return {
          status: 201, // Created
          res: {
            code: "success",
            metadata: {
              user: getInfoData({fields: ["_id", "name", "email", "roles"], object: newUser}),
              tokens: {
                accessToken,
                refreshToken,
              },
            },
          },
        };
      }
      return {
        status: 500, // Internal server error
        res: {
          code: "error",
          metadata: null,
        },
      };
    } catch (error) {
      return {
        status: 500, // Internal server error
        res: {
          code: "error",
          message: error.message,
        },
      };
    }
  };

  static signIn = async ({ email, password }) => {
    try {
      const user = await Users.findOne({ email }).lean();
      if (!user) {
        return {
          status: 401, // Unauthorized
          res: {
            code: "user_not_found",
            message: "The email or password is incorrect!",
          },
        };
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return {
          status: 401, // Unauthorized
          res: {
            code: "user_not_found",
            message: "The email or password is incorrect!",
          },
        };
      }
      const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
        moduleLength: 4096,
      });
      const publicKeyString = await KeyTokenService.createKeyToken({
        userId: user._id,
        publicKey,
      });
      if (!publicKeyString) {
        return {
          status: 500,
          res: {
            code: "keytoken_error",
            message: "The keytoken errors",
          },
        };
      }
      const accessToken = jwt.sign(
        {
          _id: user._id,
          email: user.email,
          name: user.name, // Include additional user information here
          roles: user.roles, // Include any other user-related data
        },
        privateKey,
        {
          expiresIn: "1d",
        }
      );
      const refreshToken = jwt.sign(
        {
          _id: user._id,
          email: user.email,

          name: user.name, // Include additional user information here
          roles: user.roles, // Include any other user-related data
        },
        privateKey,
        {
          expiresIn: "7d",
        }
      );
      const resuser = {
        ...user,
        password: undefined,
      };
      return {
        status: 200, // OK
        res: {
          code: "success",
          user: resuser,
          accessToken,
          refreshToken,
        },
      };
    } catch (error) {
      return {
        status: 500, // Internal server error
        res: {
          code: "error",
          message: error.message,
        },
      };
    }
  };

  static refreshToken = async ({ refreshToken }) => {
    try {
      const privateKey = await KeyTokenService.getPrivateKey(refreshToken);
      const decoded = jwt.verify(refreshToken, privateKey);
      const accessToken = jwt.sign(
        {
          _id: decoded._id,
          email: decoded.email,
          name: decoded.name, // Include additional user information here
          roles: decoded.roles, // Include any other user-related data
        },
        privateKey,
        {
          expiresIn: "1d",
        }
      );
      const newRefreshToken = jwt.sign(
        {
          _id: decoded._id,
          email: decoded.email,
          name: decoded.name, // Include additional user information here
          roles: decoded.roles, // Include any other user-related data
        },
        privateKey,
        {
          expiresIn: "7d",
        }
      );
      return {
        status: 200, // OK
        res: {
          code: "success",
          accessToken,
          refreshToken: newRefreshToken,
        },
      };
    } catch (error) {
      return {
        status: 500, // Internal server error
        res: {
          code: "error",
          message: error.message,
        },
      };
    }
  };
}

module.exports = AuthenticationService;
