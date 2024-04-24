
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

    async getProductsByIdCart(cid) {

        try {

            const cart = await CartModel.findById(cid);

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

}

//const carros = new CartManager();


module.exports = CartManager;