//ProductManager.js


const ProductModel = require("../models/products.model.js")

class ProductRepository {


    async addProduct({ title, description, price, img, code, stock, category, thumbnails }) {

        try {


            if (!title || !description || !price || !code || !stock || !category) {

                console.log("Debe ingresar todos los campos requeridos");
                return;
            }

            const productExist = await ProductModel.findOne({ code: code });

            if (productExist) {
                console.log("Code Repeat");
                return;
            }

            const productData = new ProductModel({
                title,
                description,
                price,
                img,
                code,
                stock,
                category,
                status: true,
                thumbnails: thumbnails || []

            });

            await productData.save();

            console.log("OK: Product add");

        } catch (error) {
            console.log("ERROR: Product add");
            throw error;
        }
    }



    async getProducts() {

        try {

            const arrayProducts = await ProductModel.find();
            return arrayProducts;

        } catch (error) {

            console.log("ERROR: Product add");
            throw error;
        }

    }

    async getProductByid(id) {
        try {
            const product = await ProductModel.findById(id);
            if (product) {
                console.log("Product Found");
                console.log(product);
                return product;
            } else {
                console.error("Product Not Found");
                return null;
            }
        } catch (error) {
            console.log("ERROR: Could not read the file");
            throw error;
        }
    }

    async updateProduct(id, updateProd) {
        try {
            const updateProduct = await ProductModel.findByIdAndUpdate(id, updateProd);

            if (!updateProduct) {
                console.log("Product Not Found");
                return null;
            }
            console.log("Product Update");
            return updateProduct;

        } catch (error) {

            console.log("ERROR: Could not product update");
            throw error;
        }
    }

    async deleteProduct(id) {
        try {

            const deleteProduct = await ProductModel.findByIdAndDelete(id);

            if (!deleteProduct) {
                console.log("Product Not Found");
                return null;
            }
            console.log("Product Deleted");

        } catch (error) {
            console.log("ERROR: Could not product delete", error);
            throw error;
        }
    }

}

//const productos = new ProductManager();


module.exports = ProductRepository;