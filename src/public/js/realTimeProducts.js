const socket = io();
const role = document.getElementById("role").textContent.trim();  // Obtener el rol del usuario
const email = document.getElementById("email").textContent.trim();  // Obtener el email del usuario

// Escuchar productos actualizados del servidor
socket.on("productos", (data) => {
    renderProductos(data);
});

// Función para renderizar el listado de productos
const renderProductos = (productos) => {
    const contenedorProductos = document.getElementById("contenedorProductos");
    contenedorProductos.innerHTML = "";  // Limpiar el contenedor antes de renderizar nuevos productos

    productos.forEach(item => {
        // Los usuarios premium solo pueden ver sus propios productos, admin puede ver todos
        if (role === "admin" || (role === "premium" && item.owner === email)) {
            const card = document.createElement("div");
            card.innerHTML = `
                <p><strong>ID:</strong> ${item._id}</p>
                <p><strong>Título:</strong> ${item.title}</p>
                <p><strong>Precio:</strong> ${item.price}</p>
                <button>Eliminar producto</button>
            `;
            contenedorProductos.appendChild(card);

            // Agregamos el evento al botón de eliminar producto
            card.querySelector("button").addEventListener("click", () => {
                if (role === "premium" && item.owner === email) {
                    eliminarProducto(item._id);
                } else if (role === "admin") {
                    eliminarProducto(item._id);
                } else {
                    Swal.fire({
                        title: "Error",
                        text: "No tiene permisos para borrar este producto",
                        icon: "error"
                    });
                }
            });
        }
    });
};

// Eliminar producto
const eliminarProducto = (id) => {
    socket.emit("eliminarProducto", id);
};

// Agregar producto
document.getElementById("btnEnviar").addEventListener("click", () => {
    agregarProducto();
});

const agregarProducto = () => {
    const role = document.getElementById("role").textContent.trim();
    const email = document.getElementById("email").textContent.trim();

    const owner = role === "premium" ? email : "admin";  // Definir owner según el rol

    const producto = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        img: document.getElementById("img").value,
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value,
        status: document.getElementById("status").value === "true",
        owner: owner  // El owner se asigna correctamente según el rol
    };

    // Emitir el evento para agregar el producto
    socket.emit("agregarProducto", producto);
};
