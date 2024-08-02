
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

        it("Metodo POST: Agregar Producto (Verifica ingreso de los campos)", async () => {

            const newProduct = {
                title: "Banana Pi M2 Zero",
                description: "Microcontrolador",
                code: "P020",
                price: 30,
                stock: 10,
                category: "Electrónica"
            }

            const {statusCode, body} = await requester.post("/api/products").send(newProduct);

            //Verifica creacion exitosa 
            chai.expect(statusCode).to.equal(200);

            //Verifica campos primordiales existentes
             chai.expect(body.payload).to.have.property("title").that.is.a("string");
             chai.expect(body.payload).to.have.property("description").that.is.a("string");
             chai.expect(body.payload).to.have.property("price").that.is.a("number");
             chai.expect(body.payload).to.have.property("code").that.is.a("string");
             chai.expect(body.payload).to.have.property("category").that.is.a("string");

        })


        it("Metodo POST: Crea producto sin descripcion. Arroja status: error y status code 200", async () => {

            const newProduct = {
                title: "Raspberry Pi",
                code: "P021",
                price: 30,
                stock: 10,
                category: "Electrónica"
            }

            const { statusCode, body } = await requester.post("/api/products").send(newProduct);

            // Verifica que el status sea 'error'
            chai.expect(statusCode).to.equal(200); // Asume que un error de validación devuelve un 400
            chai.expect(body).to.have.property("status").that.equals("error");

        })
        //Actualizar producto
        it("Metodo PUT: Verifica que actulice un producto agregado", async () => {

            const idProduct = "662ab62df99192d567ed021c";

            const productUpdate = {
                price: 30,
                stock: 10
            }

            const { statusCode } = await requester.put(`/api/products/${idProduct}`).send(productUpdate);

            chai.expect(statusCode).to.equal(200);
        })

        //Eliminar producto 
        it("Metodo DELETE: Elimina un producto con el ID", async () => {

            const idProduct = "66ad1c2301bb6c99911c2092";

            const {statusCode, body} = await requester.delete(`/api/products/${idProduct}`);

            chai.expect(statusCode).to.equal(200);

        })

        it("Metodo DELETE: Si no encuentra el ID devuelve status 400", async () => {

            const idProduct = "66ad1c2301bb6c99911c2092";

            const { statusCode } = await requester.delete(`/api/products/${idProduct}`);

            chai.expect(statusCode).to.equal(400);

        })
    })
    describe("Testing ROUTER CARTS", () => {


        it("Metodo POST: Agrega produto. Devuelve estado 200", async () => {
            const idCart = "6630082162187d335770c21e";
            const idProduct = "662ab62df99192d567ed021c"; //Camiseta de algodon 

            const { statusCode } = await requester.post(`/api/carts/${idCart}/product/${idProduct}`);


            chai.expect(statusCode).to.equal(200);
        })

        it("Metodo PUT: Actualiza cantidad de un producto. Devuelve estado 200", async () => {
            const idCart = "6630082162187d335770c21e";
            const idProduct = "662ab62df99192d567ed021c"; //Camiseta de algodon 

            const quantity = {
                quantity: 10
            }

            const { statusCode } = await requester.put(`/api/carts/${idCart}/products/${idProduct}`).send(quantity);

            // console.log("Datos:");
            // console.log(statusCode);
            // console.log(body);

            chai.expect(statusCode).to.equal(200);
        })

        it("Metodo DELETE: Eliminar produto. Devuelve estado 200", async () => {
            const idCart = "6630082162187d335770c21e";
            const idProduct = "662ab62df99192d567ed021c"; //Camiseta de algodon 

            const { statusCode } = await requester.delete(`/api/carts/${idCart}/products/${idProduct}`);

            chai.expect(statusCode).to.equal(200);
        })
        //Actualizar cantidad de un producto 
    })

    describe("Testing ROUTER USER", () => {

        let cookie;

        //REGISTRAR USUARIO
        it("Metodo POST: Registrar Usuario", async () => {

            const mockUsuario = {
                first_name: "Paco", 
                last_name: "Puntero", 
                email: "papu@gmail.com", 
                password: "123",
                age: 35
            }

            const response = await requester.post("/api/users").send(mockUsuario);

            // Verificar que la redirección se realizó con éxito
            chai.expect(response.status).to.equal(201);
            chai.expect(response.header.location).to.include("/current?status=201");


        })
        //LOGEAR USUARIO 

        it("Metodo POST: Loguear usuario y recuperar cookie", async () => {

            //Enviamos al login los mismos datos que registramos en el paso anterior. 

            const userLogin = {
                email: "papu@gmail.com",
                password: "123"
            }

            const resultado = await requester.post("/api/users/login").send(userLogin);

            // Buscar del resultado los headers de la peticion: 
            const cookieResultado = resultado.headers["set-cookie"][0];

            //Verificar que la cookie recuperada exista:
            chai.expect(cookieResultado).to.be.ok;

            //Separar el nombre y el valor de la cookie recuperada y la guardar en "cookie": 
            cookie = {
                name: cookieResultado.split("=")[0],
                value: cookieResultado.split("=")[1]
            }

            //Verificar que los datos recuperados sean correctos: 
            chai.expect(cookie.name).to.be.ok.and.equal("coderCookieToken");
            chai.expect(cookie.value).to.be.ok;

        })

        it("Metodo GET: Ruta current. Enviar al cookie que contiene el usuario", async () => {

            // Ingresamos a la ruta current enviando la cookie y el parámetro de prueba
            const response = await requester.get("/current?test=true").set("cookie", [`${cookie.name}=${cookie.value}`]);

            const body = response.body;

            // Verificamos
            chai.expect(body.user.email).to.be.eql("papu@gmail.com");

        })

    })
}) 