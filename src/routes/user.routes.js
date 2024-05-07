const express = require("express");
const router = express.Router();
const UserModel = require("../models/user.model.js");
const { createHash } = require("../utils/hashbcrypt.js");

//Ruta para crear usuario y almacenarlo en mongo

router.post("/", async (req, res) => {

    const { first_name, last_name, email, password, age } = req.body;

    try {

        const existUser = await UserModel.findOne({ email: email }); //Verifica que no este registrado el email

        if (existUser) {
            return res.status(400).send("The email is already registered");
        }

        //Definir rol
        const role = email === 'adminCoder@coder.com' ? 'admin' : 'usuario';

        //Crear un nuevo usuario

        const newUser = await UserModel.create({
            first_name,
            last_name,
            email,
            password: createHash(password),
            age,
            role
        });

        //Creado el usuario, se crea la session. 
        req.session.login = true;
        req.session.user = { ...newUser._doc };

        res.redirect("/products")

    } catch (error) {
        res.status(500).send("Error creating user");
    }

})

module.exports = router;