const express = require("express");
const router = express.Router();

const ViewsController = require("../controllers/view.controller.js");
const viewsController = new ViewsController();

const passport = require("passport");
const jwt = require("jsonwebtoken");
const checkUserRole = require("../middleware/checkrole.js");




router.get("/products", passport.authenticate('jwt', { session: false }), checkUserRole(['usuario', 'premium']), viewsController.renderProducts);

router.get("/carts/:cid", viewsController.renderCart);
router.get("/login", viewsController.renderLogin);
router.get("/register", viewsController.renderRegister);
router.get("/current", passport.authenticate("jwt", { session: false }), (req, res, next) => {
    next();
}, viewsController.renderCurrent);


router.get("/realtimeproducts", checkUserRole(['admin', 'premium']), viewsController.renderRealTimeProducts);
router.get("/chat", checkUserRole(['usuario', 'premium']) ,viewsController.renderChat);

router.get("/passreset", viewsController.renderResetPassword);
router.get("/password", viewsController.renderCambioPassword);
router.get("/acksendemail", viewsController.renderConfirmacion);

//administrar usuarios
router.get("/usersadmin", checkUserRole(['admin']), viewsController.renderAdminUser);

module.exports = router; 


//router.get("/", viewsController.renderHome);