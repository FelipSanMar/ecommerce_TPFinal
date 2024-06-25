const ProductModel = require("../models/products.model.js");
const CartRepository = require("../repositories/cart.repository.js");
const cartRepository = new CartRepository();
const UserDTO = require("../dto/user.dto.js");

class ViewsController {

    async renderChat(req, res) {
        res.render("chat");
    }

    async renderProducts(req, res) {
        try {

            const limit = parseInt(req.query.limit || 5);
            const page = parseInt(req.query.page) || 1;
            const sort = req.query.sort === 'desc' ? -1 : req.query.sort === 'asc' ? 1 : null;
            const query = req.query.query || null;

            //Objeto de opciones para la paginacion
            const options = {
                limit,
                page,
                sort: sort ? { price: sort } : null
            }

            //Consulta
            const queryObj = query ? { category: query } : {};

            const products = await ProductModel.paginate(queryObj, options);



            const productsFinish = products.docs.map(prod => {
                const { _id, ...rest } = prod.toObject();
                return rest;
            })
        

            res.render("products", {
                user: req.user.user,
                products: productsFinish,
                hasPrevPage: products.hasPrevPage,
                hasNextPage: products.hasNextPage,
                prevPage: products.prevPage,
                nextPage: products.nextPage,
                currentPage: products.page,
                totalPages: products.totalPages
            })



        } catch (error) {
            console.error("Error al obtener productos", error);
            res.status(500).json({
                error: "Error interno del servidor"
            });
        }
    }


    async renderCart(req, res) {
        const cartId = req.params.cid;

        try {
            const carrito = await cartRepository.getProductsByIdCart(cartId);

            if (!carrito) {
                console.log("Cart Not Found");
                return res.status(404).json({ error: "Cart Not Found" });
            }

            const productsInCart = carrito.products.map(item => ({
                product: item.product.toObject(),

                //Lo convertimos a objeto para pasar las restricciones de Exp Handlebars. 
                quantity: item.quantity
            }));


            res.render("carts", { productos: productsInCart });
        } catch (error) {
            console.error("Error al obtener el carrito", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async renderLogin(req, res) {
        //Verificar que el usuario ya este logueado y redirigir a la pagina de productos
        if (req.session.login) {
            return res.redirect("/products");
        }

        res.render("login");
    }


    async renderRegister(req, res) {
        if (req.session.login) {
            return res.redirect("/profile");
        }
        res.render("register");
    }
    async renderCurrent(req, res) {
        if (!req.user) {
            return res.status(403).send('No user data available');
        }
    
        const { first_name, last_name, age, email, role } = req.user.user;
       
        const userDto = new UserDTO(first_name, last_name, age, email, role);
    
        const isAdmin = role === 'admin';
        res.render("current", { user: userDto, isAdmin });
    }

    async renderRealTimeProducts(req, res) {
        try {
            res.render("realtimeproducts");
        } catch (error) {
            console.log("error en la vista real time", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async renderChat(req, res) {
        res.render("chat");
    }
    


}

module.exports = ViewsController;