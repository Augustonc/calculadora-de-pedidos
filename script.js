const productos = [
    { id: 'lomo', nombre: 'Lomo', precio: 8000, aderezos: ['Mayonesa', 'Ketchup', 'Salsa Golf', 'Mostaza', 'Picante', 'Jamón', 'Queso', 'Huevo', 'Lechuga', 'Tomate'] },

    { id: 'choripan', nombre: 'Choripán', precio: 6000, aderezos: ['Mayonesa', 'Ketchup', 'Salsa Golf', 'Mostaza', 'Picante', 'Jamón', 'Queso', 'Huevo', 'Lechuga', 'Tomate'] },

    { id: 'pancho', nombre: 'Pancho', precio: 2500, aderezos: ['Mayonesa', 'Ketchup', 'Salsa Golf', 'Mostaza', 'Picante', 'Papitas'] },

    { id: 'pancho-doble', nombre: 'Pancho Doble', precio: 3000, aderezos: ['Mayonesa', 'Ketchup', 'Salsa Golf', 'Mostaza', 'Picante', 'Papitas'] },

    { id: 'hamburguesa', nombre: 'Hamburguesa', precio: 5000, aderezos: ['Mayonesa', 'Ketchup', 'Salsa Golf', 'Mostaza', 'Picante', 'Jamón', 'Queso', 'Huevo', 'Lechuga', 'Tomate'] },

    { id: 'hamburguesa-doble', nombre: 'Hamburguesa Doble', precio: 7000, aderezos: ['Mayonesa', 'Ketchup', 'Salsa Golf', 'Mostaza', 'Picante', 'Jamón', 'Queso', 'Huevo', 'Lechuga', 'Tomate'] }
];

let pedidos = {};
const menu = document.querySelector('.menu');

// Generar el menú dinámicamente
productos.forEach(producto => {
    // 1 Crea un div 2 con la clase "product-container" y el 3 id ej. lomo-container
    const productContainer = document.createElement('div');
    productContainer.className = 'product-container';
    productContainer.id = `${producto.id}-container`;

    // Crea un button con la clase "product-btn" y de contenido producto y precio
    // Al presionarlo llama a la función toggleOptions y le pasa un producto como parámetro
    const productBtn = document.createElement('button');
    productBtn.className = 'product-btn';
    productBtn.textContent = `${producto.nombre} - $${producto.precio}`;
    /* productBtn.onclick = () => toggleOptions(producto.id); //original */
    productBtn.onclick = () => addToOrder(producto);

    /* const optionsDiv = document.createElement('div');
    optionsDiv.className = 'options';
    optionsDiv.id = `${producto.id}-options`;
    optionsDiv.style.display = 'none'; */

    /* const aderezosDiv = document.createElement('div');
    aderezosDiv.className = 'aderezos'; */
    
    /* producto.aderezos.forEach(aderezo => {
        const label = document.createElement('label');
        if (aderezo.toLowerCase() !== 'picante') {
            label.innerHTML = `<input type="checkbox" value="${aderezo}" checked> ${aderezo}`;
        } else {
            label.innerHTML = `<input type="checkbox" value="${aderezo}"> ${aderezo}`;
        }
        aderezosDiv.appendChild(label);
}); */

    /* const acceptBtn = document.createElement('button');
    acceptBtn.className = 'accept-btn';
    acceptBtn.textContent = 'Aceptar';
    acceptBtn.onclick = () => addToOrder(producto); */

    /* optionsDiv.appendChild(aderezosDiv); */
    /* optionsDiv.appendChild(acceptBtn); */
    
    productContainer.appendChild(productBtn);
    /* productContainer.appendChild(optionsDiv); */
    menu.appendChild(productContainer);
});

// Función para mostrar/ocultar opciones
// function toggleOptions(productId) {
//     const options = document.getElementById(`${productId}-options`);
//     if (options.style.display === 'none' || options.style.display === '') {
//         options.style.display = 'block';
//     } else {
//         options.style.display = 'none';
//     }
// }

