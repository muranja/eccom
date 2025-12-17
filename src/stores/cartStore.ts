/**
 * ============================================================================
 * CART STATE MANAGEMENT (Nano Stores)
 * ============================================================================
 * 
 * This module manages the shopping cart state using Nano Stores.
 * It provides reactive state that works with React components in Astro.
 * 
 * KEY FEATURES:
 *   - Persistent storage (survives page refresh via localStorage)
 *   - Computed values for totals (auto-update when cart changes)
 *   - SSR-safe (works with Astro's static rendering)
 * 
 * USAGE IN REACT COMPONENTS:
 *   import { useStore } from '@nanostores/react';
 *   import { cartItems, cartCount, addCartItem } from '../stores/cartStore';
 *   
 *   const $cartItems = useStore(cartItems);
 *   const $count = useStore(cartCount);
 * 
 * EXTENDING:
 *   To add new cart features (e.g., discounts), add new computed stores.
 * 
 * ============================================================================
 */

import { atom, computed } from 'nanostores';
import type { Product } from '../data/products';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Shape of a single cart item.
 * Extends Product with quantity for cart-specific needs.
 */
export interface CartItem {
    /** Unique product identifier */
    id: string;
    /** Product display name */
    name: string;
    /** Unit price in KES */
    price: number;
    /** Quantity in cart */
    quantity: number;
}

/** Cart state is a record of product IDs to CartItems */
type CartState = Record<string, CartItem>;

// ============================================================================
// PERSISTENCE HELPERS
// ============================================================================

const STORAGE_KEY = 'phoneshop_cart';

/**
 * Load cart from localStorage (SSR-safe).
 */
function loadCart(): CartState {
    if (typeof window === 'undefined') return {};
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : {};
    } catch {
        return {};
    }
}

/**
 * Save cart to localStorage.
 */
function saveCart(cart: CartState): void {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
        // Ignore storage errors
    }
}

// ============================================================================
// STORE
// ============================================================================

/**
 * STORE: Cart Items
 * 
 * An atom holding the cart state. Auto-persists to localStorage.
 */
export const cartItems = atom<CartState>(loadCart());

// Subscribe to changes and persist
cartItems.subscribe((cart) => {
    saveCart(cart);
});

// ============================================================================
// ACTIONS
// ============================================================================

/**
 * ACTION: Add Item to Cart
 * 
 * Adds a product to the cart or increments quantity if already present.
 * 
 * @param product - The product to add (must have id, name, price)
 */
export function addCartItem(product: Pick<Product, 'id' | 'name' | 'price'>) {
    const cart = cartItems.get();
    const existing = cart[product.id];

    if (existing) {
        // Increment quantity
        cartItems.set({
            ...cart,
            [product.id]: {
                ...existing,
                quantity: existing.quantity + 1,
            },
        });
    } else {
        // Add new item
        cartItems.set({
            ...cart,
            [product.id]: {
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
            },
        });
    }
}

/**
 * ACTION: Remove Item from Cart
 * 
 * Decreases quantity by 1, or removes item if quantity becomes 0.
 * 
 * @param productId - The ID of the product to remove
 */
export function removeCartItem(productId: string) {
    const cart = cartItems.get();
    const existing = cart[productId];

    if (!existing) return;

    if (existing.quantity > 1) {
        cartItems.set({
            ...cart,
            [productId]: {
                ...existing,
                quantity: existing.quantity - 1,
            },
        });
    } else {
        // Remove item entirely
        const { [productId]: _, ...rest } = cart;
        cartItems.set(rest);
    }
}

/**
 * ACTION: Clear Cart
 * 
 * Removes all items from the cart.
 */
export function clearCart() {
    cartItems.set({});
}

// ============================================================================
// COMPUTED VALUES
// ============================================================================

/**
 * COMPUTED: Total Price
 * 
 * Automatically recalculates when cart changes.
 */
export const cartTotal = computed(cartItems, (items) => {
    return Object.values(items).reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
});

/**
 * COMPUTED: Total Item Count
 * 
 * For displaying badge on cart icon.
 */
export const cartCount = computed(cartItems, (items) => {
    return Object.values(items).reduce(
        (sum, item) => sum + item.quantity,
        0
    );
});

// ============================================================================
// CART PREVIEW STATE
// ============================================================================

/**
 * STORE: Cart Preview Open State
 * 
 * Controls visibility of the cart preview drawer/modal.
 */
export const isCartPreviewOpen = atom<boolean>(false);

/**
 * ACTION: Open Cart Preview
 */
export function openCartPreview() {
    isCartPreviewOpen.set(true);
}

/**
 * ACTION: Close Cart Preview
 */
export function closeCartPreview() {
    isCartPreviewOpen.set(false);
}

/**
 * ACTION: Toggle Cart Preview
 */
export function toggleCartPreview() {
    isCartPreviewOpen.set(!isCartPreviewOpen.get());
}
