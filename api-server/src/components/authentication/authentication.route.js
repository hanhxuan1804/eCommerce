const express = require("express");
const authenticationController = require("./authentication.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const authenticateRefreshToken = require("../../middlewares/authenticateRefreshToken");
const router = express.Router();

router.get("", (req, res, next) => {
  // #swagger.tags = ['Authentication']
  // #swagger.description = 'Endpoint for authentication'
  return res.status(200).json({
    message: "Authentication",
  });
});
router.post("/signup", asyncHandler(authenticationController.signUp)
  /*
   #swagger.security = [
        {
            "apiKeyAuth": []
        }
    ]
   #swagger.summary = "Sign up"
   #swagger.description = "Endpoint to sign up"
   #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: {
                    $ref: '#/components/schemas/UserSignUp'
                }
            }
        }
    }
    #swagger.responses[201] = {
         description: 'Response when user created successfully',
            schema: {
                message: 'User created successfully',
                code: '201xxx',
                metadata: {
                    $ref: '#/components/schemas/AuthResponse'
                }
            }
    }
  */
);
router.post("/signin", asyncHandler(authenticationController.signIn));

router.use(authenticateRefreshToken);
router.get("/refresh", asyncHandler(authenticationController.refreshToken));
router.post("/signout", asyncHandler(authenticationController.signOut));

module.exports = router;
