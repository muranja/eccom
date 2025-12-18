/**
 * ============================================================================
 * CART ICON COMPONENT
 * ============================================================================
 * 
 * Navigation component that displays cart count badge and links to checkout.
 * Uses Nano Stores for reactive cart count.
 * 
 * ============================================================================
 */

import React from 'react';
import { useStore } from '@nanostores/react';
import { cartCount } from '../stores/cartStore';

export const CartIcon: React.FC = () => {
    const $cartCount = useStore(cartCount);

    return (
        <a
            href="/checkout"
            className="relative p-2 text-gray-600 hover:text-emerald-600 transition-colors flex items-center gap-2"
            aria-label={`Cart with ${$cartCount} items`}
        >
            <span className="font-bold hidden sm:inline">Cart</span>
            <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {$cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
                        {$cartCount}
                    </span>
                )}
            </div>
        </a>
    );
};
