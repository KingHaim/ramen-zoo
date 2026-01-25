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
    storefrontAccessToken: 'b66c6329ce5df0f43419604189e80eaa'
});

// --- MOCK DATA ---
const MOCK_PRODUCTS = [
    {
        id: 'gid://shopify/Product/1',
        title: 'Short sleeve Gyoza Panda t-shirt',
        description: 'Premium cotton tee featuring our exclusive Gyoza Panda artwork. Deliciously stylish.',
        images: [{ src: './product_gyoza_panda.jpg' }],
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
        images: [{ src: './product_tiger.jpg' }],
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
        images: [{ src: './product_long_neck.jpg' }],
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
        id: 'gid://shopify/Product/3',
        title: 'Shoyu Sloth',
        description: 'Slow cooked to perfection. Take your time with the Shoyu Sloth tee.',
        images: [{ src: './product_sloth.jpg' }],
        options: [{ name: 'Size', values: ['S', 'M', 'L', 'XL'] }],
        variants: [
            { id: 'gid://shopify/ProductVariant/6', price: { amount: '35.00', currencyCode: 'EUR' }, selectedOptions: [{ name: 'Size', value: 'M' }] }
        ]
    }
];

export async function fetchAllProducts() {
    // Always return Mock Data for now as we don't have a token
    return MOCK_PRODUCTS;
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
