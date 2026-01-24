import { createCheckout } from './shopify_client.js';

console.log("Ramen Zoo App Initialized");

// Header Scroll Effect
const header = document.querySelector('.site-header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});
// Scroll Animations using Intersection Observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Only animate once
        }
    });
}, observerOptions);

document.querySelectorAll('.product-card').forEach(card => {
    observer.observe(card);
});

// Quick View Modal Logic
const modal = document.getElementById('productModal');
const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const closeModal = document.querySelector('.modal-close');
const atcButtons = document.querySelectorAll('.add-to-cart');

// Open Modal on "Add to Cart" click (simulating logic for now)
atcButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Prevent default if form submit etc (none here)
        e.stopPropagation(); // Don't trigger card click if we had one

        // Find parent card data
        const card = btn.closest('.product-card');
        const title = card.querySelector('h3').innerText;
        const imgSrc = card.querySelector('img').src;

        // Populate Modal
        modalTitle.innerText = title;
        modalImg.src = imgSrc;

        // Show Modal
        modal.classList.add('active');
    });
});

// Close Logic
closeModal.addEventListener('click', () => {
    modal.classList.remove('active');
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
    }
});

// --- CART LOGIC ---
const cartIcon = document.getElementById('cartIcon');
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const cartClose = document.querySelector('.cart-close');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotalEl = document.getElementById('cartTotal');
const cartBadge = document.querySelector('.cart-badge');
const addToCartModalBtn = document.querySelector('.modal-cta');

// Load Cart from Storage
let cart = JSON.parse(localStorage.getItem('ramenZooCart')) || [];
if (cart.length > 0) {
    renderCart(); // Render immediately if items exist
}

// Open/Close Drawer
function toggleCart(show) {
    if (show) {
        cartDrawer.classList.add('active');
        cartOverlay.classList.add('active');
    } else {
        cartDrawer.classList.remove('active');
        cartOverlay.classList.remove('active');
    }
}

cartIcon.addEventListener('click', (e) => {
    e.preventDefault();
    toggleCart(true);
});

cartClose.addEventListener('click', () => toggleCart(false));
cartOverlay.addEventListener('click', () => toggleCart(false));

// Add to Cart Function
function addToCart(product) {
    cart.push(product);
    renderCart();
    toggleCart(true); // Open drawer which confirms addition
    modal.classList.remove('active'); // Close modal
}

// Render Cart UI
function renderCart() {
    // 1. Update Badge
    cartBadge.innerText = cart.length;

    // 2. Update Items
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart-message">Your noodle bowl is empty.</div>';
        cartTotalEl.innerText = '$0.00';
        return;
    }

    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;
        const itemEl = document.createElement('div');
        itemEl.classList.add('cart-item');
        itemEl.innerHTML = `
            <img src="${item.image}" alt="${item.title}" />
            <div class="cart-item-details">
                <div class="cart-item-title">${item.title}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-item-size">Size: ${item.size}</div>
                <button class="cart-item-remove" data-index="${index}">Remove</button>
            </div>
        `;
        cartItemsContainer.appendChild(itemEl);
    });

    // 3. Update Total
    cartTotalEl.innerText = '$' + total.toFixed(2);

    // 4. Attach Remove Listeners
    document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            cart.splice(index, 1);
            renderCart();
        });
    });
    // 5. Save to Storage
    localStorage.setItem('ramenZooCart', JSON.stringify(cart));
}

// Handle "Add to Cart" from Modal
addToCartModalBtn.addEventListener('click', () => {
    const title = document.getElementById('modalTitle').innerText;
    const priceText = document.getElementById('modalPrice').innerText;
    const price = parseFloat(priceText.replace('$', ''));
    const image = document.getElementById('modalImg').src;

    // Get Selected Size
    let size = 'M'; // Default
    const selectedSizeBtn = document.querySelector('.sizes button.selected');
    if (selectedSizeBtn) {
        size = selectedSizeBtn.innerText;
    }

    const product = {
        title,
        price,
        image,
        size
    };

    addToCart(product);
});

// Size Selection Logic in Modal
document.querySelectorAll('.sizes button').forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Clear previous
        document.querySelectorAll('.sizes button').forEach(b => b.classList.remove('selected'));
        // Select clicked
        e.target.classList.add('selected');
    });
});
