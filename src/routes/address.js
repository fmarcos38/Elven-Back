const router = require('express').Router();
const {createAddress, getUserAddress, getAddress, updateAddress} = require('../controllers/address');


router.post("/create", createAddress);

router.post("/userAddress", getUserAddress);

//router.get("/", getAddress);

router.put("/modif/:id", updateAddress);


module.exports = router;