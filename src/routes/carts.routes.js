//carts.routes.js

const express = require("express");
const router = express.Router();
const CartManager = require("../controllers/CartManager.js");


const cartManager = new CartManager();

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

    const cartId = req.params.cid;

    try {

        const cart = await cartManager.getProductsPopulation(cartId);
      //  const cart = await cartManager.getProductsByIdCart(cartId);
      console.log(cart.products);

       if(cart){

       return res.json(cart.products);

       }else{
        
        res.status(404).send({ error: "Cart not found" });
       }

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

//Elimina del carrito el producto selecionado 
router.delete("/:cid/products/:pid", async (req, res) => {

    cartID = req.params.cid;
    productID = req.params.pid;

    try {

        const cart = await cartManager.deleteProductsByCart(cartID, productID);

        if (cart) {
            res.status(200).send({ message: "Product operation successful", cart });
        } else {
            res.status(404).send({ error: "Cart or product not found" });
        }

    } catch (error) {
        console.log("Error deleting product from cart", error);
        res.status(500).json({ error: "Internal Server Error" });
    }

})

//Actualiza el carrito con un arreglo de productos con el formato especificado arriba
router.put("/:cid", async (req, res) => {

    const cartId = req.params.cid;
    const newProducts = req.body.products;

    try {

        // Llamar al método en CartManager para actualizar el carrito
        const updatedCart = await cartManager.updateCartProducts(cartId, newProducts);

        if (updatedCart) {

            res.status(200).send({ message: "Cart updated successfully", cart: updatedCart });

        } else {

            res.status(404).send({ error: "Cart not found" });
        }
    } catch (error) {
        console.log("Error updating cart", error);
        res.status(500).json({ error: "Internal Server Error" });
    }

})

//Actualiza solo la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body
router.put("/:cid/products/:pid", async (req, res) => {

    const cartId = req.params.cid;
    const productId = req.params.pid;
    const newQuantity = req.body.quantity;

    try {

        const updatedCart = await cartManager.updateCartProductsQuantity(cartId, productId, newQuantity);

        if (updatedCart) {

            res.status(200).send({ message: "Product quantity updated successfully", cart: updatedCart });

        } else {

            res.status(404).send({ error: "Cart or product not found" });
        }
    } catch (error) {

        console.log("Error updating product quantity in cart", error);
        res.status(500).json({ error: "Internal Server Error" });
    }

})

//Elimina todos los productos del carro
router.delete("/:cid", async (req, res) => {

    const cartId = req.params.cid;

    try {

        const updateCart = await cartManager.deleteAllProductsFromCart(cartId);

        if (updateCart) {
            res.status(200).send({ message: "All products removed from cart", cart: updateCart });
        } else {
            res.status(404).send({ error: "Cart not found" });
        }

    } catch (error) {
        console.log("Error deleting products in cart", error);
        res.status(500).json({ error: "Internal Server Error" });
    }


});

module.exports = router;

