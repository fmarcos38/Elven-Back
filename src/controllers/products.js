const Products = require('../models/product');


//trae prods
const getProd = async(req, res) => {
    try {
        const totProds = await Products.find();
        res.json(totProds);
    } catch (error) {
        console.log(error);
    }
};
//trae por nombre
const getByName = async(req, res) => {
    try {
        const {name} = req.params;

        const buscaP = await Products.find({name: name});

        res.json(buscaP);
    } catch (error) {
        console.log(error);
    }
    
};
//trae por id
const getProdByID = async(req, res) => {
    try {
        const {_id} = req.params;

        const prod = await Products.findById(_id);

        res.json(prod);
    } catch (error) {
        console.log(error);
    }
    
};
const elimProd = async(req,res) => {

    try {
        const{_id} = req.params;

        const prodElim = await Products.findByIdAndDelete(_id);

        res.json(prodElim);
    } catch (error) {
        console.log(error);
    }
    
};

module.exports = {
    getProd,
    getByName,
    getProdByID,
    elimProd,
}
