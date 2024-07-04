const CartModel = require("../models/carts.model.js");
const { logger } = require("../utils/logger.utils.js");

class CartRepository {
    async addCart() {
        try {
            const newCart = new CartModel({ products: [] });
            await newCart.save();
            logger.info("Cart created successfully");
            return newCart;
        } catch (error) {
            logger.error("Error when creating the cart", error);
            throw error;
        }
    }

    async getProductsByIdCart(cartId) {
        try {
            const cart = await CartModel.findById(cartId);
            if (cart) {
                logger.info("Cart found successfully");
                return cart;
            } else {
                logger.warning("Cart not found");
                return null;
            }
        } catch (error) {
            logger.error("Error getting a cart by ID", error);
            throw error;
        }
    }

    async addProductsByCart(cartId, productId, quantity = 1) {
        try {
            const cart = await this.getProductsByIdCart(cartId);
            if (!cart) {
                throw new Error('Cart not found');
            }
            const existProduct = cart.products.find(item => item.product.toString() === productId);
            if (cart) {
                if (existProduct) {
                    existProduct.quantity += quantity;
                } else {
                    cart.products.push({ product: productId, quantity });
                }

                cart.markModified("products");
                await cart.save();
                logger.info("Product added to cart successfully");
                return cart;
            }
        } catch (error) {
            logger.error('Error adding products to cart:', error);
            throw error;
        }
    }

    async deleteProductsByCart(cartId, productId) {
        try {
            const cart = await this.getProductsByIdCart(cartId);
            if (!cart) {
                logger.warning("Cart not found");
                return null;
            }

            const productIndex = cart.products.findIndex(item => item.product.toString() === productId);
            if (productIndex === -1) {
                logger.warning("Product not found in cart");
                return null;
            }

            if (cart.products[productIndex].quantity === 1) {
                cart.products.splice(productIndex, 1);
                logger.info("Product removed from cart");
            } else {
                cart.products[productIndex].quantity--;
                logger.info("Quantity decremented for product in cart");
            }

            cart.markModified("products");
            await cart.save();
            return cart;
        } catch (error) {
            logger.error("Error deleting product from cart", error);
            throw error;
        }
    }

    async updateCartProducts(cartId, newProducts) {
        try {
            const cart = await this.getProductsByIdCart(cartId);
            if (!cart) {
                logger.warning("Cart not found");
                return null;
            }

            cart.products = newProducts;
            cart.markModified("products");
            await cart.save();
            logger.info("Cart products updated successfully");
            return cart;
        } catch (error) {
            logger.error("Error updating cart products", error);
            throw error;
        }
    }

    async updateCartProductsQuantity(cartId, productId, newQuantity) {
        try {
            const cart = await this.getProductsByIdCart(cartId);
            if (!cart) {
                logger.warning("Cart not found");
                return null;
            }

            const productIndex = cart.products.findIndex(item => item.product.toString() === productId);
            if (productIndex === -1) {
                logger.warning("Product not found in cart");
                return null;
            }

            cart.products[productIndex].quantity = newQuantity;
            cart.markModified("products");
            await cart.save();
            logger.info("Product quantity updated in cart successfully");
            return cart;
        } catch (error) {
            logger.error("Error updating product quantity in cart", error);
            throw error;
        }
    }

    async deleteAllProductsFromCart(cartId) {
        try {
            const cart = await this.getProductsByIdCart(cartId);
            if (!cart) {
                logger.warning("Cart not found");
                return null;
            }

            cart.products = [];
            cart.markModified("products");
            await cart.save();
            logger.info("All products deleted from cart successfully");
            return cart;
        } catch (error) {
            logger.error("Error deleting all products from cart", error);
            throw error;
        }
    }

    async getProductsPopulation(cartId) {
        try {
            const cart = await CartModel.findOne({ _id: cartId });
            logger.info("Cart population fetched successfully");
            return cart;
        } catch (error) {
            logger.error("Error fetching cart population", error);
            throw error;
        }
    }
}

module.exports = CartRepository;
