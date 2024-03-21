
const path = require('path');

class CartManager {

    constructor() {
        this.carts = [];
        this.fs = require("fs");
        this.path = path.join(__dirname, '../models/carts.json');
        this.fileInit();    //Inicializa el archivo 
    }

    //Si el archivo existe lo carga, sino crea uno nuevo
    fileInit() {
        try {
            if (this.fs.existsSync(this.path)) {
                const data = this.fs.readFileSync(this.path, 'utf-8');
                this.carts = JSON.parse(data);
            } else {
                this.fs.writeFileSync(this.path, JSON.stringify([]));
            }
        } catch (error) {
            console.error("Error en la inicialización:", error);
        }
    }

    fileAddCarts() {
        try {
            this.fs.writeFileSync(this.path, JSON.stringify(this.carts, null, 2));
        } catch (error) {
            console.error("Error al añadir Carrito:", error);
        }
    }

    addCart() {

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
        this.fileAddCarts();
        return newCart;
        
    }

    getProductsByIdCart(cid) {
        const cart = this.carts.find((cart) => cart.id === cid);

        if (cart) {
            
            return cart;

        } else {
            console.error("Product no found");
            return null;
        }
    }

    addProductsByCart(cartId, productId, quantity = 1) {
        const cart = this.getProductsByIdCart(cartId);

        const existProduct = cart.products.find(p => p.product === productId);
        if (cart) {
            if (existProduct) {
                existProduct.quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }

            this.fileAddCarts();
            return cart;

        } else return false


    }

}

const carros = new CartManager();


module.exports = CartManager;