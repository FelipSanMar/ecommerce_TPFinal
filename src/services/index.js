const CartRepository = require("../repositories/cart.repository.js");
const ProductRepository = require("../repositories/product.repository.js");

const cartService = new CartRepository();
const productService = new ProductRepository();

module.exports = {cartService, productService};