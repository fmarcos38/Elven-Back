const router = require('express').Router();
const Products = require('../models/product');
const {
   getProd, getByName, getProdByID, elimProd,
} = require('../controllers/products');
const cloudinary = require("../helpers/cloudinary");
const upload = require("../helpers/multer");


//crea producto
router.post('/create', upload.single("imagen"), async(req, res) => {
    //console.log("req.body:", req.body)
    //console.log("req.file.path:", req.file.path)

    try {
        //Upload image to cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);

        let newProd = new Products({
            name: req.body.name,
            imagen: result.secure_url,
            description: req.body.description,
            cloudinary_id: result.public_id,
            priceG: req.body.priceG,
            category: req.body.category,
            priceCH: req.body.priceCH || 0,
            discount: req.body.discount || 0,
            isPromo: req.body.isPromo
        });
        await newProd.save();
        res.status(200).send("OK");
    } catch (error) {
        console.log(error);
    }
});

//modif prod
router.put('/modifProd/:_id', upload.single("imagen"), async(req, res) => {

    try {
        const {_id} = req.params;        
    
        //busco el prod, para los datos q no vienen dejar los q estan
        const prod = await Products.findById({_id:_id});

    
        // Upload image to cloudinary
        let result;
        //si viene img nueva
        if(req.file){
            //delete cloud img vieja
            await cloudinary.uploader.destroy(prod.cloudinary_id);
            result = await cloudinary.uploader.upload(req.file.path);
        }

        let newProd = {
            name: req.body.name || prod.name,
            imagen: result?.secure_url || prod.imagen,
            description: req.body.description || prod.description,
            cloudinary_id: result?.public_id || prod.cloudinary_id,
            priceG: req.body.priceG || prod.priceG,
            category: req.body.category || prod.category,
            priceCH: req.body.priceCH || prod.priceCH,
            discount: req.body.discount || prod.discount,
            isPromo: req.body.isPromo || prod.isPromo,
        };
        //realizo la modif
        await Products.findByIdAndUpdate({_id:_id}, newProd);

        //busco el prod modificado
        const prodModif = await Products.findById({_id:_id});
        res.json(prodModif);
    } catch (error) {
        console.log(error);
    }
        
});

//muestra Productos
router.get('/', getProd);

//busca por nombre
router.get('/getByName/:name', getByName);

//busca por id
router.get('/getProdByID/:_id', getProdByID);

//elim prod
router.delete('/elimProd/:_id', elimProd);

module.exports = router;