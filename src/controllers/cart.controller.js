const CartModel = require("../models/carts.model.js");
//const CartRepository = require("../repositories/cart.repository.js");
const ProductModel = require("../models/products.model.js");
const ProductRepository = require("../repositories/product.repository.js")
const cartService = require("../services/index.js");

//const cartRepository = new CartRepository();

class CartController{

    async newCart(req,res){
        try {

            const newCart = await cartService.addCart();
            res.json(newCart);
    
        } catch (error) {
    
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async getProductsByIdCart(req, res){
        const cartId = req.params.cid;

        try {
    
            const cart = await cartService.getProductsPopulation(cartId);
    
           if(cart){
    
           return res.json(cart.products);
    
           }else{
            
            res.status(404).send({ error: "Cart not found" });
           }
    
        } catch (error) {
    
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async addProductsByCart(req, res){

        const quantity = req.body.quantity || 1; //Si no hay quantity agregame un uno 

        try {
    
            const carro = await cartService.addProductsByCart(req.params.cid, req.params.pid, quantity);
    
            res.json(carro);
    
        } catch (error) {
    
            res.status(500).json({ error: "Internal Server Error" });
        }

    }

    async deleteProductsByCart(req, res){

        cartID = req.params.cid;
        productID = req.params.pid;
    
        try {
    
            const cart = await cartService.deleteProductsByCart(cartID, productID);
    
            if (cart) {
                res.status(200).send({ message: "Product operation successful", cart });
            } else {
                res.status(404).send({ error: "Cart or product not found" });
            }
    
        } catch (error) {
            console.log("Error deleting product from cart", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async updateCartProducts(req, res){

        const cartId = req.params.cid;
        const newProducts = req.body.products;
    
        try {
    
            // Llamar al método en CartManager para actualizar el carrito
            const updatedCart = await cartService.updateCartProducts(cartId, newProducts);
    
            if (updatedCart) {
    
                res.status(200).send({ message: "Cart updated successfully", cart: updatedCart });
    
            } else {
    
                res.status(404).send({ error: "Cart not found" });
            }
        } catch (error) {
            console.log("Error updating cart", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }


    async updateCartProductsQuantity(req, res){

        const cartId = req.params.cid;
        const productId = req.params.pid;
        const newQuantity = req.body.quantity;
    
        try {
    
            const updatedCart = await cartService.updateCartProductsQuantity(cartId, productId, newQuantity);
    
            if (updatedCart) {
    
                res.status(200).send({ message: "Product quantity updated successfully", cart: updatedCart });
    
            } else {
    
                res.status(404).send({ error: "Cart or product not found" });
            }
        } catch (error) {
    
            console.log("Error updating product quantity in cart", error);
            res.status(500).json({ error: "Internal Server Error" });
        }

    }


    async deleteAllProductsFromCart(req, res){
        const cartId = req.params.cid;

        try {
    
            const updateCart = await cartService.deleteAllProductsFromCart(cartId);
    
            if (updateCart) {
                res.status(200).send({ message: "All products removed from cart", cart: updateCart });
            } else {
                res.status(404).send({ error: "Cart not found" });
            }
    
        } catch (error) {
            console.log("Error deleting products in cart", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }


}

module.exports = CartController;