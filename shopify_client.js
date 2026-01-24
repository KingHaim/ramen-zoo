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

export async function createCheckout(cartItems) {
    if (cartItems.length === 0) return;

    try {
        // 1. Create an Empty Checkout (Proof of Life)
        const checkout = await client.checkout.create();

        console.log("Checkout created:", checkout.id);
        console.log("Redirecting to:", checkout.webUrl);

        // Note: We cannot add items yet because the 'variantId's in our code are fake.
        // For now, we just redirect to the empty checkout to prove the API works.

        return checkout.webUrl;

    } catch (error) {
        console.error("Shopify Error:", error);
        alert("Shopify Connection Error: " + error.message);
    }
}
