const Categorias = require('../models/category');

const postCat = async(req, res) => {
    try {
        const {name} = req.body;

        const newCat = new Categorias({name});

        await newCat.save();

        res.status(201).json( newCat );
    } catch (error) {
        console.log(error);
    }
    
};
const getCat = async(req, res) => {
    try {
        const categories = await Categorias.find();

        res.json(categories);
    } catch (error) {
        console.log(error);
    }
}
const getCatById = async(req, res) => {
    try {
        const {_id} = req.params;

        const cat = await Categorias.findById(_id);

        res.json(cat);
    } catch (error) {
        console.log(error);
    }
};
const elimCat = async(req, res) => {
    try {
        const {_id} = req.params;
    
        const elimCat = await Categorias.findByIdAndDelete({_id: _id});

        res.json(elimCat);
    
    } catch (error) {
         console.log(error);    
    }
}

module.exports = {
    postCat,
    getCat,
    getCatById,
    elimCat
}