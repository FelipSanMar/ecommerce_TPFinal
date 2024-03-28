const express = require("express");
const router = express.Router(); 

const ProductManager = require("../controllers/ProductManager.js");
const productManager = new ProductManager("./src/models/products.json");
/*
router.get("/",  async (req, res) => {
    try {
        const productos = await productManager.getProducts();
        res.render("home", {productos:productos});
    } catch (error) {
        res.status(500).json({error: "Error interno del servidor"})
    }
})
*/

router.get("/realtimeproducts",  (req, res) => {
    res.render("realtimeproducts");
})

module.exports = router; 