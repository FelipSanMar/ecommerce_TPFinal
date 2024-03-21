//carts.routes.js

const express = require("express");
const router = express.Router();
const CartManager = require("../controllers/CartManager.js");
// Define tus rutas y lógica para el manejo de solicitudes en este archivo

const cartManager = new CartManager("./src/models/carts.json");

//Agregar nuevo carrito

router.post("/", (req, res) => {

    const newCart = cartManager.addCart();
    if (newCart) {
        res.json(newCart);
    } else res.status(500).json({ error: "Server Error" });
})

//Listar productos pertenecientes al carrito 

router.get("/:cid", (req, res) => {

    const cid = parseInt(req.params.cid);

    const cart = cartManager.getProductsByIdCart(cid);
    if (cart) {
        res.json(cart.products);
    } else res.status(404).json({ error: "Cart not found " });


})

router.post("/:cid/product/:pid", (req, res) => {

    const quantity = req.body.quantity || 1; //Si no hay quantity agregame un uno 


    const carro = cartManager.addProductsByCart(parseInt(req.params.cid), parseInt(req.params.pid), parseInt(quantity));

    if (carro) {
        res.json(carro);
    } else res.status(404).json({ error: "Cart not found " });
})

module.exports = router; // Asegúrate de exportar el router en lugar de un objeto directamente
