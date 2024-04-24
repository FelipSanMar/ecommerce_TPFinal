//app.js

//Importar modulos 
//import express from "express" //En el package.json hay que agregar "type": "module"
const express = require("express");

//Creación de una app de express
const app = express();
const PORT = 8080;

//Conexion con base de datos
require("./database.js");


//Vinculacion de rutas tipo common JS 
const productsRouter = require("./routes/products.routes.js");
const cartsRouter = require("./routes/carts.routes.js");
const viewsRouter = require("./routes/views.router.js");

const exphbs = require("express-handlebars");
const socket = require("socket.io");


//MIDDLEWARE  
app.use(express.json()); //Notacion JSON
app.use(express.urlencoded({ extended: true })); //Para recibir por query datos complejos
app.use(express.static("./src/public"));

//CONFIGURACION HANDLEBARS
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");


//Rutas 
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);



const httpServer = app.listen(PORT, () => {
    console.log(`Escuchando en el http://localhost:${PORT}`);
})

const io = socket(httpServer);

//Obtener el array de productos
const ProductManager = require("./controllers/ProductManager.js");
const productManager = new ProductManager("./src/models/products.json");

io.on("connection", async (socket) => {
    console.log("Cliente conectado");

    //Enviamos array de productos para al cliente
    socket.emit("productos", await productManager.getProducts());

    //Recibimos el evento "eliminarProducto" desde el cliente
    socket.on("eliminarProducto", async (id) => {
        await productManager.deleteProduct(id);
        //Se envia el array de productos actualizados
        socket.emit("productos", await productManager.getProducts());
    })

    //Recibe el evento "agregarProducto" desde el cliente 
    socket.on("agregarProducto", async (producto) => {
        await productManager.addProduct(producto);
        socket.emit("productos", await productManager.getProducts());
    })
})