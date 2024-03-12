//Importar modulos 
//import express from "express" //En el package.json hay que agregar "type": "module"
const express = require("express");
const ProductManager = require("./ProductManager") ;

const PORT = 8080;

//Creación de una app de express
const app = express();

//Se importan los productos 
const products = new ProductManager();

//http://localhost:8080/products -> Arroja todos los productos 
//http://localhost:8080/products?limit=5 -> Arroja los primeros cinco 

app.get("/products", (req,res) => {

    //Lee el archivo de productos y los devuelve como obtejo 
    const prods = products.getProducts();
    //Verificar si se proporciono un limite 
    const limit = req.query.limit;

    if(limit){
        //Devuelve solo el numero de productos solicitados
        res.send(prods.slice(0,limit));
    }else {
        //Devuelve todos los productos 
        res.send(prods);
    }

});

//http://localhost:8080/products/2 -> Devuelve solo el producto con id=2

app.get("/products/:pid", (req,res) => {

    let id = parseInt(req.params.pid);
    const prod = products.getProductByid(id);

    if(prod){
        res.send(prod);
    }else{
        res.status(404).send({message: "Product not found"});
    }

})



app.listen(PORT, () => {
    console.log(`Escuchando en el http://localhost:${PORT}`);
})

