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
router.put("/premium/:uid", userController.cambiarRolPremium);


module.exports = router;