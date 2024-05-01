const express = require("express");
const router = express.Router(); 

const ProductManager = require("../controllers/ProductManager.js");
const productManager = new ProductManager("./src/models/products.json");


router.get("/",  (req, res) => {
    res.render("chat");
})

module.exports = router; 