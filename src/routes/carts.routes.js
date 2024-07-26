//carts.routes.js

const express = require("express");
const router = express.Router();
const CartController = require("../controllers/cart.controller.js");


const cartController = new CartController();

//Agregar nuevo carrito
router.post("/", cartController.newCart );

//Listar productos pertenecientes al carrito 
router.get("/:cid", cartController.getProductsByIdCart);

//Agrega productos al carro
router.post("/:cid/product/:pid", cartController.addProductsByCart);

//Elimina del carrito el producto selecionado 
router.delete("/:cid/products/:pid", cartController.deleteProductsByCart);

//Actualiza el carrito con un arreglo de productos con el formato especificado
router.put("/:cid", cartController.updateCartProducts);

//Actualiza solo la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body
router.put("/:cid/products/:pid", cartController.updateCartProductsQuantity);

//Elimina todos los productos del carro
router.delete("/:cid", cartController.deleteAllProductsFromCart);

//Finaliza la compra y realiza el ticket
router.post("/:cid/purchase", cartController.checkOut);

module.exports = router;

