//products.routes.js

const express = require("express");
const router = express.Router();
const ProductManager = require("../controllers/ProductManager.js");

//Se genera una instancia de donde esta el path 
//Se pasa desde la raiz de la aplicacion ya que node corre desde ahi 
const productManager = new ProductManager("./src/models/products.json");

//const products = new ProductManager();

//Devuelve todos los productos o la cantidad que se indiquen 

router.get("/", (req, res) => {

    //Lee el archivo de productos y los devuelve como obtejo 
    const prods = productManager.getProducts();
    //Verificar si se proporciono un limite 
    const limit = req.query.limit;

    if (limit) {
        //Devuelve solo el numero de productos solicitados
        res.send(prods.slice(0, limit));
    } else {
        //Devuelve todos los productos 
        res.send(prods);
    }

});

//Devuelve el producto con ID

router.get("/:pid", (req, res) => {

    let id = parseInt(req.params.pid);
    const prod = productManager.getProductByid(id);

    if (prod) {
        res.send(prod);
    } else {
        res.status(404).send({ message: "Product not found" });
    }

})

//Agregar nuevo producto

router.post("/", (req, res) => {

    const newProduct = req.body;

    let status = productManager.addProduct(newProduct);

    if (status > 0) {
        res.status(200).send({ message: "Producto agregado con exito" });
    }
    if (status === -1) {
        res.status(404).send({ message: "Debe ingresar todos los campos requeridos" });
    }
    if (status === -2) {
        res.status(404).send({ message: "ERROR: Codigo repetido" });
    }

});

router.put("/:pid", (req, res) => {

    const id = req.params.pid;
    const productUpdate = req.body;

    productManager.updateProduct(id, productUpdate);


})

router.delete("/:pid", (req, res) => {

    const id = req.params.pid;

    let status = productManager.deleteProduct(id);

    if (status) {
        res.status(200).send({ message: "Producto eliminado con exito" });

    } else res.status(404).send({ message: "ID not found" });



})


module.exports = router;
