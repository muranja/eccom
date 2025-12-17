/**
 * ============================================================================
 * FLOATING CART BUTTON COMPONENT
 * ============================================================================
 * 
 * A persistent floating action button that displays cart count and opens
 * the cart preview when clicked.
 * 
 * USAGE IN ASTRO (Product Pages Only):
 *   <FloatingCartButton client:load />
 * 
 * ============================================================================
 */

import React from 'react';
import { useStore } from '@nanostores/react';
import { cartCount, toggleCartPreview } from '../stores/cartStore';

export const FloatingCartButton: React.FC = () => {
    const $cartCount = useStore(cartCount);

    return (
        <button
            onClick={toggleCartPreview}
            className="fixed bottom-20 right-4 md:bottom-6 md:right-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all z-40 group"
            aria-label="Open cart preview"
        >
            <div className="relative">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                </svg>
                {$cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                        {$cartCount}
                    </span>
                )}
            </div>

            {/* Tooltip */}
            <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                View Cart ({$cartCount})
            </span>
        </button>
    );
};
