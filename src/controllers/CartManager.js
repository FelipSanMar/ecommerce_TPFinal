
const CartModel = require("../models/carts.model.js");


class CartManager {



    async addCart() {

        try {

            const newCart = new CartModel({ products: [] });
            await newCart.save();

            return newCart;

        } catch (error) {

            console.log("Error when creating the cart");
            throw error;
        }
    }

    async getProductsByIdCart(cartId) {

        try {

            const cart = await CartModel.findById(cartId);

            //     const cart = CartModel.findOne({_id: cartId}).lean().populate("products._id");

            if (cart) {

                return cart;

            } else {

                console.log("Product no found");
                return null;
            }
        } catch (error) {

            console.log("Error getting a cart by ID", error);
            throw error;
        }
    }

    async addProductsByCart(cartId, productId, quantity = 1) {

        try {
            const cart = await this.getProductsByIdCart(cartId);

            const existProduct = cart.products.find(item => item.product.toString() === productId);
            if (cart) {
                if (existProduct) {
                    existProduct.quantity += quantity;
                } else {
                    cart.products.push({ product: productId, quantity });
                }

                //Se marca la propiedad "products" como modificada
                cart.markModified("products");

                await cart.save();

                return cart;

            }
        } catch (error) {
            console.log("Error", error);
            throw error;
        }


    }


    async deleteProductsByCart(cartId, productId) {

        try {

            const cart = await this.getProductsByIdCart(cartId);

            if (!cart) {
                console.log("Cart not found");
                return null;
            }

            const productIndex = cart.products.findIndex(item => item.product.toString() === productId);

            if (productIndex === -1) {
                console.log("Product not found in cart");
                return null;
            }

            if (cart.products[productIndex].quantity === 1) {

                //Si hay un producto, lo elimina completamente
                cart.products.splice(productIndex, 1);
                console.log("Product removed from cart");

            } else {
                //Si hay mas de un producto, reduce la cantidad 
                cart.products[productIndex].quantity--;
                console.log("Quantity decremented for product in cart");
            }

            cart.markModified("products");
            await cart.save();

            return cart;

        } catch (error) {
            console.log("Error deleting product from cart", error);
            throw error;
        }


    }

    //Actualiza el carro con los nuevos productos pasados 
    async updateCartProducts(cartId, newProducts) {
        try {
            const cart = await this.getProductsByIdCart(cartId);

            if (!cart) {
                console.log("Cart not found");
                return null;
            }

            // Reemplazar los productos antiguos con los nuevos
            cart.products = newProducts;

            cart.markModified("products");
            await cart.save();

            return cart;
        } catch (error) {
            console.log("Error updating cart products", error);
            throw error;
        }
    }


    async updateCartProductsQuantity(cartId, productId, newQuantity) {
        try {
            const cart = await this.getProductsByIdCart(cartId);

            if (!cart) {
                console.log("Cart not found");
                return null;
            }

            const productIndex = cart.products.findIndex(item => item.product.toString() === productId);

            if (productIndex === -1) {
                console.log("Product not found in cart");
                return null;
            }

            // Actualizar la cantidad del producto en el carrito
            cart.products[productIndex].quantity = newQuantity;

            cart.markModified("products");
            await cart.save();

            return cart;

        } catch (error) {
            console.log("Error updating product quantity in cart", error);
            throw error;
        }
    }

    async deleteAllProductsFromCart(cartId) {
        try {

            const cart = await this.getProductsByIdCart(cartId)

            if (!cart) {
                console.log("Cart not found");
                return null;
            }

            //Eliminar todos los productos dejando un arreglo vacio
            cart.products = [];

            cart.markModified("products");
            await cart.save();

            return cart;

        } catch (error) {
            console.log("Error deleting all products from cart", error);
            throw error;
        }
    }

    async getProductsPopulation(cartId) {
        try {

            const cart = await CartModel.findOne({_id:cartId});
          //  console.log(JSON.stringify(cart,null,'\t'));
            return cart;

        } catch (error) {
            console.log("Error Population", error);
            throw error;
        }


    }

}

//const carros = new CartManager();


module.exports = CartManager;