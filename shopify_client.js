/*
    SHOPIFY INTEGRATION GUIDE
    -------------------------
    To go live, you need to:
    1. Create a Shopify Store (Starter Plan is fine).
    2. Create a Private App to get Storefront API Keys.
    3. Update the 'domain' and 'storefrontAccessToken' below.
*/

import Client from 'shopify-buy';

// Initialize Client
const client = Client.buildClient({
    domain: 'ramen-zoo.myshopify.com',
    storefrontAccessToken: 'de6a049a8fdddceb1e46e935f2e722ad'
});

// --- MOCK DATA ---
const MOCK_PRODUCTS = [
    {
        id: 'gid://shopify/Product/1',
        title: 'Gyoza Panda',
        description: 'Premium cotton tee featuring our exclusive Gyoza Panda artwork. Deliciously stylish.',
        images: [{ src: '/product_gyoza_panda.webp' }],
        options: [{ name: 'Size', values: ['S', 'M', 'L', 'XL', '2XL'] }],
        variants: [
            { id: '56834124677503', price: { amount: '35.00', currencyCode: 'EUR' }, selectedOptions: [{ name: 'Size', value: 'S' }] },
            { id: '56834124710271', price: { amount: '35.00', currencyCode: 'EUR' }, selectedOptions: [{ name: 'Size', value: 'M' }] },
            { id: '56834124743039', price: { amount: '35.00', currencyCode: 'EUR' }, selectedOptions: [{ name: 'Size', value: 'L' }] },
            { id: '56834124775807', price: { amount: '35.00', currencyCode: 'EUR' }, selectedOptions: [{ name: 'Size', value: 'XL' }] },
            { id: '56834124808575', price: { amount: '35.00', currencyCode: 'EUR' }, selectedOptions: [{ name: 'Size', value: '2XL' }] }
        ]
    },
    {
        id: 'gid://shopify/Product/2',
        title: 'Tonkotsu Tiger',
        description: 'Bold flavor, bold style. The Tonkotsu Tiger represents the rich depth of our designs.',
        images: [{ src: '/product_tiger.webp' }],
        options: [{ name: 'Size', values: ['S', 'M', 'L', 'XL', '2XL'] }],
        variants: [
            { id: '56835995631999', price: { amount: '35.00', currencyCode: 'EUR' }, selectedOptions: [{ name: 'Size', value: 'S' }] },
            { id: '56835995664767', price: { amount: '35.00', currencyCode: 'EUR' }, selectedOptions: [{ name: 'Size', value: 'M' }] },
            { id: '56835995697535', price: { amount: '35.00', currencyCode: 'EUR' }, selectedOptions: [{ name: 'Size', value: 'L' }] },
            { id: '56835995730303', price: { amount: '35.00', currencyCode: 'EUR' }, selectedOptions: [{ name: 'Size', value: 'XL' }] },
            { id: '56835995763071', price: { amount: '35.00', currencyCode: 'EUR' }, selectedOptions: [{ name: 'Size', value: '2XL' }] }
        ]
    },
    {
        id: 'gid://shopify/Product/3',
        title: 'Long Neck Noodle',
        description: 'Tall orders of flavor. The Long Neck Noodle tee is for those with elevated taste.',
        images: [{ src: '/product_long_neck.webp' }],
        options: [{ name: 'Size', values: ['S', 'M', 'L', 'XL', '2XL'] }],
        variants: [
            { id: '56836068934015', price: { amount: '35.00', currencyCode: 'EUR' }, selectedOptions: [{ name: 'Size', value: 'S' }] },
            { id: '56836068966783', price: { amount: '35.00', currencyCode: 'EUR' }, selectedOptions: [{ name: 'Size', value: 'M' }] },
            { id: '56836068999551', price: { amount: '35.00', currencyCode: 'EUR' }, selectedOptions: [{ name: 'Size', value: 'L' }] },
            { id: '56836069032319', price: { amount: '35.00', currencyCode: 'EUR' }, selectedOptions: [{ name: 'Size', value: 'XL' }] },
            { id: '56836069065087', price: { amount: '35.00', currencyCode: 'EUR' }, selectedOptions: [{ name: 'Size', value: '2XL' }] }
        ]
    },
    {
        id: 'gid://shopify/Product/4',
        title: 'Shoyu Sloth',
        description: 'Slow cooked to perfection. Take your time with the Shoyu Sloth tee.',
        images: [{ src: '/product_sloth.webp' }],
        options: [{ name: 'Size', values: ['S', 'M', 'L', 'XL', '2XL'] }],
        variants: [
            { id: '56836282843519', price: { amount: '35.00', currencyCode: 'EUR' }, selectedOptions: [{ name: 'Size', value: 'S' }] },
            { id: '56836282876287', price: { amount: '35.00', currencyCode: 'EUR' }, selectedOptions: [{ name: 'Size', value: 'M' }] },
            { id: '56836282909055', price: { amount: '35.00', currencyCode: 'EUR' }, selectedOptions: [{ name: 'Size', value: 'L' }] },
            { id: '56836282941823', price: { amount: '35.00', currencyCode: 'EUR' }, selectedOptions: [{ name: 'Size', value: 'XL' }] },
            { id: '56836282974591', price: { amount: '35.00', currencyCode: 'EUR' }, selectedOptions: [{ name: 'Size', value: '2XL' }] }
        ]
    },
    {
        id: 'gid://shopify/Product/5',
        title: 'Tanuki Tunes',
        description: 'Beats and treats. The Tanuki brings the rhythm of the street to your wardrobe.',
        images: [{ src: '/product_tanuki.webp' }],
        options: [{ name: 'Size', values: ['S', 'M', 'L', 'XL', '2XL'] }],
        variants: [
            { id: '56841343861119', price: { amount: '35.00', currencyCode: 'EUR' }, selectedOptions: [{ name: 'Size', value: 'S' }] },
            { id: '56841343893887', price: { amount: '35.00', currencyCode: 'EUR' }, selectedOptions: [{ name: 'Size', value: 'M' }] },
            { id: '56841343926655', price: { amount: '35.00', currencyCode: 'EUR' }, selectedOptions: [{ name: 'Size', value: 'L' }] },
            { id: '56841343959423', price: { amount: '35.00', currencyCode: 'EUR' }, selectedOptions: [{ name: 'Size', value: 'XL' }] },
            { id: '56841343992191', price: { amount: '35.00', currencyCode: 'EUR' }, selectedOptions: [{ name: 'Size', value: '2XL' }] }
        ]
    }
];

export async function fetchAllProducts() {
    // --- REAL SHOPIFY FETCH ---
    try {
        const products = await client.product.fetchAll();
        console.log("Fetched real products from Shopify:", products.length);
        return products;
    } catch (e) {
         console.error("Shopify Fetch Error:", e);
         return MOCK_PRODUCTS; // Fallback to mock data if fetch fails
    }
}

export async function createCheckout(cartItems) {
    if (cartItems.length === 0) return;

    // DIRECT CHECKOUT STRATEGY (Permalink)
    // Format: https://store-domain.com/cart/{variant_id}:{quantity},{variant_id}:{quantity}

    const cartParams = cartItems.map(item => {
        // Ensure we only have the numeric ID
        const id = String(item.variantId).replace('gid://shopify/ProductVariant/', '');
        return `${id}:1`; // Assuming quantity 1
    }).join(',');

    const checkoutUrl = `https://ramen-zoo.myshopify.com/cart/${cartParams}`;

    console.log("Generating Direct Checkout Link:", checkoutUrl);
    return checkoutUrl;
}
