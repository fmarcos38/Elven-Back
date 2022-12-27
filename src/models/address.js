const { Schema, model } = require("mongoose");

const AddressSchema = Schema({
  address: {
    type: String,
    require: true
  },
  email: {
    type: String,    
    require: true,
  },
  notes:{
      type: String,  
  },
  state:{
      type: Boolean,
      default: false,
  }
});

module.exports = model("Address", AddressSchema);
