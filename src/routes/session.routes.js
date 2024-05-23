const express = require("express");
const router = express.Router();
const UserModel = require("../models/user.model.js");
const { isValidPassword } = require("../utils/hashbcrypt.js");
const passport = require("passport");
const jwt = require("jsonwebtoken");


//VERSION PARA PASSPORT: 

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        //Verifica que el usuario ingresdo existe en la Base de Datos: 
        const userLogin = await UserModel.findOne({ email: email });

        if (userLogin) {


            //Como esta hasheado se valida con BCRYPT
            if (isValidPassword(password, userLogin)) {

                //Genera el token: 
                const token = jwt.sign({ first_name: userLogin.first_name, last_name: userLogin.last_name, email: userLogin.email, age: userLogin.age, role: userLogin.role }, "coderhouse", { expiresIn: "1h" });

                //Establecer el token como Cookie: 
                res.cookie("coderCookieToken", token, {
                    maxAge: 3600000, //1 hora de vida
                    httpOnly: true //La cookie solo se puede acceder mediante HTTP
                });

                res.redirect("/current");

            } else {

                return res.status(401).send("Invalid Password");
            }
        } else {

            return res.status(404).send("User not found");
        }

    } catch (error) {
        res.status(500).send("Error interno del servidor");
    }
})



//Logout: 

router.get("/logout", (req, res) => {

    //Limpiar la cookie del Token
    res.clearCookie("coderCookieToken");
    //Redirigir a la pagina del Login. 
    res.redirect("/login");
})


//GITHUB

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }), async (req, res) => { })

router.get("/githubcallback", passport.authenticate("github", {
    failureRedirect: "/login"
}), async (req, res) => {
    //La estrategia de Github nos retornará el usuario, entonces los agrego a mi objeto de Session: 
    req.user = req.user;
    req.login = true;
    res.redirect("/current");
})

module.exports = router;
