//product.repository.js

const ProductModel = require("../models/products.model.js");
const CustomError = require("../services/errors/custom-error.js");
const { generarInfoError } = require("../services/errors/info.js");
const { EErrors } = require("../services/errors/enums.js");
const { logger } = require("../utils/logger.utils.js");

class ProductRepository {
    async addProduct({ title, description, price, img, code, stock, category, thumbnails, owner }) {
        try {
            if (!title || !description || !price || !code || !category) {
                throw CustomError.crearError({
                    nombre: "Producto nuevo",
                    causa: generarInfoError({ title, description, price, code, category }),
                    mensaje: "Error al intentar crear producto",
                    codigo: EErrors.TIPO_INVALIDO
                });
            }

            const productExist = await ProductModel.findOne({ code: code });
            if (productExist) {
                logger.warning("Code Repeat");
                return;
            }
            console.log("Owner:", owner);
            
            const productData = new ProductModel({
                title,
                description,
                price,
                img,
                code,
                stock,
                category,
                status: true,
                thumbnails: thumbnails || [],
                owner
            });

            await productData.save();

            logger.info("Product add");
        } catch (error) {
            logger.error("ERROR: Product add", error);
            throw error;
        }
    }

    async getProducts() {
        try {
            const arrayProducts = await ProductModel.find();
            logger.info("Fetched products successfully");
            return arrayProducts;
        } catch (error) {
            logger.error("ERROR: Could not fetch products", error);
            throw error;
        }
    }

    async getProductByid(id) {
        try {
            const product = await ProductModel.findById(id);
            if (product) {
                logger.info("Product Found");
                logger.debug(product);
                return product;
            } else {
                logger.warning("Product Not Found");
                return null;
            }
        } catch (error) {
            logger.error("ERROR: Could not read the file", error);
            throw error;
        }
    }

    async updateProduct(id, updateProd) {
        try {
            const updateProduct = await ProductModel.findByIdAndUpdate(id, updateProd);
            if (!updateProduct) {
                logger.warning("Product Not Found");
                return null;
            }
            logger.info("Product Updated");
            return updateProduct;
        } catch (error) {
            logger.error("ERROR: Could not update product", error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const deleteProduct = await ProductModel.findByIdAndDelete(id);
            if (!deleteProduct) {
                logger.warning("Product Not Found");
                return null;
            }
            logger.info("Product Deleted");
        } catch (error) {
            logger.error("ERROR: Could not delete product", error);
            throw error;
        }
    }
}

module.exports = ProductRepository;
