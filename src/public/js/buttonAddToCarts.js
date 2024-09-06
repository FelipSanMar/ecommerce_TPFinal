


document.querySelectorAll(".addToCart").forEach(button => {
    button.addEventListener("click", () => {
        addToCart(button);
    });
});

const addToCart = (button) => {
    const productID = button.getAttribute("data-product-id");

    // Obtener datos del usuario desde el DOM
    const userData = document.getElementById("user-data");
    const userID = userData.getAttribute("data-user-id");
    const userEmail = userData.getAttribute("data-user-email");
    const cartID = userData.getAttribute("data-cart-id");

    console.log("Producto agregado al carrito");
    console.log("ProductID:", productID);
    console.log("UserID:", userID);
    console.log("UserEmail:", userEmail);
    console.log("CartID:", cartID);

    //Como mejora se podria agregar la cantidad de productos a agregar 

     // Enviar solicitud al servidor para agregar el producto al carrito
     fetch(`/api/carts/${cartID}/product/${productID}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)coderCookieToken\s*=\s*([^;]*).*$)|^.*$/, "$1")}`
        },
        body: JSON.stringify({ productID, userID })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Server Response:", data);
        if (data.success) {
            console.log("Producto agregado exitosamente");
        } else {
            console.error("Error al agregar producto", data.error);
        }
    })
    .catch(error => console.error('Error:', error));
}
