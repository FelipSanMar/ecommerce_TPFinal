const express = require("express");
const router = express.Router();
//const UserModel = require("../models/user.model.js");
//const { isValidPassword } = require("../utils/hashbcrypt.js");
const passport = require("passport");

//login:

// router.post("/login", async (req, res) => {

//     const { email, password } = req.body;

//     try {
//         const userLogin = await UserModel.findOne({ email: email });


//         if (userLogin) {


//             //Como esta hasheado se valida con BCRYPT
//             if (isValidPassword(password, userLogin)) {

//                 req.session.login = true;

//                 req.session.user = {

//                     email: userLogin.email,
//                     age: userLogin.age,
//                     first_name: userLogin.first_name,
//                     last_name: userLogin.last_name,
//                     role: userLogin.role
//                 };

//                 res.redirect("/products");

//             } else {

//                 res.status(401).send("Invalid Password");
//             }
//         } else {

//             res.status(404).send("User not found");
//         }

//     } catch (error) {

//         res.status(400).send("Error Login");
//     }
// })

//VERSION PARA PASSPORT: 

router.post("/login", passport.authenticate("login", {
    failureRedirect: "/api/sessions/faillogin"
}), async (req, res) => {
    if (!req.user) {
        return res.status(400).send("Credenciales invalidas");
    }

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email
    };

    req.session.login = true;

    res.redirect("/profile");
})


router.get("/faillogin", async (req, res) => {
    res.send("Fallo login");
})

router.get("/logout", (req, res) => {

    if (req.session.login) {

        req.session.destroy();
    }
    res.redirect("/login");
})


//GITHUB

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }), async (req, res) => { })

router.get("/githubcallback", passport.authenticate("github", {
    failureRedirect: "/login"
}), async (req, res) => {
    //La estrategia de Github nos retornará el usuario, entonces los agrego a mi objeto de Session: 
    req.session.user = req.user; 
    req.session.login = true; 
    res.redirect("/profile");
})

module.exports = router;
