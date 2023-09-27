const express = require("express");
const authenticationController = require("./authentication.controller");

const router = express.Router();

router.get('', (req, res, next) =>{
    return res.status(200).json({
        message: 'Authentication'
    })
})
router.post("/signup", authenticationController.signUp);
router.post("/signin", authenticationController.signIn);
router.post("/refresh-token", authenticationController.refreshToken);

module.exports = router;
