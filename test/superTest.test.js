
const supertest = require("supertest");

//const {expect} = require("chai");

// Usa la importación dinámica para chai ya que esta en formato ES 
//before se utiliza para asegurar que chai este importado antes de ser utilizado
let chai;
before(async () => {
  chai = await import("chai");
});

//cte encargada de realizar las peticiones 
const requester = supertest("http://localhost:8080");


describe("Testing para app E-COMMERCE", () => {
    describe("Testing ROUTER PRODUCTS", () => {

        //Agregar producto

        it("Metodo POST: Agregar Producto", async () => {
            
            const newProduct = {
                title: "Banana Pi M2 Zero",
                description: "Microcontrolador",
                code: "P020",
                price: 30,
                stock: 10,
                category: "Electrónica"
            }

            const {statusCode, ok, body} = await requester.post("/api/products").send(newProduct);

            //Verifica creacion exitosa 
            chai.expect(statusCode).to.equal(200);
            //Verifica campos primordiales existentes
            console.log(statusCode);
            console.log(body);
            chai.expect(body.payload).to.have.property("_id");
            //title || !description || !price || !code || !category 
            // chai.expect(body.payload).to.have.property("title").that.equal(true);
            // chai.expect(_body.payload).to.have.property("description").that.equal(true);
            // chai.expect(_body.payload).to.have.property("price").that.equal(true);
            // chai.expect(_body.payload).to.have.property("code").that.equal(true);
            // chai.expect(_body.payload).to.have.property("category").that.equal(true);

        })
        //Ver productos 

        //Actualizar producto
        
        //Eliminar producto 
    })
}) 