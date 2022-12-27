const Address = require("../models/address");

const getUserAddress = async (req, res ) => {
  
  const {email} = req.body;

  const address = await Address.find();  
  
  const filterAddress = address.filter(d => d.email === email);

  res.status(201).json(filterAddress);
};

const createAddress = async (req, res ) => {
  const {  address, notes, email } = req.body;
  //console.log("dataF:", req.body)
  const data = {  
    email,  
    address,  
    notes,
    state: true,
  };

  const newAddress = new Address(data);

  await newAddress.save();

  res.status(201).json( newAddress );
};

const updateAddress = async (req, res = response) => {

  const {id} = req.params; console.log("id:", id)
  const { address, notes} = req.body;

  const filter = await Address.findByIdAndUpdate(
    {_id: id},
    { address, notes },    
  );

  res.status(201).json(filter);
};

const getAddress = async (req, res) => {

  const allAddress = await Address.find();

  res.json(allAddress);
};


module.exports = {
  createAddress,
  getUserAddress,
  getAddress,
  updateAddress,
};
