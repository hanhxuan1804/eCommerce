const AuthenticationService = require("./authentication.service");

class AuthenticationController {
  signUp = async (req, res, next) => {
    try {
      console.log(`[P]::signUp::`, req.body);
      const data = await AuthenticationService.signUp(req.body);
      return res.status(data.status).json(data.res);
    } catch (error) {
      next(error);
    }
  };

  signIn = async (req, res, next) => {
    try {
      console.log(`[P]::signIn::`, req.body);
      const data = await AuthenticationService.signIn(req.body);
      return res.status(data.status).json(data.res);
    } catch (error) {
      next(error);
    }
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
