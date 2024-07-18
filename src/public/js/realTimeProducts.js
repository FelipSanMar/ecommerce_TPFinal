

const socket = io();
const role = document.getElementById("role").textContent;
const email = document.getElementById("email").textContent;

socket.on("productos", (data) => {
    renderProductos(data);
})


//Función para renderizar el listado de productos

const renderProductos = (productos) => {
    const contenedorProductos = document.getElementById("contenedorProductos");
    contenedorProductos.innerHTML = "";  //Se utiliza para evitar que se llene de productos fantasmas. Se limpia con un inner de espacios vacios

    productos.forEach(item => {
        const card = document.createElement("div");
        card.innerHTML = `
                            <p> ID: ${item._id} </p>
                            <p> Titulo:  ${item.title} </p>
                            <p> Precio: ${item.price} </p>
                            <button> Eliminar producto </button>
                        `;
        contenedorProductos.appendChild(card);

        //Agregamos el evento al boton de eliminar producto: 
        card.querySelector("button").addEventListener("click", () => {
            if(role == "premium" && item.owner === email){
                eliminarProducto(item._id);
            }else if(role === "admin"){
                eliminarProducto(item._id);
            }else{
                Swal.fire({
                    title: "Error",
                    text: "No posee permisos para borrar este producto"
                })
            }
            
        })
    })
}

//Eliminar producto: 

const eliminarProducto = (id) => {
    socket.emit("eliminarProducto", id);
}

//Agregar producto: 

document.getElementById("btnEnviar").addEventListener("click", () => {
    agregarProducto();
})

const agregarProducto = () => {

    const role = document.getElementById("role").textContent;
    const email = document.getElementById("email").textContent;

    const owner = role === "premium" ? email : "admin";

    const producto = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        img: document.getElementById("img").value,
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value,
        status: document.getElementById("status").value === "true",
        owner
    };
    socket.emit("agregarProducto", producto);
}