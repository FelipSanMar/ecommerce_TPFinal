document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.addToCart');
    const cartCountElement = document.getElementById('cart-count');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-product-id');
            const cartId = button.getAttribute('data-cart-id');
            const quantity = document.getElementById(`quantity-${productId}`).value;

            // Enviar la solicitud al backend para agregar al carrito
            fetch(`/api/carts/${cartId}/product/${productId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ quantity }),
            })
            .then(response => response.json())
            .then(data => {
                // Actualizar el contador del carrito
                cartCountElement.textContent = parseInt(cartCountElement.textContent) + parseInt(quantity);

                Swal.fire({
                    title: 'Producto agregado al carrito',
                    text: `Has agregado ${quantity} unidad(es) al carrito.`,
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            })
            .catch(error => {
                console.error('Error al agregar al carrito:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'No se pudo agregar el producto al carrito.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            });
        });
    });
});
