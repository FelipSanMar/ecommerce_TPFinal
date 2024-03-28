//ProductManager.js

const path = require('path');


class ProductManager {

    static id = 0;

    constructor() {
        this.products = [];
        this.fs = require("fs").promises;
        this.path = path.join(__dirname, '../models/products.json');
        this.fileReadProducts();    //Inicializa el archivo 
    }

    //Si el archivo existe lo carga, sino crea uno nuevo
    async fileReadProducts() {
        try {
            const data = await this.fs.readFile(this.path, 'utf-8');
            this.products = JSON.parse(data);
            return this.products;

        } catch (error) {
            console.error("Initialization Error:", error);
            throw error;
        }
    }

    async fileAddProducts() {
        try {
            await this.fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
        } catch (error) {
            console.error("Error when adding product:", error);
        }
    }

    async addProduct({ title, description, price, img, code, stock, category, thumbnails }) {

        try {


            if (!title || !description || !price || !code || !stock || !category) {

                console.log("Debe ingresar todos los campos requeridos");
                return -1;
            }

            if (this.products.find((product) => product.code === code)) {
                console.log("ERROR: Codigo repetido");
                return -2;
            }

            // Busca el último ID existente en la lista de productos
            let lastId = 0;
            if (this.products.length > 0) {
                lastId = this.products[this.products.length - 1].id;
            }

            // Generar el nuevo ID sumando 1 al último ID
            const newId = lastId + 1;

            const productData = {
                title,
                description,
                price,
                img,
                code,
                stock,
                category,
                status: true,
                thumbnail: thumbnails || [],
                id: newId
            };

            this.products.push(productData);
            await this.fileAddProducts();
            console.log("OK: Product add");

        } catch (error) {
            console.log("ERROR: Product add");
            throw error;
        }
    }



    async getProducts() {

        try {

            const arrayProducts = await this.fileReadProducts();
            return arrayProducts;

        } catch (error) {

            console.log("ERROR: Product add");
            throw error;
        }

    }

    async getProductByid(id) {
        try {
            const product = this.products.find((product) => product.id === id);
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

    async updateProduct(id, updateProduct) {
        try {
            const index = this.products.findIndex((product) => product.id == id);

            if (index !== -1) {

                this.products[index] = { ...this.products[index], ...updateProduct };
                this.fileAddProducts();

                return console.log("Product update");

            } else console.log("ID Not Found ");

        } catch (error) {

            console.log("ERROR: Could not product update");
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const index = this.products.findIndex((product) => product.id == id);

            if (index !== -1) {

                this.products.splice(index, 1);
                this.fileAddProducts();
                console.log("Product deleted");

                return true;

            } else {
                console.log("Product Not Found");
                return false;
            }
        } catch (error) {
            console.log("ERROR: Could not product delete");
            throw error;
        }
    }

}

const productos = new ProductManager();


module.exports = ProductManager;