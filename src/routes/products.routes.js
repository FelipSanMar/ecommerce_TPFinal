//products.routes.js

const express = require("express");
const router = express.Router();
const ProductManager = require("../controllers/ProductManager.js");

//Se genera una instancia de donde esta el path 
//Se pasa desde la raiz de la aplicacion ya que node corre desde ahi 
//const productManager = new ProductManager("./src/models/products.json");

const ProductModel = require("../models/products.model.js");


//Devuelve todos los productos o la cantidad que se indiquen 

router.get("/", async (req, res) => {

    try {
        //Lee el archivo de productos y los devuelve como obtejo 
       // const prods = await productManager.getProducts();
         
        const limit = parseInt(req.query.limit || 10); //Verificar si se proporciono un limite. Si no es diez 
        const page = parseInt(req.query.page) || 1;
        const sort = req.query.sort === 'desc' ? -1 : req.query.sort === 'asc' ? 1 : null;
        const query = req.query.query || null;

        //Objeto de opciones para la paginacion
        const options = {
            limit,
            page,
            sort: sort ? {price: sort} : null
        }
        
        //Consulta
        const queryObj = query ? {category: query} : {};

        const products = await ProductModel.paginate(queryObj, options);

      //  console.log(products);

        const productsFinish = products.docs.map(prod => {
            const {_id, ...rest} = prod.toObject();
            return rest;
        })

    //    res.send(products);

     res.render("products", {
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
});

//Devuelve el producto con ID

router.get("/:pid", async (req, res) => {

    const id = req.params.pid;

    try {

        const prod = await productManager.getProductByid(id);

        if (prod) {
            res.send(prod);
        } else {
            res.status(404).send({ message: "Product not found" });
        }
    } catch (error) {

        console.error("Error al obtener producto", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

//Agregar nuevo producto

router.post("/", async (req, res) => {

    const newProduct = req.body;

    try {

        await productManager.addProduct(newProduct);
        res.status(200).send({ message: "Successfully added product" });


    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.put("/:pid", async (req, res) => {

    const id = req.params.pid;
    const productUpdate = req.body;
    try {
        productManager.updateProduct(id, productUpdate);
        res.status(200).send({ message: "Successfully product update" });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }



})

router.delete("/:pid", async (req, res) => {

    const id = req.params.pid;

    try {

        await productManager.deleteProduct(id);
        res.status(200).send({ message: "Product Deleted" });

    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }

})


module.exports = router;

