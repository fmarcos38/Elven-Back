const { Router } = require('express');
const { 
    registrarse, getUsers, eliminaUsers, addFav, deleteFavs, getFav, postCart, deleteToCart, deleteCarrito,
    getCart, paymentMP, modifName, modifPass, getUserById, deleteUserById, modifRole, 
} = require('../controllers/users');


const router = Router();


//rutas para usuario/cliente---------------------------------------
//--registrarse clasico-----------------
router.post('/registrarse', registrarse);

router.put("/actualizaName/:_id", modifName);

router.put("/actualizaPass/:_id", modifPass);

//--rutas Admin----------------------------------------------------
//--trae users
router.get('/', getUsers);
//--trae user por id
router.get("/:_id"/* , isAdmin */, getUserById);
//--elimina todos los users(solo por postman-->para el desarrollador)
router.delete('/eliminaUsers', eliminaUsers);
//--elim user by id---------
router.delete('/deleteUser/:_id', deleteUserById);
//--modif role--
router.put('/modifRole/:_id', modifRole);

//--RUTAS PARA FAVORITOS-------------------------------------------
//--agrega a FAVORITOS------
router.post('/favs', /* validaToken, */ addFav);
//--elimin prod de fav------
router.post('/delete/favs', /* validaToken, */ deleteFavs);
//trae fav----
router.get('/favorites/:_id', getFav);



//---rutas carrito-------------------------------------------------
//-agrega prod al carrito
router.post('/cart', postCart);
//--trae carrito-----------------------------------
router.get('/cart/:id', getCart);
//--elim un prod del carrito-----
router.post('/deleteProd/cart', /* validaToken, */deleteToCart);
//--elim carrrito una vez pagado
router.delete("/deleteCarrito/:_id", deleteCarrito);

//--RUTAS PARA MERCADOPAGO-----------------------------------------
//---pago MP---------
router.post('/payment', paymentMP);

module.exports = router;