document.addEventListener('DOMContentLoaded', () => {
    const checkoutProducts = document.getElementById('checkout-products');
    const totalPriceElement = document.getElementById('total-price');

    // Obtenemos el cartId del dataset en el HTML
    const cartId = document.getElementById('user-data').getAttribute('data-cart-id');

    // Asegúrate de que el cartId exista antes de continuar
    if (!cartId) {
        console.error('Error: No se encontró el cartId.');
        return;
    }

    // Obtener los productos del carrito desde el backend usando el cartId
    fetch(`/api/carts/${cartId}`)
    .then(response => response.json())
    .then(data => {
        if (!data || !data.products || data.products.length === 0) {
            // Mostrar un mensaje si no hay productos en el carrito
            checkoutProducts.innerHTML = '<tr><td colspan="5">No hay productos en el carrito.</td></tr>';
            return;
        }

        let totalPrice = 0;
        data.products.forEach(item => {
            const product = item.product; // Aquí accedemos a la propiedad "product"
            const subtotal = product.price * item.quantity;
            totalPrice += subtotal;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.title}</td>
                <td>$${product.price}</td>
                <td>
                    <input type="number" value="${item.quantity}" min="1" class="quantity-input" data-product-id="${product._id}">
                    <button class="refresh-quantity-btn" data-product-id="${product._id}">Actualizar</button>
                </td>
                <td>$${subtotal}</td>
                <td>
                    <button class="remove-product-btn" data-product-id="${product._id}">Eliminar</button>
                </td>
            `;

            checkoutProducts.appendChild(row);
        });

        totalPriceElement.textContent = totalPrice.toFixed(2);  // Mostrar el total
    })
    .catch(error => {
        console.error('Error al obtener los productos del carrito:', error);
    });

    // Lógica para eliminar productos
    checkoutProducts.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-product-btn')) {
            const productId = event.target.getAttribute('data-product-id');
            fetch(`/api/carts/${cartId}/products/${productId}`, { method: 'DELETE' })  // Fíjate que aquí usamos '/products/'
            .then(response => {
                if (response.ok) {
                    console.log('Producto eliminado');
                    location.reload();  // Recargar la página después de eliminar
                } else {
                    console.error('Error al eliminar el producto');
                }
            })
            .catch(error => console.error('Error en la solicitud de eliminación:', error));
        }
    });

    // Lógica para actualizar cantidades al hacer clic en "Actualizar"
    checkoutProducts.addEventListener('click', (event) => {
        if (event.target.classList.contains('refresh-quantity-btn')) {
            const productId = event.target.getAttribute('data-product-id');
            const quantityInput = event.target.previousElementSibling; // Selecciona el input de cantidad
            const newQuantity = quantityInput.value;

            // Verifica que la cantidad sea válida (no menor que 1)
            if (newQuantity < 1) {
                alert('La cantidad debe ser mayor o igual a 1');
                return;
            }

            // Actualiza la cantidad del producto en el carrito
            fetch(`/api/carts/${cartId}/products/${productId}`, {  // Aquí corregimos a '/products/'
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quantity: newQuantity })
            })
            .then(response => {
                if (response.ok) {
                    console.log('Cantidad actualizada');
                    location.reload();  // Recargar la página después de actualizar la cantidad
                } else {
                    console.error('Error al actualizar la cantidad');
                }
            })
            .catch(error => console.error('Error en la solicitud de actualización:', error));
        }
    });
});
