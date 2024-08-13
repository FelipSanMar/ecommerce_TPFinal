const express = require("express");
const router = express.Router();
const UserModel = require("../models/user.model.js");
const { createHash } = require("../utils/hashbcrypt.js");

const passport = require("passport");
const jwt = require("jsonwebtoken");

const UserController = require("../controllers/user.controller.js");

const userController = new UserController();


router.post("/", userController.register);
router.post("/login", userController.login);
router.get("/logout", userController.logout);


//GITHUB
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }), userController.github);
router.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/login"}), userController.githubCallback);

router.post("/requestPasswordReset", userController.requestPasswordReset);
router.post("/passreset", userController.resetPassword);
//Cambia el rol de un usuario a premium
router.put("/premium/:uid", userController.cambiarRolPremium);

const UserRepository = require("../repositories/user.repository.js");
const userRepository = new UserRepository();
//Vamos a crear un middleware para Multer y lo vamos a importar: 
const upload = require("../middleware/multer.js");

router.post("/:uid/documents", upload.fields([{ name: "document" }, { name: "products" }, { name: "profile" }]), async (req, res) => {
    const { uid } = req.params;
    const uploadedDocuments = req.files;

    try {
        const user = await userRepository.findById(uid);

        if (!user) {
            return res.status(404).send("Usuario no encontrado");
        }

        //Verificar si se suben los documentos y se actualiza el usuario: 

        if (uploadedDocuments) {
            if (uploadedDocuments.document) {
                user.documents = user.documents.concat(uploadedDocuments.document.map(doc => ({
                    name: doc.originalname,
                    reference: doc.path
                })))
            }

            if (uploadedDocuments.products) {
                user.documents = user.documents.concat(uploadedDocuments.products.map(doc => ({
                    name: doc.originalname,
                    reference: doc.path
                })))
            }

            if (uploadedDocuments.profile) {
                user.documents = user.documents.concat(uploadedDocuments.profile.map(doc => ({
                    name: doc.originalname,
                    reference: doc.path
                })))
            }
        }

        //Guardar cambios en la base de datos : 

        await user.save();

        res.status(200).send("Documentos cargados exitosamente");
    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
})

module.exports = router;