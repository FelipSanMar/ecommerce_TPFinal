// app.js

const express = require("express");
const app = express();
const PORT = 8080;

// VARIABLES DE ENTORNO
const configObject = require("./config/config");
const { mongo_url, port } = configObject;

// Conexion con base de datos
require("./database.js");

// Vinculacion de rutas tipo common JS 
const productsRouter = require("./routes/products.routes.js");
const cartsRouter = require("./routes/carts.routes.js");
const viewsRouter = require("./routes/views.router.js");
const userRouter = require("./routes/user.routes.js");
const mockingRouter = require("./routes/mocking.routes.js");
const loggerRouter = require("./routes/logger.routes.js");

const exphbs = require("express-handlebars");
const socket = require("socket.io");
const session = require("express-session");
const MongoStore = require("connect-mongo");

// PASSPORT
const passport = require("passport");
const initializePassport = require("./config/passport.config.js");
const cookieParser = require("cookie-parser");

const cors = require("cors");
const path = require('path');

const errorHandler = require("./middleware/error.js");

// MIDDLEWARE  
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));
app.use(session({
    secret: "coderhouse",
    resave: true,
    saveUninitialized: true,
}));
app.use(cors());

// AuthMiddleware
const authMiddleware = require("./middleware/authmiddleware.js");
app.use(authMiddleware);

// Importar y usar el middleware addLogger
const addLogger = require("./middleware/logger.js");
app.use(addLogger);

// CONFIGURACION HANDLEBARS
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// PASSPORT
app.use(cookieParser());
app.use(passport.initialize());
initializePassport();

// Rutas 
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", userRouter);
app.use("/mockingproducts", mockingRouter);
app.use("/loggertest", loggerRouter);
app.use(errorHandler);

const httpServer = app.listen(PORT, () => {
    console.log(`Escuchando en el http://localhost:${PORT}`);
});

// Obtener el array de productos
const MessageModel = require("./models/message.model.js");

// Websockets: 
const SocketManager = require("./sockets/socketManager.js");
new SocketManager(httpServer);

//Modulos Swagger 
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUiExpress = require("swagger-ui-express"); 

//Se  Crea objeto de configuracion: swaggerOptions

const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Documentacion de la App Ecommerce", 
            description: "App para la comercializacion de productos"
        }
    }, 
    apis: ["./src/docs/**/*.yaml"]
}

//4) Conectamos Swagger a nuestro servidor de Express: 

const specs = swaggerJSDoc(swaggerOptions); 
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));