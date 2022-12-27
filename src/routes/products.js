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



module.exports = router;