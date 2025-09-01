// headless/storefront.ts
const API_URL = process.env.EXPO_PUBLIC_API_URL!;
const ACCESS_TOKEN = process.env.EXPO_PUBLIC_ACCESS_TOKEN!;

if (!API_URL || !ACCESS_TOKEN) {
  throw new Error("Missing Shopify API credentials. Set EXPO_PUBLIC_API_URL and EXPO_PUBLIC_ACCESS_TOKEN");
}

// Generic GraphQL request
export async function storefront(query: string, variables: Record<string, any> = {}) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": ACCESS_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Shopify API error: ${res.status} ${errorText}`);
  }

  const json = await res.json();
  if (json.errors) {
    console.error("GraphQL errors:", json.errors);
    throw new Error("Shopify GraphQL returned errors");
  }

  return json.data;
}

// --- CART API HELPERS ---

// Create a new empty cart
export async function createCart() {
  const query = `
    mutation {
      cartCreate {
        cart {
          id
          checkoutUrl
          totalQuantity
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    product { title }
                    price { amount currencyCode }
                    image { url altText }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;
  const data = await storefront(query);
  return data.cartCreate.cart;
}

// Add an item to a cart (creates cart if none exists)
export async function addToCart(variantId: string, quantity: number, goToCheckout = false) {
  // Check for existing cart in localStorage
  let cartId: string | null = typeof window !== 'undefined' ? localStorage.getItem('cartId') : null;

  if (!cartId) {
    // Create new cart
    const newCart = await createCart();
    cartId = newCart.id;
    if (typeof window !== 'undefined') {
      localStorage.setItem('cartId', cartId);
    }
  }

  // Add line to cart
  const mutation = `
    mutation addToCart($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          totalQuantity
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    product { title }
                    price { amount currencyCode }
                    image { url altText }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const variables = {
    cartId,
    lines: [{ merchandiseId: variantId, quantity }],
  };

  const data = await storefront(mutation, variables);
  return goToCheckout ? data.cartLinesAdd.cart.checkoutUrl : data.cartLinesAdd.cart;
}

// Get cart by ID
export async function getCart(cartId: string) {
  const query = `
    query getCart($cartId: ID!) {
      cart(id: $cartId) {
        id
        checkoutUrl
        totalQuantity
        lines(first: 10) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  product { title }
                  price { amount currencyCode }
                  image { url altText }
                }
              }
            }
          }
        }
      }
    }
  `;
  const data = await storefront(query, { cartId });
  return data.cart;
}

// Update quantity for a line
export async function updateCartQuantity(cartId: string, lineId: string, quantity: number) {
  const mutation = `
    mutation updateCart($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          totalQuantity
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    product { title }
                    price { amount currencyCode }
                    image { url altText }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;
  const variables = {
    cartId,
    lines: [{ id: lineId, quantity }],
  };
  const data = await storefront(mutation, variables);
  return data.cartLinesUpdate.cart;
}

// Remove lines from cart
export async function removeFromCart(cartId: string, lineIds: string[]) {
  const mutation = `
    mutation removeCartLines($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          id
          checkoutUrl
          totalQuantity
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    product { title }
                    price { amount currencyCode }
                    image { url altText }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;
  const variables = { cartId, lineIds };
  const data = await storefront(mutation, variables);
  return data.cartLinesRemove.cart;
}

// headless/storefront.ts
export const getCartItemCount = async (): Promise<number> => {
  const cartId = localStorage.getItem('cartId'); // Get cartId from localStorage
  if (!cartId) {
    return 0; // Return 0 if no cartId is found
  }

  try {
    const cart = await getCart(cartId); // Fetch cart using the cartId
    return cart.totalQuantity || 0; // Return the totalQuantity of items in the cart
  } catch (error) {
    console.error('Error fetching cart count:', error);
    return 0; // Return 0 in case of an error
  }
};
