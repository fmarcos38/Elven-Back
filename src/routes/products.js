const router = require('express').Router();
const Products = require('../models/product');
const {
   getProd, getByName, getProdByID, elimProd,
} = require('../controllers/products');
const cloudinary = require("../helpers/cloudinary");
const upload = require("../helpers/multer");


//muestra Productos
router.get('/', getProd);

//busca por nombre
router.get('/getByName/:name', getByName);

//busca por id
router.get('/modifProd/:_id', getProdByID);

//elim prod
router.delete('/elimProd/:_id', elimProd);

module.exports = router;