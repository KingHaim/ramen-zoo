# Ramen Zoo - Shopify Integration Setup

Currently, the application is using **Mock Data** because the Storefront API Access Token is missing or invalid.

To connect your real Shopify store:

## 1. Create a Private App in Shopify
1. Go to your Shopify Admin > **Settings** > **Apps and sales channels**.
2. Click **Develop apps**.
3. Click **Create an app**. Name it "Ramen Zoo Headless".
4. Click **Configure Storefront API scopes**.
5. Select `unauthenticated_read_product_listings` and `unauthenticated_read_product_inventory`.
6. Click **Save** and then **Install app**.

## 2. Get the Access Token
1. After installing, go to the **API credentials** tab.
2. Under "Storefront API access token", click **Reveal token once**.
3. **Copy** this token.

## 3. Update the Code
1. Open `shopify_client.js`.
2. Replace the `storefrontAccessToken` value with your new token.
3. Uncomment the code in `fetchAllProducts` (lines 75-83) to stop using Mock Data.

## 4. Add Products
Make sure your products in Shopify are:
- status: **Active**
- published to the **Headless** (or valid) sales channel.
