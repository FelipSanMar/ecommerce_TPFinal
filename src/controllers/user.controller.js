const UserModel = require("../models/user.model.js");
const CartModel = require("../models/carts.model.js");
const { createHash, isValidPassword } = require("../utils/hashbcrypt.js");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { generarResetToken } = require("../utils/tokenreset.js");

const EmailManager = require("../services/email.js");
const emailManager = new EmailManager();

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

            // Redirigir con código de estado en la URL
        //    res.redirect(201, `/current?status=201`);
            res.redirect("/current" );

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

                    // Actualizar la propiedad last_connection
                    userLogin.last_connection = new Date();
                    await userLogin.save();

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


    // async logout(req, res) {

    //     Actualizar la propiedad last_connection
    //    console.log("req.user:", req.user);
    //     console.log("req.user.last_connection 1:", req.user.user.last_connection);
    //     console.log("req.user.last_connection:", req.user.user.first_name);
    //     req.user.user.last_connection = new Date();
    //     console.log("req.user.last_connection 2:", req.user.user.last_connection);
    //    console.log("req.user.user:",req.user.user);
    //     await req.user.user.save();

    //     Limpiar la cookie del Token
    //     res.clearCookie("coderCookieToken");
    //     Redirigir a la pagina del Login. 
    //     res.redirect("/login");
    // }

    async logout(req, res) {
        try {

            req.user.last_connection = new Date();

            await req.user.save();

            // Limpiar la cookie del Token
            res.clearCookie("coderCookieToken");
            // Redirigir a la página del Login.
            res.redirect("/login");
        } catch (error) {
            console.error("Error en logout:", error);
            res.status(500).send("Error en el servidor");
        }
    }

    async github(req, res) { }

    async githubCallback(req, res) {
        //La estrategia de Github nos retornará el usuario, entonces los agrego a mi objeto de Session: 
        req.user = req.user;
        req.login = true;
        res.redirect("/current");
    }



    async requestPasswordReset(req, res) {
        const { email } = req.body;
        try {
            //Buscar al usuario por email
            const user = await UserModel.findOne({ email });

            if (!user) {
                return res.status(404).send("User not found");
            }

            //Si hay usuario, genera token: 

            const token = generarResetToken();

            //Agregar token al user: 
            user.resetToken = {
                token: token,
                expire: new Date(Date.now() + 3600000) // 1 Hora de duración. 
            }

            await user.save();

            //Envio de mail 
            await emailManager.enviarCorreoRestablecimiento(email, user.first_name, token);

            res.redirect("/acksendemail");
        } catch (error) {
            res.status(500).send("Error interno del servidor");
        }
    }

    async resetPassword(req, res) {
        const { email, password, token } = req.body;

        try {
            const user = await UserModel.findOne({ email });
            if (!user) {
                return res.render("passchange", { error: "User not found" });
            }

            //Se obtiene el token y verifica: 
            const resetToken = user.resetToken;
            if (!resetToken || resetToken.token !== token) {
                return res.render("passreset", { error: "Invalid token" });
            }

            //Verifica si el token expiro: 
            const ahora = new Date();
            if (ahora > resetToken.expire) {
                return res.render("passreset", { error: "Invalid token" });
            }

            //Verifica que la contraseña nueva no sea igual a la anterior: 
            if (isValidPassword(password, user)) {
                return res.render("passchange", { error: "The new password cannot be the same as the old one" });
            }

            //Actualizar contraseña: 
            user.password = createHash(password);

            //Se marca como usado el token: 
            user.resetToken = undefined;
            await user.save();

            return res.redirect("/login");

        } catch (error) {
            res.status(500).render("passreset", { error: "Server error" });
        }
    }

    //Cambiar el rol del usuario: 

    async cambiarRolPremium(req, res) {
        const { uid } = req.params;
        console.log("CAMBIO ROL PREMIUM");
        try {
            const user = await UserModel.findById(uid);
            console.log("Cambio de rol:", user);
            if (!user) {
                return res.status(404).send("User not found");
            }

            //Se verifica si el usuario tiene la documentacion requerida: 
            const documentacionRequerida = ["Identificacion", "Comprobante de domicilio", "Comprobante de estado de cuenta"];

            const userDocuments = user.documents.map(doc => doc.name);

            const tieneDocumentacion = documentacionRequerida.every(doc => userDocuments.includes(doc));

            if (!tieneDocumentacion) {
                console.log("No te cambio de rol porque no tenes documentacion");
                return res.status(400).send("El usuario no ha completado toda la documentacion");
            }


            //Si el usuario existe, se cambia el rol

            const nuevoRol = user.role === "usuario" ? "premium" : "usuario";

            const actualizado = await UserModel.findByIdAndUpdate(uid, { role: nuevoRol });
            res.json(actualizado);
        } catch (error) {
            res.status(500).send("Server error");
        }
    }





}



module.exports = UserController;