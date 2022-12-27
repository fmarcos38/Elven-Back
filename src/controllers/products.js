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


module.exports = {
    getProd,
    //getByName,
    //getProdByID,
    //elimProd,
}
