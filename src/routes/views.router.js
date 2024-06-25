const express = require("express");
const router = express.Router();

const ViewsController = require("../controllers/view.controller.js");
const viewsController = new ViewsController();

const passport = require("passport");
const jwt = require("jsonwebtoken");
const checkUserRole = require("../middleware/checkrole.js");



//router.get("/products", checkUserRole(['usuario']),passport.authenticate('jwt', { session: false }), viewsController.renderProducts);
router.get("/products", passport.authenticate('jwt', { session: false }), checkUserRole(['usuario']), viewsController.renderProducts);

router.get("/carts/:cid", viewsController.renderCart);
router.get("/login", viewsController.renderLogin);
router.get("/register", viewsController.renderRegister);
//router.get("/current", passport.authenticate("jwt", { session: false }), viewsController.renderCurrent );
router.get("/current", passport.authenticate("jwt", { session: false }), (req, res, next) => {
    next();
}, viewsController.renderCurrent);


router.get("/realtimeproducts", checkUserRole(['admin']), viewsController.renderRealTimeProducts);
router.get("/chat", checkUserRole(['usuario']) ,viewsController.renderChat);


module.exports = router; 


//router.get("/", viewsController.renderHome);