// Función para agregar un producto al pedido
function addToOrder(producto) {
    const customerName = document.getElementById('customer-name').value;
    if (!customerName) return alert('Por favor, ingrese el nombre del cliente.');

    const aderezos = Array.from(
        document.querySelectorAll(`#${producto.id}-options input:checked`)
    ).map(checkbox => checkbox.value);

    // Actualizar contadores
    pedidos[producto.id] = (pedidos[producto.id] || 0) + 1;

    // Actualizar lista de pedidos
    const orderList = document.getElementById('order-list');
    const li = document.createElement('li');
    li.id = `order-${producto.id}-${pedidos[producto.id]}`;
    li.innerHTML = `
        <strong>${customerName}:</strong> ${producto.nombre} (${aderezos.join(', ')})
        <button class="move-btn">Mover a Realizados</button>
        <button class="edit-btn">Editar</button>
        <div class="edit-options hidden">
            ${producto.aderezos.map(aderezo => `
                <label>
                    <input type="checkbox" value="${aderezo}" ${aderezos.includes(aderezo) ? 'checked' : ''}> ${aderezo}
                </label>
            `).join('')}
            <button class="save-btn">Guardar</button>
        </div>
    `;
    orderList.appendChild(li);

    // Agregar funcionalidad al botón "Mover a Realizados"
    const moveBtn = li.querySelector('.move-btn');
    moveBtn.onclick = () => moveToCompletedOrders(li);

    // Agregar funcionalidad al botón "Editar"
    const editBtn = li.querySelector('.edit-btn');
    editBtn.onclick = () => toggleEditOptions(li);

    // Agregar funcionalidad al botón "Guardar"
    const saveBtn = li.querySelector('.save-btn');
    saveBtn.onclick = () => saveEditOptions(li, producto);

    actualizarContador();
    toggleOptions(producto.id);
}

// Función para mostrar/ocultar opciones de edición
function toggleEditOptions(order) {
    const editOptions = order.querySelector('.edit-options');
    if (editOptions.classList.contains('hidden')) {
        editOptions.classList.remove('hidden');
    } else {
        editOptions.classList.add('hidden');
    }
}

// Función para guardar los cambios de edición
function saveEditOptions(order, producto) {
    const aderezos = Array.from(
        order.querySelectorAll('.edit-options input:checked')
    ).map(checkbox => checkbox.value);

    // Actualizar el contenido del pedido
    const strong = order.querySelector('strong');
    strong.nextSibling.textContent = ` ${producto.nombre} (${aderezos.join(', ')})`;

    // Ocultar opciones de edición
    toggleEditOptions(order);
}

document.getElementById('make-order-btn').onclick = () => {
    document.getElementById('orders-section').classList.add('hidden'); // Oculta pedidos realizados
    document.querySelector('.order-summary').classList.remove('hidden'); // Muestra pedidos actuales
    document.querySelector('.customer-info').classList.remove('hidden'); // Muestra el campo de nombre
    document.querySelector('.menu').classList.remove('hidden'); // Muestra el menú
};

document.getElementById('view-orders-btn').onclick = () => {
    document.getElementById('orders-section').classList.remove('hidden'); // Muestra pedidos realizados
    document.querySelector('.order-summary').classList.add('hidden'); // Oculta pedidos actuales
    document.querySelector('.customer-info').classList.add('hidden'); // Oculta el campo de nombre
    document.querySelector('.menu').classList.add('hidden'); // Oculta el menú
};

// Mover pedidos a "Pedidos Realizados"
function moveToCompletedOrders(order) {
    const completedOrdersList = document.getElementById('completed-orders-list');

    // Obtener el nombre del producto desde el pedido
    const productoNombre = order.querySelector('strong').nextSibling.textContent.trim().split(' ')[0];

    // Encontrar el producto correspondiente en el array de productos
    const producto = productos.find(p => p.nombre === productoNombre);

    if (producto && pedidos[producto.id]) {
        // Descontar del contador de pedidos
        pedidos[producto.id]--;

        // Si el contador llega a cero, eliminar la entrada del objeto pedidos
        if (pedidos[producto.id] === 0) {
            delete pedidos[producto.id];
        }
    }

    // Actualizar el contador de pedidos
    actualizarContador();

    // Eliminar los botones del pedido
    const moveBtn = order.querySelector('.move-btn');
    const editBtn = order.querySelector('.edit-btn');
    if (moveBtn) moveBtn.remove();
    if (editBtn) moveBtn.remove();

    // Mover el pedido a la lista de completados
    completedOrdersList.appendChild(order); // Agregar a la lista de completados
}

function actualizarContador() {
    const orderCounts = document.getElementById('order-counts');
    orderCounts.innerHTML = '';

    for (const [productoId, count] of Object.entries(pedidos)) {
        const producto = productos.find(p => p.id === productoId);
        if (producto) {
            const countElement = document.createElement('div');
            countElement.textContent = `${producto.nombre}: ${count}`;
            orderCounts.appendChild(countElement);
        }
    }
}