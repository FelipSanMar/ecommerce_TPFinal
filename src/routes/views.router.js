const express = require("express");
const router = express.Router(); 

const ProductManager = require("../controllers/ProductManager.js");
const CartManager = require("../controllers/CartManager.js");
//const productManager = new ProductManager("./src/models/products.json");

const productManager = new ProductManager();
const cartManager = new CartManager();

const ProductModel = require("../models/products.model.js");


router.get("/",  (req, res) => {
    res.render("chat");
});

router.get("/products", async (req, res) =>{

    try {
         
        const limit = parseInt(req.query.limit || 5); 
        const page = parseInt(req.query.page) || 1;
        const sort = req.query.sort === 'desc' ? -1 : req.query.sort === 'asc' ? 1 : null;
        const query = req.query.query || null;

        //Objeto de opciones para la paginacion
        const options = {
            limit,
            page,
            sort: sort ? {price: sort} : null
        }
        
        //Consulta
        const queryObj = query ? {category: query} : {};

        const products = await ProductModel.paginate(queryObj, options);

    

        const productsFinish = products.docs.map(prod => {
            const {_id, ...rest} = prod.toObject();
            return rest;
        })


     res.render("products", {
        products: productsFinish,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        currentPage: products.page,
        totalPages: products.totalPages
     })



    } catch (error) {
        console.error("Error al obtener productos", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});

router.get("/carts/:cid", async (req, res) => {
    const cartId = req.params.cid;
 
    try {
       const carrito = await cartManager.getProductsByIdCart(cartId);
 
       if (!carrito) {
          console.log("Cart Not Found");
          return res.status(404).json({ error: "Cart Not Found" });
       }
 
       const productsInCart = carrito.products.map(item => ({
          product: item.product.toObject(),

          //Lo convertimos a objeto para pasar las restricciones de Exp Handlebars. 
          quantity: item.quantity
       }));
 
 
       res.render("carts", { productos: productsInCart });
    } catch (error) {
       console.error("Error al obtener el carrito", error);
       res.status(500).json({ error: "Error interno del servidor" });
    }
 });
 

module.exports = router; 