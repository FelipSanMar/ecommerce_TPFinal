const express = require("express");
const router = express.Router();
const UserModel = require("../models/user.model.js");
const { isValidPassword } = require("../utils/hashbcrypt.js");

//login:

router.post("/login", async (req, res) => {

    const { email, password } = req.body;

    try {
        const userLogin = await UserModel.findOne({ email: email });


        if (userLogin) {


            //Como esta hasheado se valida con BCRYPT
            if (isValidPassword(password, userLogin)) {

                req.session.login = true;

                req.session.user = {

                    email: userLogin.email,
                    age: userLogin.age,
                    first_name: userLogin.first_name,
                    last_name: userLogin.last_name,
                    role: userLogin.role
                };

                res.redirect("/products");

            } else {

                res.status(401).send("Invalid Password");
            }
        } else {

            res.status(404).send("User not found");
        }

    } catch (error) {

        res.status(400).send("Error Login");
    }
})

router.get("/logout", (req, res) => {

    if (req.session.login) {

        req.session.destroy();
    }
    res.redirect("/login");
})

module.exports = router;
