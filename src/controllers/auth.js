const Users = require('../models/user');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

const login = async(req, res) => {
    
   try {
    
    //busco user (tiene q existir para pooder log)
    const user = await Users.findOne({email: req.body.email});
    if(!user){ return res.status(401).json({message: "No existe user c/ese email!"})}
    else{
        //si exist, desencripto pass q viene de la DB
        const hashedPassword = CryptoJS.AES.decrypt( user.password, process.env.PASS_SEC );
        //paso a string la pass antes desncrip
        const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
        //comparo la q viene de la DB con la del front
        //console.log("pass:", hashedPassword)
        if(OriginalPassword !== req.body.password){
            return res.status(401).json({message:"Contraseña incorrecta!"});
        }

        //si el user es correcto CREO el JWT, para mayor seguridad de mi aplicacion, q se asocia con el email del user
        const token = jwt.sign({ email: user.email }, process.env.JWT_SEC);

        res.json({//res --> del login -->esta info esta alojada en -->user._doc CORROBORAR
            user,
            token,
          });
    }

   } catch (error) {
    console.log(error);
   }
};

const loginGoogle = async(req, res) => {
    //console.log("dataFront: ", req.body);
    try {
        const { email, name } = req.body;//me traigo del front el id_token 
        //busco user
        const user = await Users.findOne({email: req.body.email});
        
        //si no exist el user LO creo
        if(!user){
            const data = {
                email, 
                password: "/._./",
                name, 
                tel: 123456,
                address: "nn",
            };

            newUser = new Users(data);
            await newUser.save();
        }
    
        //si es user bloqueado
        if(user.bloqueado == true){
            res.json({msg: "user bloqueado"});
        }

        //CREO el JWT, para mayor seguridad de mi aplicacion, q se asocia con el email del user
        const token = jwt.sign({ email: user.email }, process.env.JWT_SEC);

        console.log("userData: ", user);
        console.log("userToken: ", token);
        res.json({//res --> del login -->esta info esta alojada en -->user._doc CORROBORAR
            user,
            token,
        });
    
    } 
    catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
};

const validaCuenta = async(req, res) => {
    const {token} = req.params;
    //let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZtYXJjb3NfMjNAaG90bWFpbC5jb20iLCJpYXQiOjE2NjgwODA2NjJ9.NRWfmNPrTGMf7IQ52tp0nrOQMkYvsHofdnrt4zApP_c"
    //console.log("tokenVC:", token);
    let email = "";

    //verif token    
    const respJWT = jwt.verify(token, process.env.JWT_SEC);//obtengo el email del user
    //respJWT: { email: 'fmarcos_23@hotmail.com', iat: 1668080662 }
    email = respJWT.email;    

    //actualizo propiedad verificado en la base de datos para dicho user
    //console.log("idU:", _id);
    const user = await Users.findOne({email: email});
    if(!user){ res.json({msg: "user not found"})}
    user.verified = true;
    await user.save();

    res.json(user);
};

module.exports = {
    login,
    loginGoogle,
    validaCuenta
}
