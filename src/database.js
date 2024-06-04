//Connection with MongoDB

const mongoose = require("mongoose");
const configObject = require("./config/config.js");

const {mongo_url, port }= configObject;


//Connection with database 
mongoose.connect(mongo_url)
    .then(() => console.log("MongoDB: Conexion exitosa"))
    .catch((error) => console.log("Error en la conexion", error))