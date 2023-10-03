// Variables globales
const cart = [];
let products = [];

// Obtener precio del producto por nombre
function getPriceBynombreProducto(nombreProducto) {
    const selectedProduct = products.find(product => product.title === nombreProducto);
    return selectedProduct ? selectedProduct.price : 0;
}

// Obtener imagen del producto por nombre
function getImageBynombreProducto(nombreProducto) {
    const selectedProduct = products.find(product => product.title === nombreProducto);
    return selectedProduct ? selectedProduct.image : '';
}

// Actualizar el carrito
function updateCart() {
    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");
    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        const selectedProduct = products.find(product => product.title === item.name);

        if (selectedProduct) {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td><img src="${getImageBynombreProducto(item.name)}" alt="${selectedProduct.title}" width="50"></td>
                <td>${selectedProduct.title} - $${item.price.toFixed(2)}</td>
                <td><button onclick="removeFromCart(${index})">Eliminar</button></td>
            `;
            cartItems.appendChild(row);
            total += item.price;
        }
    });

    cartTotal.textContent = `Total: $${total.toFixed(2)}`;
}


document.addEventListener("DOMContentLoaded", function () {
    const agregarAlCarritoBoton = document.getElementById("agregarAlCarritoBoton");

    // Obtener productos falsos de la API
    fetch('https://fakestoreapi.com/products')
        .then(response => response.json())
        .then(data => {
            products = data;
            populateseleccionarProducto();
        })
        .catch(error => console.error('Error al obtener productos:', error));

    // Llenar la lista desplegable de productos
    function populateseleccionarProducto() {
        const seleccionarProducto = document.getElementById("seleccionarProducto");
        products.forEach(product => {
            const option = document.createElement("option");
            option.value = product.title;
            option.textContent = `${product.title} - $${product.price}`;
            seleccionarProducto.appendChild(option);
        });
    }

    agregarAlCarritoBoton.addEventListener("click", function () {
        const nombreProducto = document.getElementById("seleccionarProducto").value;
        const productPrice = getPriceBynombreProducto(nombreProducto);

        if (nombreProducto && productPrice) {
            cart.push({ name: nombreProducto, price: productPrice });
            updateCart();
        }
    });
});

function removeFromCart(index) {
    const confirmarRemover = confirm("¿Seguro que deseas eliminar este artículo del carrito?");
    if (confirmarRemover) {
        cart.splice(index, 1);
        updateCart();
    }
}

const botonComprar = document.getElementById("botonComprar");

botonComprar.addEventListener("click", function () {
    const nombreCliente = document.getElementById("nombreCliente").value;
    const rutCliente = document.getElementById("rutCliente").value;

    const customerDisplayName = nombreCliente.trim() !== '' ? nombreCliente : 'Consumidor Final';

    const modalContent = document.createElement("div");
    modalContent.innerHTML = `
        <div class="modal fade" id="purchaseModal" tabindex="-1" role="dialog" aria-labelledby="purchaseModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="purchaseModalLabel">Detalles de la Compra</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p><strong>Nombre del Cliente:</strong> ${customerDisplayName}</p>
                        ${rutCliente ? `<p><strong>RUT:</strong> ${rutCliente}</p>` : ''}
                        <p><strong>Método de Pago:</strong> 
                            <select id="paymentMethodSelect">
                                <option value="tarjeta">Tarjeta de Crédito</option>
                                <option value="efectivo">Efectivo</option>
                                <option value="transferencia">Transferencia Bancaria</option>
                            </select>
                        </p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" id="confirmPurchase">Confirmar Compra</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modalContent);
    $('#purchaseModal').modal('show');

    const confirmPurchaseButton = document.getElementById("confirmPurchase");
    confirmPurchaseButton.addEventListener("click", function () {
        const paymentMethod = document.getElementById("paymentMethodSelect").value;
        const displayNameForAlert = customerDisplayName === 'Consumidor Final' ? 'Consumidor Final' : customerDisplayName;
        alert(`Compra realizada por ${displayNameForAlert}. Método de Pago: ${paymentMethod}`);
        $('#purchaseModal').modal('hide');
    });
});








