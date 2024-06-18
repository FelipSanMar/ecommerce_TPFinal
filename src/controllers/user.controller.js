const UserModel = require("../models/user.model.js");
const CartModel = require("../models/carts.model.js");
const { createHash, isValidPassword } = require("../utils/hashbcrypt.js");
const passport = require("passport");
const jwt = require("jsonwebtoken");


class UserController {

    async register(req, res) {

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
            const Cart = new CartModel();
            await Cart.save();

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
            const token = jwt.sign({ user: newUser }, "coderhouse", { expiresIn: "1h" });
          
            //Establecer el token como Cookie: 
            res.cookie("coderCookieToken", token, {
                maxAge: 3600000, //1 hora de vida
                httpOnly: true //La cookie solo se puede acceder mediante HTTP
            });

            res.redirect("/current");

        } catch (error) {
            res.status(500).send("Error interno del servidor");
        }


    }

    async login(req, res) {

        const { email, password } = req.body;

        try {
            //Verifica que el usuario ingresdo existe en la Base de Datos: 
            const userLogin = await UserModel.findOne({ email: email });

            if (userLogin) {


                //Como esta hasheado se valida con BCRYPT
                if (isValidPassword(password, userLogin)) {

                    //Genera el token: 
                    const token = jwt.sign({ user: userLogin }, "coderhouse", { expiresIn: "1h" });
                    
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
    }


    async logout(req, res) {
        //Limpiar la cookie del Token
        res.clearCookie("coderCookieToken");
        //Redirigir a la pagina del Login. 
        res.redirect("/login");
    }

    async github(req, res){ }

    async githubCallback(req, res){
            //La estrategia de Github nos retornará el usuario, entonces los agrego a mi objeto de Session: 
    req.user = req.user;
    req.login = true;
    res.redirect("/current");
    }


}



module.exports = UserController;