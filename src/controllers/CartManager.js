
const path = require('path');

class CartManager {

    constructor() {
        this.carts = [];
        this.fs = require("fs").promises;
        this.path = path.join(__dirname, '../models/carts.json');
        this.fileReadCarts();    //Inicializa el archivo 
    }

    //Si el archivo existe lo carga, sino crea uno nuevo
    async fileReadCarts() {
        try {

            const data = await this.fs.readFile(this.path, 'utf-8');
            return this.carts = JSON.parse(data);

        } catch (error) {
            console.error("Initialization Error", error);
            throw error;
        }
    }

    async fileAddCarts() {
        try {
            await this.fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
        } catch (error) {
            console.error("Error when adding cart:", error);
        }
    }

    async addCart() {

        try {
            let lastId = 0;
            if (this.carts.length > 0) {
                lastId = this.carts[this.carts.length - 1].id;
            }

            const newId = lastId + 1;

            const newCart = {
                id: newId,
                products: []
            }

            this.carts.push(newCart);
            await this.fileAddCarts();

            return newCart;

        } catch (error) {

            console.log("Error when creating the cart");
            throw error;
        }
    }

    async getProductsByIdCart(cid) {

        try {

            const cart = this.carts.find((cart) => cart.id === cid);

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

            const existProduct = cart.products.find(p => p.product === productId);
            if (cart) {
                if (existProduct) {
                    existProduct.quantity += quantity;
                } else {
                    cart.products.push({ product: productId, quantity });
                }

                this.fileAddCarts();
                return cart;

            }
        } catch (error) {
            console.log("Error", error);
            throw error;
        }


    }

}

const carros = new CartManager();


module.exports = CartManager;