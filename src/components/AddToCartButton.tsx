
import React from 'react';
import { addCartItem } from '../stores/cartStore';
import { analytics } from '../utils/analytics';
import { showToast } from './Toast';
import type { Product } from '../data/products';

/**
 * Props for the AddToCartButton component.
 * Requires at minimum: id, name, and price.
 */
interface AddToCartButtonProps {
    product: Pick<Product, 'id' | 'name' | 'price'>;
}

/**
 * Interactive button that adds a product to the shopping cart.
 * Displays visual feedback on click (scale animation + toast notification).
 */
export const AddToCartButton: React.FC<AddToCartButtonProps> = ({ product }) => {
    const handleClick = () => {
        console.log('Adding to cart:', product);

        // Add to cart
        addCartItem(product as Product);

        // Track analytics
        analytics.trackAddToCart(product.id, product.name, product.price);

        // Show success toast
        showToast(`${product.name} added to cart!`, 'success');
    };

    return (
        <button
            onClick={handleClick}
            className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600 w-full font-semibold shadow-sm transition-all active:scale-95"
        >
            Add to Cart
        </button>
    );
};
