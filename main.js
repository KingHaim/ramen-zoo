import { createCheckout, fetchAllProducts } from './shopify_client.js';

console.log("Ramen Zoo App Initialized");

// Global Products Cache
let allProducts = [];

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


// --- DYNAMIC PRODUCT LOADING ---
async function initShop() {
    try {
        console.log("Fetching products...");
        allProducts = await fetchAllProducts();
        console.log("Products fetched:", allProducts);
        renderProducts(allProducts);
    } catch (error) {
        console.error("Failed to fetch products:", error);
        document.getElementById('productGrid').innerHTML = '<p>Error loading menu. Please check console.</p>';
    }
}

function renderProducts(products) {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = '';

    products.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('product-card');

        // Use first image or placeholder
        const imageSrc = product.images[0] ? product.images[0].src : '/logo.webp';
        // Use min price
        const price = product.variants[0].price.amount;
        const currency = product.variants[0].price.currencyCode; // usually USD

        card.innerHTML = `
            <img src="${imageSrc}" alt="${product.title}" class="card-image" />
            <div class="card-details">
                <h3>${product.title}</h3>
                <p>$${parseFloat(price).toFixed(2)}</p>
                <button class="add-to-cart" data-id="${product.id}">ADD TO CART</button>
            </div>
        `;

        grid.appendChild(card);
        observer.observe(card);
    });

    attachCardListeners();
}


// Quick View Modal Logic
const modal = document.getElementById('productModal');
const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalPrice = document.getElementById('modalPrice');
const modalDesc = document.querySelector('.modal-desc');
const closeModal = document.querySelector('.modal-close');
const sizeContainer = document.querySelector('.sizes');

// Current Selected Product State
let currentProduct = null;
let currentVariant = null;

function attachCardListeners() {
    const productCardButtons = document.querySelectorAll('.product-card .add-to-cart');

    productCardButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();

            const productId = btn.dataset.id;
            currentProduct = allProducts.find(p => p.id === productId);

            if (!currentProduct) return;

            openModal(currentProduct);
        });
    });
}

function openModal(product) {
    // Populate Modal
    modalTitle.innerText = product.title;

    const imageSrc = product.images[0] ? product.images[0].src : '/logo.webp';
    modalImg.src = imageSrc;

    const price = product.variants[0].price.amount;
    modalPrice.innerText = '$' + parseFloat(price).toFixed(2);

    modalDesc.innerText = product.description || "Fresh style served daily.";

    // Render Sizes (Options)
    // We assume the first option is 'Size' or similar. 
    // Ideally we check product.options to see which one is Size.

    // Find the "Size" option if it exists
    const sizeOption = product.options.find(opt => opt.name === 'Size' || opt.name === 'Title');
    // 'Title' happens if there's only 'Default Title'

    sizeContainer.innerHTML = '';

    if (sizeOption && sizeOption.name !== 'Title') {
        sizeOption.values.forEach(value => { // value is just a string like "S", "M"
            const btn = document.createElement('button');
            btn.innerText = value;
            btn.addEventListener('click', handleSizeSelect);
            sizeContainer.appendChild(btn);
        });

        // Select first by default
        if (sizeContainer.firstChild) {
            sizeContainer.firstChild.classList.add('selected');
        }
    } else {
        // No options or just Default Title
        sizeContainer.innerHTML = '<span style="font-size:0.8rem; color: #666;">One Size / Standard</span>';
    }

    // Show Modal
    modal.classList.add('active');
}

function handleSizeSelect(e) {
    // Clear previous
    document.querySelectorAll('.sizes button').forEach(b => b.classList.remove('selected'));
    // Select clicked
    e.target.classList.add('selected');
}

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
function addToCart(productSubset) {
    cart.push(productSubset);
    renderCart();
    toggleCart(true);
    modal.classList.remove('active');
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
    if (!currentProduct) return;

    // Determine selected variant based on size
    // 1. Find selected size string
    const selectedSizeBtn = document.querySelector('.sizes button.selected');
    let selectedSize = selectedSizeBtn ? selectedSizeBtn.innerText : null;

    // 2. Find matching variant
    let selectedVariant;

    if (selectedSize) {
        // Look for variant where an option value matches selectedSize
        selectedVariant = currentProduct.variants.find(v => {
            return v.selectedOptions.some(opt => opt.value === selectedSize);
        });
    } else {
        // Fallback to first variant if no options or selection
        selectedVariant = currentProduct.variants[0];
        selectedSize = "One Size";
    }

    if (!selectedVariant || (selectedVariant.available === false)) {
        alert("Sorry, this item is currently out of stock.");
        return;
    }

    const price = parseFloat(selectedVariant.price.amount);

    const productSubset = {
        title: currentProduct.title,
        price: price,
        image: currentProduct.images[0] ? currentProduct.images[0].src : '',
        size: selectedSize,
        variantId: selectedVariant.id // CRITICAL for checkout
    };

    addToCart(productSubset);
});


// Checkout Button Logic
document.querySelector('.checkout-btn').addEventListener('click', async () => {
    const checkoutBtn = document.querySelector('.checkout-btn');
    const originalText = checkoutBtn.innerText;

    checkoutBtn.innerText = "LOADING...";
    checkoutBtn.disabled = true;

    try {
        const url = await createCheckout(cart);

        if (url) {
            window.location.href = url;
        } else {
            throw new Error("No checkout URL returned");
        }
    } catch (e) {
        console.error(e);
        checkoutBtn.innerText = originalText;
        checkoutBtn.disabled = false;
        alert("Failed to proceed to checkout.");
    }
});


// --- MOBILE MENU ---
const mobileMenuBtn = document.getElementById('mobileMenuToggle');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
const mobileMenuCloseBtn = document.getElementById('mobileMenuClose');
const mobileLinks = document.querySelectorAll('.mobile-link');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    });
}

function closeMobileMenu() {
    if (mobileMenuOverlay) {
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

if (mobileMenuCloseBtn) {
    mobileMenuCloseBtn.addEventListener('click', closeMobileMenu);
}

mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

// INIT
initShop();
if (cart.length > 0) renderCart();
