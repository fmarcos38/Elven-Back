const { Router } = require('express');
const { 
    postCompraStatus, getCompras, getCompraDetalle, getComprasUser, actualizaCompraStatus, enviaMail,
    vaciaTablaCompras, elimCompra, getComprasUserByName, getVentasPorDia, getVentasPorMes,
} = require('../controllers/compras');

const router = Router();

//---transcribe la compra a la DB----------
router.post("/", postCompraStatus);

//--trae las compras --> todas------------
router.get("/", getCompras);

//--trae compras del user logueado-------
router.get("/comprasUser/:_id", getComprasUser);

//trea compras por nombre user
router.get("/comprasUserByName/:name", getComprasUserByName);

//trea por dia
router.get('/getVentasPorDia/:fecha', getVentasPorDia);

//trae vnts x mes
router.get('/ventasProMes/:mes', getVentasPorMes);

//--detalle de una compra-----------------
router.get("/compraDetalle/:_id", getCompraDetalle);

//--actualiza el status de la compra UNA ves q se imtento pagar CON la resp de MP
router.put("/actualizaStatus/:_id", actualizaCompraStatus);

//--manda email al comprar
router.get('/emailConfirma/:_id', enviaMail);

//--elimina compra sin abonar 
router.delete("/elimCompra", elimCompra);

//vacia tabla compras PARA el desarrollador/por postman
router.delete("/vacia", vaciaTablaCompras);

module.exports = router;
