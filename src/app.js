//app.js

//Solucionar problemas de permisos npm i: //Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

//Importar modulos 
//import express from "express" //En el package.json hay que agregar "type": "module"
const express = require("express");

//Creación de una app de express
const app = express();
const PORT = 8080;

//VARIABLES DE ENTORNO
const configObject = require("./config/config");
const { mongo_url, port } = configObject;

//Conexion con base de datos
require("./database.js");


//Vinculacion de rutas tipo common JS 
const productsRouter = require("./routes/products.routes.js");
const cartsRouter = require("./routes/carts.routes.js");
const viewsRouter = require("./routes/views.router.js");
const userRouter = require("./routes/user.routes.js");
const mockingRouter = require("./routes/mocking.routes.js");


const exphbs = require("express-handlebars");
const socket = require("socket.io");
const session = require("express-session");
const MongoStore = require("connect-mongo");

//PASSPORT
const passport = require("passport");
const initializePassport = require("./config/passport.config.js");
const cookieParser = require("cookie-parser");

const cors = require("cors");
const path = require('path');

const errorHandler = require("./middleware/error.js");

//MIDDLEWARE  
app.use(express.json()); //Notacion JSON
app.use(express.urlencoded({ extended: true })); //Para recibir por query datos complejos
app.use(express.static("./src/public"));
app.use(session({
    secret: "coderhouse", //"secretCoder" 
    resave: true,
    saveUninitialized: true,

}))
//app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

//AuthMiddleware
const authMiddleware = require("./middleware/authmiddleware.js");
app.use(authMiddleware);


//CONFIGURACION HANDLEBARS
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//PASSPORT
app.use(cookieParser());
app.use(passport.initialize());
//app.use(passport.session());
initializePassport();

//Rutas 
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", userRouter);
//Generar cien productos
app.use("/mockingproducts",mockingRouter);
app.use(errorHandler);


const httpServer = app.listen(PORT, () => {
    console.log(`Escuchando en el http://localhost:${PORT}`);
})


//Obtener el array de productos
const MessageModel = require("./models/message.model.js");

///Websockets: 
const SocketManager = require("./sockets/socketManager.js");
new SocketManager(httpServer);


//const io = new socket.Server(httpServer);

/*
io.on("connection", async (socket) => {
    console.log("Cliente conectado");

    socket.on("message", async data => {

        //Guardo el mensaje en MongoDB: 
        await MessageModel.create(data);

        //Obtengo los mensajes de MongoDB y se los paso al cliente: 
        const messages = await MessageModel.find();
        console.log(messages);
        io.sockets.emit("message", messages);

    })
})*/