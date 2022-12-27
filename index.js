const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

//--importo rutas--------------------------------------------------------
const routeUsers = require('./src/routes/users');
const routerAuth = require('./src/routes/auth');
const routeCategories = require('./src/routes/categories');
const routeProducts = require('./src/routes/products');
const routeCompras = require('./src/routes/compras');
const routeAddress = require('./src/routes/address');
//-----------------------------------------------------------------------

const app = express();
dotenv.config();

//--conexion DB----------------------------------------------------------
mongoose.connect(process.env.MONGO_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
})
.then(() => console.log("mongoDB is connected"))
.catch((err) => console.log(err));
//-----------------------------------------------------------------------

// Middleware--------------------------------
app.use(express.json());
app.use(cors());
//-------------------------------------------

//--invoco rutas con app-------------------------------------------------
app.use('/users', routeUsers);
app.use('/auth', routerAuth);
app.use('/categories', routeCategories);
app.use('/products', routeProducts);
app.use('/compras', routeCompras);
app.use('/address', routeAddress);
//-----------------------------------------------------------------------

//--pongo a escuchar/levanto servidor
app.listen(process.env.PORT || 3001, () => {
    console.log("Backend server is running on port 3001!");
});