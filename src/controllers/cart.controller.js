const CartModel = require("../models/carts.model.js");
const TicketModel = require("../models/ticket.model.js");
const ProductModel = require("../models/products.model.js");
const UserModel = require("../models/user.model.js");
const { cartService, productService } = require("../services/index.js")
//const cartService = require("../services/index.js");
const { generateUniqueCode, calcularTotal } = require("../utils/carts.utils.js");


class CartController {

    async newCart(req, res) {
        try {

            const newCart = await cartService.addCart();
            res.json(newCart);

        } catch (error) {

            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async getProductsByIdCart(req, res) {
        const cartId = req.params.cid;

        try {

            const cart = await cartService.getProductsPopulation(cartId);

            if (cart) {

                return res.json(cart.products);

            } else {

                res.status(404).send({ error: "Cart not found" });
            }

        } catch (error) {

            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async addProductsByCart(req, res) {

        const quantity = req.body.quantity || 1; //Si no hay quantity agregame un uno 
        const productId = req.params.pid;

        try {

            // Buscar el producto para verificar el propietario
            const producto = await productService.getProductByid(productId);

            if (!producto) {
                return res.status(404).send({ message: "Product not found" });

            }

            // Verificar si el usuario es premium y si es propietario del producto
            // if (req.user.role === 'premium' && producto.owner === req.user.email) {
            //     return res.status(403).json({ message: 'No puedes agregar tu propio producto al carrito.' });
            // }
            const carro = await cartService.addProductsByCart(req.params.cid, req.params.pid, quantity);

            //res.json(carro);
            res.json({ success: true, carro });

        } catch (error) {
            console.error('Error en addProductsByCart:', error);
            res.status(500).json({ error: "Internal Server Error" });
        }

    }

    async deleteProductsByCart(req, res) {

        const cartID = req.params.cid;
        const productID = req.params.pid;

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

    async updateCartProducts(req, res) {

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


    async updateCartProductsQuantity(req, res) {

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


    async deleteAllProductsFromCart(req, res) {
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



    async checkOut(req, res) {
        const cartId = req.params.cid;
        try {
            // Obtener el carrito y sus productos
            const cart = await cartService.getProductsByIdCart(cartId);
            const products = cart.products;

            // Inicializar un arreglo para almacenar los productos no disponibles
            const productosNoDisponibles = [];

            // Verificar el stock y actualizar los productos disponibles
            for (const item of products) {
                const productId = item.product;
                const product = await productService.getProductByid(productId);
                if (product.stock >= item.quantity) {
                    // Si hay suficiente stock, restar la cantidad del producto
                    product.stock -= item.quantity;
                    await product.save();
                } else {
                    // Si no hay suficiente stock, agregar el ID del producto al arreglo de no disponibles
                    productosNoDisponibles.push(productId);
                }
            }

            const userWithCart = await UserModel.findOne({ cart: cartId });

            // Crear un ticket con los datos de la compra
            const ticket = new TicketModel({
                code: generateUniqueCode(),
                purchase_datetime: new Date(),
                amount: calcularTotal(cart.products),
                purchaser: userWithCart._id
            });
            await ticket.save();
            console.log("TICKET:" + ticket);

            // Eliminar del carrito los productos que sí se compraron
            cart.products = cart.products.filter(item => productosNoDisponibles.some(productId => productId.equals(item.product)));

            // Guardar el carrito actualizado en la base de datos
            await cart.save();

            res.status(200).json({ productosNoDisponibles });
        } catch (error) {
            console.error('Error al procesar la compra:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }


}

module.exports = CartController;