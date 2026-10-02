// Base de datos de productos y servicios ampliada con imágenes reales
const products = [
    { id: 1, name: "Camisa Escolar Institucional", category: "uniforms", price: 35000, desc: "Camisa blanca formal de alta durabilidad y fácil planchado.", img: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=500" },
    { id: 2, name: "Pantalón de Uniforme Diario", category: "uniforms", price: 45000, desc: "Pantalón clásico en tela antifluidos con costuras reforzadas.", img: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=500" },
    { id: 3, name: "Saco Escolar Tejido", category: "uniforms", price: 55000, desc: "Saco tejido azul o institucional con espacio para escudo.", img: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=500" },
    { id: 4, name: "Saco de Educación Física", category: "uniforms", price: 50000, desc: "Buzo deportivo cómodo con diseño institucional personalizado.", img: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=500" },
    { id: 5, name: "Falda Escolar Plisada", category: "uniforms", price: 42000, desc: "Falda de pliegues con ajuste perfecto y excelente caída.", img: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&q=80&w=500" },
    { id: 6, name: "Ajuste de Bota (Pantalón/Jeans)", category: "services", price: 12000, desc: "Modificación de largo o entallado de bota de pantalón.", img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=500" },
    { id: 7, name: "Entallado de Camisas o Blusas", category: "services", price: 15000, desc: "Ajuste lateral para lograr una silueta cómoda y estética.", img: "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&q=80&w=500" },
    { id: 8, name: "Cambio de Cremalleras", category: "services", price: 18000, desc: "Reemplazo completo de cremalleras metálicas o plásticas.", img: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=500" },
    { id: 9, name: "Ajuste de Cintura y Pinzas", category: "services", price: 16000, desc: "Entallado de cintura en pantalones, faldas y vestidos.", img: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&q=80&w=500" },
    { id: 10, name: "Confección de Prendas a Medida", category: "services", price: 75000, desc: "Diseño y confección personalizada según las medidas del cliente.", img: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=500" }
];

let cart = [];

// Elementos del DOM
const uniformsGrid = document.getElementById('uniforms-grid');
const servicesGrid = document.getElementById('services-grid');
const priceTableBody = document.getElementById('price-table-body');
const cartToggleBtn = document.getElementById('cart-toggle-btn');
const cartDrawer = document.getElementById('cart-drawer');
const closeCartBtn = document.getElementById('close-cart-btn');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartCount = document.getElementById('cart-count');
const cartTotalPrice = document.getElementById('cart-total-price');
const checkoutBtn = document.getElementById('checkout-btn');
const checkoutModal = document.getElementById('checkout-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const orderForm = document.getElementById('order-form');

// Sistema de cambio de pestañas (Views)
function switchTab(tabId) {
    document.querySelectorAll('.view-section').forEach(section => {
        section.classList.remove('active');
    });
    document.querySelectorAll('.nav-link-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    document.getElementById(`view-${tabId}`).classList.add('active');
    
    // Activar botón correspondiente en el menú
    event && event.target.classList.add('active');
}

// Inicializar la aplicación
function initApp() {
    renderCatalogs();
    renderPriceTable();
}

// Renderizar catálogos con tarjetas e imágenes
function renderCatalogs() {
    uniformsGrid.innerHTML = '';
    servicesGrid.innerHTML = '';

    products.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('product-card');
        card.innerHTML = `
            <img src="${item.img}" alt="${item.name}" class="product-img">
            <div class="product-body">
                <h3>${item.name}</h3>
                <p>${item.desc}</p>
                <div class="product-footer">
                    <span class="product-price">$${item.price.toLocaleString()}</span>
                    <button class="btn btn-primary" onclick="addToCart(${item.id})">Agregar</button>
                </div>
            </div>
        `;

        if (item.category === 'uniforms') {
            uniformsGrid.appendChild(card);
        } else {
            servicesGrid.appendChild(card);
        }
    });
}

// Renderizar tabla de precios
function renderPriceTable() {
    priceTableBody.innerHTML = '';
    products.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.category === 'uniforms' ? 'Uniformes' : 'Modistería'}</td>
            <td>${item.name}</td>
            <td>$${item.price.toLocaleString()}</td>
            <td><button class="btn btn-secondary" style="padding: 5px 12px; font-size: 0.85rem;" onclick="addToCart(${item.id})">Solicitar</button></td>
        `;
        priceTableBody.appendChild(row);
    });
}

// Funciones del Carrito
function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
    cartDrawer.classList.add('open');
}

function updateCartUI() {
    cartItemsContainer.innerHTML = '';
    let total = 0;
    let count = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-msg">El carrito está vacío.</p>';
    } else {
        cart.forEach(item => {
            total += item.price * item.quantity;
            count += item.quantity;

            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <span>$${item.price.toLocaleString()} x ${item.quantity}</span>
                </div>
                <button class="btn btn-secondary" style="padding: 4px 8px;" onclick="removeFromCart(${item.id})"><i class="fa-solid fa-trash"></i></button>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
    }

    cartCount.textContent = count;
    cartTotalPrice.textContent = `$${total.toLocaleString()}`;
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

// Eventos de interfaz
cartToggleBtn.addEventListener('click', () => cartDrawer.classList.add('open'));
closeCartBtn.addEventListener('click', () => cartDrawer.classList.remove('open'));

checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Tu carrito está vacío.');
        return;
    }
    cartDrawer.classList.remove('open');
    checkoutModal.classList.add('open');
});

closeModalBtn.addEventListener('click', () => checkoutModal.classList.remove('open'));

orderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('client-name').value;
    const payment = document.getElementById('payment-method').value;

    alert(`¡Solicitud enviada con éxito, ${name}!\nMétodo de pago seleccionado: ${payment}.\nNos comunicaremos contigo pronto para coordinar la entrega en Ibagué.`);
    
    cart = [];
    updateCartUI();
    checkoutModal.classList.remove('open');
    orderForm.reset();
});

// Ejecutar al cargar
initApp();