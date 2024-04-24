//carts.routes.js

const express = require("express");
const router = express.Router();
const CartManager = require("../controllers/CartManager.js");
// Define tus rutas y lógica para el manejo de solicitudes en este archivo

const cartManager = new CartManager("./src/models/carts.json");

//Agregar nuevo carrito

router.post("/", async (req, res) => {

    try {

        const newCart = await cartManager.addCart();
        res.json(newCart);

    } catch (error) {

        res.status(500).json({ error: "Internal Server Error" });
    }
})

//Listar productos pertenecientes al carrito 

router.get("/:cid", async (req, res) => {

    const cid = req.params.cid;

    try {

        const cart = await cartManager.getProductsByIdCart(cid);
        res.json(cart.products);

    } catch (error) {

        res.status(500).json({ error: "Internal Server Error" });
    }

})

router.post("/:cid/product/:pid", async (req, res) => {

    const quantity = req.body.quantity || 1; //Si no hay quantity agregame un uno 

    try {

        const carro = await cartManager.addProductsByCart(req.params.cid, req.params.pid, quantity);

        res.json(carro);

    } catch (error) {

        res.status(500).json({ error: "Internal Server Error" });
    }
})

module.exports = router;

