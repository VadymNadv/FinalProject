const productId = new URLSearchParams(window.location.search).get('id');

fetch(`https://fakestoreapi.com/products/${productId}`)
    .then(res => res.json())
    .then(product => {
        document.getElementById('product-title').textContent = product.title;
        document.getElementById('product-description').textContent = product.description;
        document.getElementById('product-price').textContent = `$${product.price.toFixed(2)}`;

        const mainImage = document.getElementById('main-image');
        const thumbnails = document.getElementById('thumbnails');

        const baseImage = product.image;
        const images = [
            baseImage,
            `https://picsum.photos/seed/${product.id + 1}/600/600`,
            `https://picsum.photos/seed/${product.id + 2}/600/600`
        ];

        mainImage.src = images[0];

        images.forEach((imgSrc, index) => {
            const thumb = document.createElement('img');
            thumb.src = imgSrc;
            thumb.alt = `Product thumbnail ${index + 1}`;
            if (index === 0) thumb.classList.add('active');
            thumb.addEventListener('click', () => {
                mainImage.src = imgSrc;
                mainImage.alt = `Product image ${index + 1}`;
                document.querySelectorAll('.thumbnail-list img').forEach(el => el.classList.remove('active'));
                thumb.classList.add('active');
            });
            thumbnails.appendChild(thumb);
        });


        document.getElementById('add-to-cart').addEventListener('click', () => {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const existingItem = cart.find(item => item.id === product.id);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    image: product.image,
                    quantity: 1
                });
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            showToast('Товар додано в кошик!');
        });
    });

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}


document.getElementById('menu-toggle').addEventListener('click', function () {
    this.classList.toggle('open');
    document.getElementById('nav-menu').classList.toggle('active');
});