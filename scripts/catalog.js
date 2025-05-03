const productGrid = document.getElementById('productGrid');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const cartModal = document.getElementById('cartModal');
const openCartBtn = document.getElementById('openCartBtn');
const cartCloseBtn = document.getElementById('cart-close');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const categoryFilter = document.getElementById('categoryFilter');

let allProducts = [];
let filteredProducts = [];
let cart = [];
const itemsPerPage = 20;
let currentPage = 1;


async function fetchProducts() {
    const res = await fetch('https://fakestoreapi.com/products?limit=80');
    allProducts = await res.json();
    filteredProducts = [...allProducts];
    populateCategories(allProducts);
    renderProducts();
}

const categoryTranslations = {
    electronics: "Електроніка",
    jewelery: "Ювелірні вироби",
    "men's clothing": "Чоловічий одяг",
    "women's clothing": "Жіночий одяг"
};

function populateCategories(products) {
    const categories = [...new Set(products.map(p => p.category))];
    categoryFilter.innerHTML = '<option value="all">Усі категорії</option>';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = categoryTranslations[category] || category;
        categoryFilter.appendChild(option);
    });
}

function renderProducts() {
    console.log('Rendering products for page:', currentPage); // Дебаг
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const visible = filteredProducts.slice(start, end);
    console.log('Visible products:', visible.length); // Дебаг
    productGrid.innerHTML = '';

    visible.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.title}" />
            <div class="info">
                <h3>${product.title}</h3>
                <p>₴${product.price.toFixed(2)}</p>
                <p>Рейтинг: ${product.rating.rate}/5 ⭐</p>
                <div class="card-actions">
                    <button class="view-details" data-id="${product.id}">Детальніше</button>
                    <button class="add-to-cart" data-id="${product.id}">Додати в кошик</button>
                </div>
            </div>
        `;
        productGrid.appendChild(card);
    });

    addListeners();
    renderPagination();
}


function renderPagination() {
    console.log('Rendering pagination'); // Дебаг
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    console.log('Total pages:', totalPages); // Дебаг
    const pagination = document.getElementById('pagination');
    if (!pagination) {
        console.error('Pagination container not found!'); // Дебаг
        return;
    }
    pagination.innerHTML = '';


    const prevBtn = document.createElement('button');
    prevBtn.textContent = '«';
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            console.log('Previous page:', currentPage); // Дебаг
            renderProducts();
        }
    });
    pagination.appendChild(prevBtn);


    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.className = i === currentPage ? 'active' : '';
        btn.addEventListener('click', () => {
            currentPage = i;
            console.log('Selected page:', currentPage); // Дебаг
            renderProducts();
        });
        pagination.appendChild(btn);
    }


    const nextBtn = document.createElement('button');
    nextBtn.textContent = '»';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            console.log('Next page:', currentPage);
            renderProducts();
        }
    });
    pagination.appendChild(nextBtn);
}

// Обробники подій для кнопок "Додати в кошик" і "Детальніше"
function addListeners() {
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            const product = allProducts.find(p => p.id === id);
            addToCart(product);
            alert(`"${product.title}" додано в кошик!`);
        });
    });

    document.querySelectorAll('.view-details').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);

            window.location.href = `product.html?id=${id}`;
        });
    });
}

// Сортування
function sortProducts(criteria) {
    if (!filteredProducts.length) return;
    if (criteria === 'price-low') filteredProducts.sort((a, b) => a.price - b.price);
    else if (criteria === 'price-high') filteredProducts.sort((a, b) => b.price - a.price);
    else if (criteria === 'rating') filteredProducts.sort((a, b) => b.rating.rate - a.rating.rate);
    currentPage = 1; // Скидання на першу сторінку після сортування
    renderProducts();
}

// Фільтрація
function filterProductsBySearch() {
    const query = searchInput.value.toLowerCase();
    const currentCategory = categoryFilter.value;

    filteredProducts = allProducts.filter(p =>
        p.title.toLowerCase().includes(query) &&
        (currentCategory === 'all' || p.category === currentCategory)
    );

    currentPage = 1;
    renderProducts();
}

// Фільтрація
function filterByCategory() {
    const selectedCategory = categoryFilter.value;
    const query = searchInput.value.toLowerCase();

    filteredProducts = allProducts.filter(p =>
        (selectedCategory === 'all' || p.category === selectedCategory) &&
        p.title.toLowerCase().includes(query)
    );

    currentPage = 1;
    renderProducts();
}

searchInput.addEventListener('input', filterProductsBySearch);
sortSelect.addEventListener('change', e => sortProducts(e.target.value));
categoryFilter.addEventListener('change', filterByCategory);

// Відкриття модального
function openModal(id) {
    const product = allProducts.find(p => p.id === id);
    const modal = document.getElementById('productModal');
    modal.querySelector('.modal-title').textContent = product.title;
    modal.querySelector('.modal-desc').textContent = product.description;
    modal.querySelector('.modal-price').textContent = `₴${product.price.toFixed(2)}`;
    modal.querySelector('.modal-image').src = product.image;
    modal.style.display = 'flex';

    modal.querySelector('.modal-add').onclick = () => {
        addToCart(product);
        alert(`"${product.title}" додано в кошик!`);
    };
}

// Закриття модального вікна
document.getElementById('modal-close').addEventListener('click', () => {
    document.getElementById('productModal').style.display = 'none';
});

// Відкриття/закриття кошика
openCartBtn.addEventListener('click', () => {
    renderCart();
    cartModal.classList.add('active');
});

cartCloseBtn.addEventListener('click', () => {
    cartModal.classList.remove('active');
});

// Рендеринг кошика
function renderCart() {
    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;

        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="cart-thumb" />
            <div class="cart-details">
                <strong>${item.title}</strong><br>
                Ціна: ₴${item.price.toFixed(2)} <br>
                Кількість:
                <button class="qty-btn" data-id="${item.id}" data-action="decrease">−</button>
                ${item.quantity}
                <button class="qty-btn" data-id="${item.id}" data-action="increase">+</button>
                <button class="remove-btn" data-id="${item.id}">🗑</button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    cartTotal.textContent = `Загальна сума: ₴${total.toFixed(2)}`;

    document.querySelectorAll('.qty-btn').forEach(btn => {
        const id = parseInt(btn.dataset.id);
        const action = btn.dataset.action;
        btn.onclick = () => {
            const item = cart.find(p => p.id === id);
            if (action === 'increase') item.quantity++;
            if (action === 'decrease') item.quantity = Math.max(1, item.quantity - 1);
            renderCart();
        };
    });

    document.querySelectorAll('.remove-btn').forEach(btn => {
        const id = parseInt(btn.dataset.id);
        btn.onclick = () => {
            cart = cart.filter(p => p.id !== id);
            renderCart();
        };
    });
}

document.getElementById('checkoutBtn').addEventListener('click', () => {
    localStorage.setItem('order', JSON.stringify(cart));
    window.location.href = 'order.html';
});

function addToCart(product) {
    const existing = cart.find(p => p.id === product.id);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({...product, quantity: 1});
    }
    renderCart();
}

document.getElementById('menu-toggle').addEventListener('click', function () {
    this.classList.toggle('open');
    document.getElementById('nav-menu').classList.toggle('active');
});

fetchProducts();