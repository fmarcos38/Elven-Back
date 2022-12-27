const { Schema, model } = require("mongoose");

const ProductSchema = Schema({
    name: {type: String, required: true, unique: true},
    description: { type: String },
    priceG: {type: Number, required: true},
    priceCH: {type: Number },
    imagen: {type: String },
    cloudinary_id: { type: String },
    category: { type: String, require: true },
    discount:{ type: Number,  default: 0 },
    isPromo: {type: Boolean, default: false}
});

module.exports = model("Product", ProductSchema);