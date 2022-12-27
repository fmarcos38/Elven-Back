const { Router } = require('express');
const { postCat, getCat, getCatById, elimCat, } = require('../controllers/categories');

const router = Router();

//---rutas-----
router.post('/create', postCat);

router.get('/', getCat);

router.get('/getById/:_id', getCatById);

router.delete('/elimCat/:_id', elimCat);

module.exports = router;