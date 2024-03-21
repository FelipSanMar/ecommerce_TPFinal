//ProductManager.js

const path = require('path');

class ProductManager {

    static id = 0;

    constructor() {
        this.products = [];
        this.fs = require("fs");
        this.path = path.join(__dirname, '../models/products.json');
        this.fileInit();    //Inicializa el archivo 
    }

    //Si el archivo existe lo carga, sino crea uno nuevo
    fileInit() {
        try {
            if (this.fs.existsSync(this.path)) {
                const data = this.fs.readFileSync(this.path, 'utf-8');
                this.products = JSON.parse(data);
            } else {
                this.fs.writeFileSync(this.path, JSON.stringify([]));
            }
        } catch (error) {
            console.error("Error en la inicialización:", error);
        }
    }

    fileAddProducts() {
        try {
            this.fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
        } catch (error) {
            console.error("Error al añadir productos:", error);
        }
    }

    addProduct({ title, description, price, img, code, stock, category, thumbnails }) {

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
        this.fileAddProducts();
        console.log("Producto agregado con exito");
    }



    getProducts() {

        return this.products;
    }

    getProductByid(id) {
        const product = this.products.find((product) => product.id === id);
        if (product) {
            console.log("PRODUCTO ENCONTRADO:");
            console.log(product);
            return product;
        } else {
            console.error("Producto no encontrado");
            return null;
        }
    }

    updateProduct(id, updateProduct) {

        const index = this.products.findIndex((product) => product.id == id);

        if (index !== -1) {

            this.products[index] = { ...this.products[index], ...updateProduct };
            this.fileAddProducts();

            return console.log("Producto actualizado");
        } else console.log("ID no encontrado ");
    }

    deleteProduct(id) {

        const index = this.products.findIndex((product) => product.id == id);

        if (index !== -1) {
            this.products.splice(index, 1);
            this.fileAddProducts();

            return true;
        } else return false;


    }
}

const productos = new ProductManager();


module.exports = ProductManager;