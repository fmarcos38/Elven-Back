const { Router } = require('express');
const {
    login, validaCuenta, 
} = require('../controllers/auth');

const router = Router();

//--login clasico--------------------------------
router.get('/validaCuenta/:token', validaCuenta);
router.post("/login", login);

module.exports = router;

