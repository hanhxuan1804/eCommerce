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
    try {
      console.log(`[P]::refreshToken::`, req.body);
      const data = await AuthenticationService.refreshToken(req.body);
      return res.status(data.status).json(data.res);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new AuthenticationController();
