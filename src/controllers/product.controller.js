
//const ProductRepository = require("../repositories/product.repository.js");
const { productService } = require("../services/index.js");

const CustomError = require("../services/errors/custom-error.js");
const { generarInfoError } = require("../services/errors/info.js");
const { EErrors } = require("../services/errors/enums.js");
const ProductModel = require("../models/products.model.js");
const EmailManager = require("../services/email.js");

const emailManager = new EmailManager;



class ProductController {

    async addProduct(req, res, next) {
        try {

            const limit = parseInt(req.query.limit || 10);
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

            // const products = await productService.paginate(queryObj, options);
            const products = await ProductModel.paginate(queryObj, options);

            const productsFinish = products.docs.map(prod => {
                const { _id, ...rest } = prod.toObject();
                return rest;
            })


            res.json({
                status: 'success',
                payload: productsFinish,
                totalPages: products.totalPages,
                prevPage: products.prevPage,
                nextPage: products.nextPage,
                page: products.page,
                hasPrevPage: products.hasPrevPage,
                hasNextPage: products.hasNextPage,
                prevLink: products.hasPrevPage ? `/api/products?limit=${limit}&page=${products.prevPage}&sort=${sort}&query=${query}` : null,
                nextLink: products.hasNextPage ? `/api/products?limit=${limit}&page=${products.nextPage}&sort=${sort}&query=${query}` : null,
            });

        } catch (error) {
            console.error("Error al obtener productos", error);
            next(error);
        }
    }

    async getProducts(req, res) {

        const id = req.params.pid;

        try {

            const prod = await productService.getProductByid(id);

            if (prod) {
                res.send(prod);
            } else {
                res.status(404).send({ message: "Product not found" });
            }
        } catch (error) {

            console.error("Error al obtener producto", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async getProductByid(req, res, next) {

        const newProduct = req.body;

        try {

            await productService.addProduct(newProduct);

            res.status(200).send({ message: "Successfully added product", payload: newProduct });

        } catch (error) {
            next(error);
            // res.status(500).json({ error: "Internal Server Error" });
        }

    }


    async updateProduct(req, res) {

        const id = req.params.pid;
        const productUpdate = req.body;
        try {
            productService.updateProduct(id, productUpdate);
            res.status(200).send({ message: "Successfully product update" });
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
        }


    }

    async deleteProduct(req, res) {

        const id = req.params.pid;
        const productDeleted = await productService.deleteProduct(id);

        try {

            if (productDeleted === null) {
                res.status(400).send({ message: "Product Not Found" });
            } else {
                //Si el usuario es premium notificar que se elimino un producto
                if (productDeleted.owner && productDeleted.owner == 'premium') {
                    emailManager.enviarCorreoNotificacion(productDeleted.owner, `
                    Queríamos informarte que el siguiente producto fue eliminado de la tienda:<br>
                    Titulo:  ${productDeleted.title} <br>
                    Descripción: ${productDeleted.description} <br>
                    Código: ${productDeleted.code} <br>
                    Precio: ${productDeleted.price} <br>
                `);
                }
                res.status(200).send({ message: "Product Deleted" });
            }



        } catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

}

module.exports = ProductController