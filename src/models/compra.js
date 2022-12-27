const { Schema, model } = require("mongoose");

const CompraSchema = Schema({
  status: {
    type: String,
    enum: ["approved", "pending", "rejected"],
    default:"pending"
  },
  cart: {
    type: Array,
    default: [],
  },
  user: { type: String, require: true },
  user_name: { type: String, require: true },
  fecha_compra: { type: String},
  payment_id:{
    type: String,
    require: true,
    default:"pending"
  }
});

module.exports = model("Compra", CompraSchema);
//agregar user_id, user_name, fecha_compra