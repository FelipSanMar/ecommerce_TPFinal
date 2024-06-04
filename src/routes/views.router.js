const express = require("express");
const router = express.Router();

const ViewsController = require("../controllers/view.controller.js");
const viewsController = new ViewsController();

const passport = require("passport");
const jwt = require("jsonwebtoken");


router.get("/", viewsController.renderChat);
router.get("/products",passport.authenticate("jwt", { session: false }) , viewsController.renderProducts );
router.get("/carts/:cid", viewsController.renderCart);
router.get("/login", viewsController.renderLogin);
router.get("/register", viewsController.renderRegister);
router.get("/current", passport.authenticate("jwt", { session: false }), viewsController.renderCurrent );

module.exports = router; 