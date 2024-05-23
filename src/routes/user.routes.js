const express = require("express");
const router = express.Router();
const UserModel = require("../models/user.model.js");
const { createHash } = require("../utils/hashbcrypt.js");

const passport = require("passport");
const jwt = require("jsonwebtoken");

const CartManager = require("../controllers/CartManager.js");
const cartManager = new CartManager();

//VERSION PARA PASSPORT: 
//Register
router.post("/", async (req, res) => {
    const { first_name, last_name, email, password, age } = req.body;

    try {
        //  Verificamos si el usuario ya existe
        const existUser = await UserModel.findOne({ email: email }); //Verifica que no este registrado el email

        if (existUser) {
            return res.status(400).send("The email is already registered");
        }

        //Definir rol
        const role = email === 'adminCoder@coder.com' ? 'admin' : 'usuario';

        //Se crea un nuevo carro
        const Cart = await cartManager.addCart();

        //Crear un nuevo usuario
        const newUser = await UserModel.create({
            first_name,
            last_name,
            email,
            password: createHash(password),
            cart: Cart._id,
            age,
            role
        });

        //Guarda en la Base de Datos.
        await newUser.save();

        //Genera el token: 
        const token = jwt.sign({ first_name: newUser.first_name, last_name: newUser.last_name, email: newUser.email, age: newUser.age, role: newUser.role }, "coderhouse", { expiresIn: "1h" });

        //Establecer el token como Cookie: 
        res.cookie("coderCookieToken", token, {
            maxAge: 3600000, //1 hora de vida
            httpOnly: true //La cookie solo se puede acceder mediante HTTP
        });

        res.redirect("/current");

    } catch (error) {
        res.status(500).send("Error interno del servidor");
    }

})

module.exports = router;