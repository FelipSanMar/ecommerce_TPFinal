const express = require("express");
const { generateProducts } = require( "../utils/generateProds.utils.js");
const router = express.Router(); 

router.get("/", (req, res) => {
    
    res.send(generateProducts(100));
})

module.exports = router;