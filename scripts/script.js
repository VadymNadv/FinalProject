document.addEventListener("DOMContentLoaded", () => {
    // акордеон
    const questions = document.querySelectorAll(".faq-question");

    questions.forEach((btn) => {
        btn.addEventListener("click", () => {
            questions.forEach((q) => {
                if (q !== btn) {
                    q.classList.remove("active");
                    q.nextElementSibling.style.display = "none";
                }
            });

            btn.classList.toggle("active");
            const answer = btn.nextElementSibling;
            answer.style.display = btn.classList.contains("active") ? "block" : "none";
        });
    });

    // КРУСЕЛЬ
    const carousel = document.querySelector(".carousel");
    let currentImageIndex = 0;

    if (carousel) {
        async function fetchImages() {
            try {
                const res = await fetch("https://fakestoreapi.com/products");
                const data = await res.json();
                renderCarouselImages(data);
            } catch (error) {
                console.error("Помилка завантаження продуктів:", error);
            }
        }

        function renderCarouselImages(products) {
            carousel.innerHTML = "";
            const selectedProducts = products.slice(0, 5);

            selectedProducts.forEach((product) => {
                const imgElement = document.createElement("img");
                imgElement.src = product.image;
                imgElement.alt = product.title;
                imgElement.classList.add("carousel-image");
                carousel.appendChild(imgElement);
            });

            updateActiveImage();
        }

        function updateActiveImage() {
            const images = document.querySelectorAll(".carousel-image");
            images.forEach((img, index) => {
                img.classList.toggle("active", index === currentImageIndex);
            });
        }

        function changeCarouselImage(direction) {
            const images = document.querySelectorAll(".carousel-image");
            currentImageIndex = (currentImageIndex + direction + images.length) % images.length;
            updateActiveImage();
        }

        fetchImages();


        const prevBtn = document.querySelector(".carousel-prev");
        const nextBtn = document.querySelector(".carousel-next");

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener("click", () => changeCarouselImage(-1));
            nextBtn.addEventListener("click", () => changeCarouselImage(1));
        }
    }

    // SWIPER
    const swiperEl = document.querySelector(".mySwiper");

    if (swiperEl) {
        new Swiper(".mySwiper", {
            loop: true,
            spaceBetween: 20,
            centeredSlides: true,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
        });
    } else {
        console.warn("Swiper container (.mySwiper) not found");
    }

    //  Анімація
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            } else {
                entry.target.classList.remove("visible");
            }
        });
    }, {
        threshold: 0.5
    });

    document.querySelectorAll('body *:not(.swiper *)').forEach(el => {
        el.classList.add('reveal-all');
        revealObserver.observe(el);
    });


    // === Картки
    const cards = document.querySelectorAll(".card");
    cards.forEach((card) => revealObserver.observe(card));

    window.changeImage = function(index) {
        const images = document.querySelectorAll(".image-wrapper img");
        const cards = document.querySelectorAll(".card");

        images.forEach((img, i) => {
            img.classList.toggle("active", i === index);
        });

        cards.forEach((card, i) => {
            card.classList.toggle("active", i === index);
        });
    };
});



document.getElementById('menu-toggle').addEventListener('click', function () {
    this.classList.toggle('open');
    document.getElementById('nav-menu').classList.toggle('active');
});