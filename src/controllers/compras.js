const Usuarios = require('../models/user');
const Compras = require("../models/compra");
const {mailCompra} = require("../helpers/mails");

const getCompras = async(req, res) => {
    const allCompras = await Compras.find();

    res.json(allCompras);
};
const getComprasUser = async(req, res) => {
    const compras = await Compras.find();

    const userID = req.params._id;
    const filter = compras.filter(e => e.user === userID);

    res.json(filter);
};
const getComprasUserByName = async(req, res) => {
    const {name} = req.params; 
    const compras = await Compras.find();
    
    const filter = compras.filter(e => e.user_name === name);

    res.json(filter);
};
const getVentasPorDia = async(req, res) => {
   const {fecha} = req.params;
   //console.log("diaFront:", fecha);//OK   2022-12-12
   //de string a array
   let fechaArray = fecha.split("-"); //esto devuelve--> diaArray: [ '2022', '12', '12' ]
   //console.log("diaArray:", fechaArray);
   let año = fechaArray[0]; //console.log("año:", año);
   let mes = fechaArray[1]; //console.log("mes:", mes);
   let dia = fechaArray[2]; //console.log("dia:", dia);
   let newFecha = dia+"/"+mes+"/"+año;
   //console.log("newFecha:", newFecha);
   //me traigo ventas
   const allVenta = await Compras.find(); //"fecha_compra": "16/12/2022"
   //console.log("allVenta:", allVenta);

   const ventasProFecha = allVenta.filter(v => v.fecha_compra === newFecha);

   //if(!ventasProFecha[0]){return res.json({msj: "no hay ventas"})}

   res.json(ventasProFecha);
   
};
const getVentasPorMes = async(req, res) => {
    //la data llega así -->2022-12
    const {mes} = req.params;
    //de string a Array --> la data q viene del front
    const fechaArray = mes.split("-");
    let año = fechaArray[0];
    let meses = fechaArray[1];

    //de str a arr --> la q viene de la DB
    const allVentas = await Compras.find();
    const allVntsMes = allVentas.filter(v => {
        let fechaDB = v.fecha_compra.split("/"); //paso a array
        let mesDB = fechaDB[1];
        let añoDB = fechaDB[2];
        if(mesDB === meses && añoDB === año){
            return v;
        }
    });

    //if(!allVntsMes[0]){return res.json({msj: "no hay vntas para dicho mes!!"})}
    res.json(allVntsMes);
};
const getCompraDetalle = async(req, res) => {
    const {_id} = req.params;

    const compra = await Compras.findById({_id});
    if(!compra) {res.send("No existe")}

    res.json(compra);
};
const postCompraStatus = async(req, res) => {
    const { payment_id, status, cart, idU, nameU, fechaC } = req.body;

    const data = {
      payment_id,
      status,
      cart,      
      user: idU,//user: req.user._id
      user_name: nameU,
      fecha_compra: fechaC
    };
  
    const compra = new Compras(data);
  
    await compra.save();
  
    res.status(201).json(compra._id);//retorno id de compra
};
const actualizaCompraStatus = async(req, res) => {
    const {_id} = req.params;
    const { payment_id, status } = req.body;

    const actualizoC = await Compras.findByIdAndUpdate(_id, {payment_id, status});
  
    res.json(actualizoC);
};
//envia mail al realizar compra
const enviaMail = async(req, res) => {
    const {_id} = req.params;
 
    //tengo q buscar el user por ID -> para pasarle el email a purchaseEmail
    const userEmail = await Usuarios.findById(_id);

    mailCompra(userEmail.email);

    res.json({msg:'Mail enviado correctamente.'})
};
//elimnina compras sin abonar; en (status:"pending" y "rejected") es para limpiar la tabla compras
//y cada vez q un user llega a pagar, pero se arrepiente y cierra la pagina o vuelve para atrás
//NO se llene la tabla compras de compras pending
const elimCompra = async(req, res) => {
    const filtraPending = await Usuarios.deleteMany({status: 'pending'});
    const filtraRejected = await Usuarios.deleteMany({status: 'rejected'});
    res.send("Compras filtradas");
};
//vacia tabla compras PARA el desarrollador/por postman
const vaciaTablaCompras = async(req,res) => {
    const vaciaTabla = await Compras.deleteMany();
    res.json(tablaCompras);
};

module.exports = {
    postCompraStatus,
    getCompras,
    getCompraDetalle,
    getComprasUser,
    getComprasUserByName,
    getVentasPorDia,
    getVentasPorMes,
    actualizaCompraStatus,
    enviaMail,
    vaciaTablaCompras,
    elimCompra,
  }