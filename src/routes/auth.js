const { Router } = require('express');
const {
    login, validaCuenta, loginGoogle, 
} = require('../controllers/auth');

const router = Router();

//--login clasico--------------------------------
router.post("/login", login);

//--log Google----------------------------------
router.post("/loginGoogle", loginGoogle);

router.get('/validaCuenta/:token', validaCuenta);

module.exports = router;

