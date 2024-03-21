//app.js

//Importar modulos 
//import express from "express" //En el package.json hay que agregar "type": "module"
const express = require("express");

//Creación de una app de express
const app = express();

const PORT = 8080;



//MIDDLEWARE  
app.use(express.json()); //Notacion JSON
app.use(express.urlencoded({extended:true})); //Para recibir por query datos complejos

//Vinculacion de rutas tipo common JS 
const productsRouter = require("./routes/products.routes.js");
const cartsRouter = require("./routes/carts.routes.js");

//Rutas 
app.use("/api/products",productsRouter);
app.use("/api/carts",cartsRouter);



app.listen(PORT, () => {
    console.log(`Escuchando en el http://localhost:${PORT}`);
})

