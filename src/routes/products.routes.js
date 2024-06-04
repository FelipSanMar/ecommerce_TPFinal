//products.routes.js

const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/product.controller.js");

const productController = new ProductController();

//Devuelve todos los productos o la cantidad que se indiquen 
router.get("/", productController.addProduct);

//Devuelve el producto con ID
router.get("/:pid", productController.getProducts);

router.post("/", productController.getProductByid);
router.put("/:pid", productController.updateProduct);
router.delete("/:pid", productController.deleteProduct);


module.exports = router;

