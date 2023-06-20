const { Router } = require('express');
const {
    login, validaCuenta, loginGoogle, 
} = require('../controllers/auth');

//----------------------------------------------------google login 2
const { OAuth2Client } = require('google-auth-library');
//----------------------------------------------------


const router = Router();

//--login clasico--------------------------------
router.post("/login", login);

//--log Google----------------------------------
router.post("/loginGoogle", loginGoogle);

router.get('/validaCuenta/:token', validaCuenta);


module.exports = router;

