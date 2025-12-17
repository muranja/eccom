/**
 * ============================================================================
 * ADD TO CART BUTTON COMPONENT
 * ============================================================================
 * 
 * An interactive React component that adds products to the cart.
 * Must be rendered with `client:load` directive in Astro for hydration.
 * 
 * USAGE IN ASTRO:
 *   <AddToCartButton client:load product={{ id: 'abc', name: 'Phone', price: 1000 }} />
 * 
 * ============================================================================
 */

import React from 'react';
import { addCartItem } from '../stores/cartStore';
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
 * Displays visual feedback on click (scale animation).
 */
export const AddToCartButton: React.FC<AddToCartButtonProps> = ({ product }) => {
    const handleClick = () => {
        console.log('Adding to cart:', product);
        addCartItem(product as Product);
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
