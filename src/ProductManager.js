class ProductManager {
    
    static id = 0;

    constructor() {
        this.products = [];
        this.fs = require("fs");
        this.path = "./products.json";
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



    addProduct(title, description, price, thumbnail, code, stock) {
        if (arguments.length !== 6) {
            console.log("ERROR: Debe ingresar todos los campos");
            return;
        }

        if (this.products.find((product) => product.code === code)) {
            console.log("ERROR: Codigo repetido");
            return;
        }

        ProductManager.id++;
        const productData = {
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            id: ProductManager.id
        };

        this.products.push(productData);
        this.fileAddProducts();
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

    updateProduct(id,updateProduct){

        const index = this.products.findIndex((product) => product.id == id);

        if(index !== -1){

            this.products[index] = {...this.products[index], ...updateProduct}; 
            this.fileAddProducts();
            
            return console.log("Producto actualizado");
        }else console.log("ID no encontrado ");
    }

    deleteProduct(id){

        const index = this.products.findIndex((product) => product.id == id);

        if(index !== -1){
            this.products.splice(index,1);
           this.fileAddProducts();
            
            return console.log("Producto eliminado");
        }else console.log("ERROR al eliminar: ID no encontrado ");


    }
}

const productos = new ProductManager();

// Arreglo vacio
//console.log("Arreglo Vacio:");
//console.log(productos.getProducts());

// Creacion de productos 
/*
productos.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen1", "abc123", 25);
productos.addProduct("producto2", "Este es un producto2", 40, "Imagen", "Perico", 90);
productos.addProduct("producto3", "Este es un producto prueba3", 30, "Imagen 3", "a", 26);
productos.addProduct("producto4", "Este es un producto prueba4", 40, "Imagen 4", "b", 27);
productos.addProduct("producto5", "Este es un producto prueba5", 50, "Imagen 5", "c", 28);
productos.addProduct("producto6", "Este es un producto prueba6", 60, "Imagen 6", "d", 29);
productos.addProduct("producto7", "Este es un producto prueba7", 70, "Imagen 7", "e", 30);
productos.addProduct("producto8", "Este es un producto prueba8", 80, "Imagen 8", "f", 31);
productos.addProduct("producto8", "Este es un producto prueba9", 90, "Imagen 9", "g", 32);
productos.addProduct("producto8", "Este es un producto prueba10", 100, "Imagen 10", "h", 33);
*/
/*
// Impresion del producto
console.log("PRODUCTOS AGREGADOS:");
console.log(productos.getProducts());


//Id encontrado
console.log("ID ENTONRADO: ");
productos.getProductByid(2);

//Id no encontrado
console.log("ID NO ENTONRADO: ");
productos.getProductByid(10);

//Se actualiza campo de un producto
productos.updateProduct(2,{title:"ProdUpdate", thumbnail:"Sin imagen"});
console.log(productos.getProducts());

//Eliminar producto
productos.deleteProduct(5);
console.log(productos.getProducts());
*/

module.exports = ProductManager;