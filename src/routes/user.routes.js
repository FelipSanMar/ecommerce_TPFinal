const express = require("express");
const router = express.Router();
const UserModel = require("../models/user.model.js");
const { createHash } = require("../utils/hashbcrypt.js");

const passport = require("passport");

//Ruta para crear usuario y almacenarlo en mongo

// router.post("/", async (req, res) => {

//     const { first_name, last_name, email, password, age } = req.body;

//     try {

//         const existUser = await UserModel.findOne({ email: email }); //Verifica que no este registrado el email

//         if (existUser) {
//             return res.status(400).send("The email is already registered");
//         }

//         //Definir rol
//         const role = email === 'adminCoder@coder.com' ? 'admin' : 'usuario';

//         //Crear un nuevo usuario

//         const newUser = await UserModel.create({
//             first_name,
//             last_name,
//             email,
//             password: createHash(password),
//             age,
//             role
//         });

//         //Creado el usuario, se crea la session. 
//         req.session.login = true;
//         req.session.user = { ...newUser._doc };

//         res.redirect("/products")

//     } catch (error) {
//         res.status(500).send("Error creating user");
//     }

// })

//VERSION PARA PASSPORT: 
//(estrategia local)

router.post("/", passport.authenticate("register", {
    failureRedirect: "/failedregister"
}), async (req, res) => {
    if(!req.user) {
        return res.status(400).send("Credenciales invalidas"); 
    }

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email
    };

    req.session.login = true; //Para las vistas

    res.redirect("/profile");

})

router.get("/failedregister", (req, res) => {
    res.send("Registro Fallido!");
})

module.exports = router;