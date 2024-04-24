//Connection with MongoDB


const mongoose = require("mongoose");

//Connection with database 

mongoose.connect("mongodb+srv://fsmCluster:Nosql.2023@fsmcluster.inv0ufs.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=fsmCluster")
    .then(() => console.log("MongoDB: Conexion exitosa"))
    .catch((error) => console.log("Error en la conexion", error))