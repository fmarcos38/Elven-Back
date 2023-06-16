const { Schema, model } = require('mongoose');

const UserShema = Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    tel: { type: Number },
    address: { type: String }, 
    role: { type: String, default: 'cliente', },/* el otro rol es -->admin */
    favorites:{ type:Array, default:[] },
    cart:{ type:Array, default:[] },
    verified:{ type:Boolean, default:false },
    bloqueado:{ type:Boolean, default:false }
});

module.exports = model("User", UserShema);