const orderList = document.getElementById('orderList');
const orderTotal = document.getElementById('orderTotal');
let cart = JSON.parse(localStorage.getItem('order')) || [];

renderCart();

function renderCart() {
    orderList.innerHTML = '';
    orderTotal.textContent = '';
    let total = 0;

    if (cart.length === 0) {
        orderList.innerHTML = '<p>Ваш кошик порожній.</p>';
        document.querySelector('.confirm-btn').disabled = true;
        return;
    }

    cart.forEach((item, index) => {
        total += item.price * item.quantity;

        const itemDiv = document.createElement('div');
        itemDiv.className = 'order-item';
        itemDiv.innerHTML = `
      <img src="${item.image}" alt="${item.title}">
      <div class="order-item-details">
        <strong>${item.title}</strong><br>
        Ціна: ₴${item.price.toFixed(2)}<br>
        Кількість: ${item.quantity}
      </div>
      <button class="delete-btn" onclick="removeItem(${index})">&times;</button>
    `;
        orderList.appendChild(itemDiv);
    });

    orderTotal.textContent = `Загальна сума: ₴${total.toFixed(2)}`;
    document.querySelector('.confirm-btn').disabled = false;
}

function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem('order', JSON.stringify(cart));
    renderCart();
}

function confirmOrder(event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();

    if (!name || !phone || !address) {
        alert('Будь ласка, заповніть всі поля для оформлення замовлення.');
        return;
    }

    const button = document.querySelector('.confirm-btn');
    button.textContent = 'Замовлення прийнято!';
    button.disabled = true;

    setTimeout(() => {
        localStorage.removeItem('order');
        window.location.href = 'index.html';
    }, 1500);
}


document.getElementById('menu-toggle').addEventListener('click', function () {
    this.classList.toggle('open');
    document.getElementById('nav-menu').classList.toggle('active');
});