const Users = require('../models/user');
const Productos = require('../models/product');
const CryptoJS = require('crypto-js');
const {sendConfirmationEmail} = require('../helpers/mails');
const jwt = require('jsonwebtoken');
const axios = require('axios');


//--registra clasico--y a su vez crea token
const registrarse = async(req, res) => {
    const { name, email, password, tel } = req.body;

    try {
        //busco q no existe ese email
        existeEmail = await Users.findOne({email});
        if(existeEmail){ res.status(409).send("YA existe usuario con ese email")}
        else{
            //SINO existe
            //cifro pass
            passwordEncript = CryptoJS.AES.encrypt( password, process.env.PASS_SEC ).toString();

            //creo user
            const newUser = await Users.create({name, email, tel, password: passwordEncript});
            await newUser.save();
            //si el user es correcto CREO el JWT, para mayor seguridad de mi aplicacion, q se asocia con el email del user
            const token = jwt.sign({ email: email }, process.env.JWT_SEC);

            //mando mail de confirm
            sendConfirmationEmail(newUser,token);

            res.status(200).json({
                newUser,
                token
            });
        }
        
    } catch (error) {
        console.log(error);
    }
};
//--trae users--------
const getUsers = async(req, res) => {
    try {
        const users = await Users.find();

        res.json(users);
    } catch (error) {
        console.log(error);
    }
};
//--elimina users(solo por postman)
const eliminaUsers = async(req, res) => {
    try {
        const elim = await Users.deleteMany();
        res.send("Users Borrados");
    } catch (error) {
        console.log((error));
    }
}
const getUserById = async(req,res)=>{
    try {
        const {_id} = req.params;

        const user  = await Users.findById(_id);

        res.json(user);
    } catch (error) {
        console.log(error);
    }
}
const deleteUserById = async(req, res)=>{
    try {
        const {_id}=req.params;
        
        const user = await Users.findByIdAndDelete(_id);

        res.json(user);
    } catch (error) {
        console.log(error);
    }
}
const modifName = async(req,res) =>{
    try {
        const {_id} = req.params;
        const {name} = req.body;

        const user = await Users.findByIdAndUpdate({_id:_id},{
            name: name,
        });
        user.save();

        res.json(user);
    } catch (error) {
        console.log(error);
    }

};
const modifPass = async(req,res) =>{
    try {
        const {_id} = req.params;
        const {password} = req.body;
    
        //cifrar pass
        passwordEncript = CryptoJS.AES.encrypt(
            password,
            process.env.PASS_SEC
        ).toString();

        const user = await Users.findByIdAndUpdate({_id:_id},{
            password: passwordEncript,
        });
        user.save();
    
        res.json(user);
    } catch (error) {
        console.log(error);
    }

};
const modifRole = async(req, res) => {
   try {
        const {_id} = req.params;

        const user = await Users.findByIdAndUpdate({_id:_id}, {role: 'admin'});
        user.save();

        res.json(user);
   } catch (error) {
        console.log(error);
   }
};
//------------FAVS----------------------------
const addFav = async(req, res) => {
    const {idP, imagenP, nameP, precioPG, precioPCH, description, idU} = req.body;
    //console.log("id_user:", idU)
    //console.log("req.body:", req.body);
    try {
        //busco el user y su array de fav
        let user = await Users.findById({_id:idU});
        if(user){
            let buscoProd = user.favorites.find(p => p._id === idP);
            if(buscoProd) { return res.json({msg: "ya existe dicho prod en Fav"})}
        }
        //agrego prod a fav
        await user.favorites.push({
            _id: idP,
            imagen: imagenP, 
            name: nameP, 
            precioP: precioPG,
            priceCH: precioPCH,
            description: description

        });
        //guardo en la DB
        await user.save();

        res.status(201).json(user);
    } catch (error) {
        console.log(error);
    }
}; 
const deleteFavs = async(req, res) => {
    try {
        const {idP,idU} = req.body;
        //busco el user y su array de fav
        let user = await Users.findById({_id:idU});
        //almaceno array fav en var aux; filtro
        let newFav = await user.favorites;
        user.favorites = newFav.filter(p => p._id !== idP);

        user.save();//guardo el nuevo array favoritos
        res.json(user);
    } catch (error) {
        console.log(error);
    }
}; 
const getFav = async(req, res) => {
    try {
        const {_id} = req.params;
        //console.log('idU:', _id)
    
        const user = await Users.findById({_id});

        res.json(user.favorites);//mando al front Solo el array de fav
    } catch (error) {
        console.log(error);
    }
};

//---carrito---------------------------------
const postCart = async(req, res) => {
    const{idP, quantity, idU, price} = req.body;

    //--busco user
    const user = await Users.findById({_id: idU});
    if(!user){return res.json({msj: "no hay user"})}
    else{
        //busco producto
        const prod = await Productos.findById({_id: idP});
        //creo el obj producto q va a ir dentro del array carrito
        user.cart.push({
            idP: prod._id,
            name: prod.name,
            description: prod.description, 
            price: price,
            imagen: prod.imagen,
            cloudinary_id: prod.cloudinary_id,
            category: prod.category,
            discount: prod.discount,
            quantity: quantity
        });
        user.save();

        return res.json(user);
    }
    
};
//--getCart-----------------------------
const getCart = async(req, res) =>{
    try {
        const {id} = req.params;
        const user = await Users.findById(id);
        //console.log("user:", user)
        const userCart = user.cart;

        //if(!userCart[0]){ res.send("No hay articulos en el carrito")}

        res.json(userCart);
    } catch (error) {
        console.log(error);
    }
};
//--elim un prod del carrito
const deleteToCart = async(req, res) =>{
    
        const {name,idU} = req.body;
        //busco el user y su array de fav
        let user = await Users.findById({_id:idU});
    
        let newCarrito = await user.cart;
        user.cart = await newCarrito.filter(p => p.name !== name);
    
        await user.save();

        res.json(user.cart);
    
    
};
//--elim carrito una vez pago/
const deleteCarrito = async(req, res) => {
    try {
        const {_id} = req.params; 
        const user = await Users.findOneAndUpdate({_id: _id}, {cart: []});
        await user.save();

        res.json(user);
    } catch (error) {
        console.log(error);
    }
};

//------------------MERCADOPAGO-------------------------------------------------
const paymentMP = async (req, res) => {
    const url = "https://api.mercadopago.com/checkout/preferences";
    const body = req.body;
    const payment = await axios.post(url, body, {      
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
      },
    });
  
    res.send({ url: payment.data.init_point });
};

module.exports = {
    registrarse,
    getUsers,
    eliminaUsers,
    getUserById,
    deleteUserById,
    modifName,    
    modifPass,
    modifRole,
    addFav, 
    deleteFavs, 
    getFav,
    postCart,
    getCart,
    deleteToCart,
    deleteCarrito,
    paymentMP
}

/* RESP REGISTRO CLASICO

{
    "newUser": {
        "role": "cliente",
        "favorites": [],
        "cart": [],
        "verified": false,
        "_id": "636cf2b1fe9ae14f54f77ab5",
        "name": "Nora",
        "email": "nora@hotmail.com",
        "tel": 1256,
        "password": "U2FsdGVkX1+ifvilDoRrBZFSV31ZxcyO7M8lSo7ayoo=",
        "__v": 0
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5vcmFAaG90bWFpbC5jb20iLCJpYXQiOjE2NjgwODQ0MDF9._tFM41iTLLufMTkNqqjf85K7-sM2YwK5rUqNhy0JSiU"
}

*/