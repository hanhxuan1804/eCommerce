const { CreatedResponse, OkResponse } = require("../../core/success.response");
const AuthenticationService = require("./authentication.service");

class AuthenticationController {
  signUp = async (req, res, next) => {
    console.log(`[P]::signUp::`, req.body);
    new CreatedResponse("Sign up successfully !", await AuthenticationService.signUp(req.body)).send(res);
  };

  signIn = async (req, res, next) => {
      console.log(`[P]::signIn::`, req.body);
      new OkResponse("Sign in successfully !", await AuthenticationService.signIn(req.body)).send(res);
  };

  refreshToken = async (req, res, next) => {
      console.log(`[P]::refreshToken::`, req.body);
      new OkResponse("Refresh token successfully !", await AuthenticationService.refreshToken({
        refreshToken: req.refreshToken,
        userId: req.userId,
        keyStore: req.keyStore
      })).send(res);
  };

  signOut = async (req, res, next) => {
      console.log(`[P]::signOut::`, req.body);
      new OkResponse("Sign out successfully !", await AuthenticationService.signOut(req.userId)).send(res);
  };
}

module.exports = new AuthenticationController();
