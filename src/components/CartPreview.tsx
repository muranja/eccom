/**
 * ============================================================================
 * CART PREVIEW COMPONENT
 * ============================================================================
 * 
 * A slide-in drawer that displays cart contents with a quick preview.
 * Shows product names, quantities, prices, and total.
 * 
 * USAGE:
 *   <CartPreview client:load />
 * 
 * ============================================================================
 */

import React from 'react';
import { useStore } from '@nanostores/react';
import {
    cartItems,
    cartTotal,
    cartCount,
    isCartPreviewOpen,
    closeCartPreview,
    removeCartItem,
    type CartItem,
} from '../stores/cartStore';

export const CartPreview: React.FC = () => {
    const $isOpen = useStore(isCartPreviewOpen);
    const $cartItems = useStore(cartItems);
    const $cartTotal = useStore(cartTotal);
    const $cartCount = useStore(cartCount);

    const items = Object.values($cartItems) as CartItem[];

    if (!$isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            closeCartPreview();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end"
            onClick={handleBackdropClick}
        >
            {/* Drawer */}
            <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-slide-in-right">
                {/* Header */}
                <div className="bg-emerald-600 text-white p-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
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
                        <h2 className="text-xl font-bold">
                            Your Cart ({$cartCount})
                        </h2>
                    </div>
                    <button
                        onClick={closeCartPreview}
                        className="text-white hover:text-gray-200 text-2xl font-bold"
                        aria-label="Close cart preview"
                    >
                        ×
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-4">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center py-12">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-24 w-24 text-gray-300 mb-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                />
                            </svg>
                            <p className="text-gray-600 text-lg font-semibold mb-2">
                                Your cart is empty
                            </p>
                            <p className="text-gray-400 text-sm">
                                Add some products to get started!
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100 hover:border-emerald-200 transition-colors"
                                >
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1">
                                            {item.name}
                                        </h3>
                                        <p className="text-xs text-gray-600">
                                            Qty: {item.quantity} × KES{' '}
                                            {item.price.toLocaleString()}
                                        </p>
                                        <p className="text-sm font-bold text-emerald-600 mt-1">
                                            KES{' '}
                                            {(
                                                item.price * item.quantity
                                            ).toLocaleString()}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => removeCartItem(item.id)}
                                        className="text-red-500 hover:text-red-700 text-xs font-medium px-2"
                                        aria-label={`Remove ${item.name}`}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer - Total & Actions */}
                {items.length > 0 && (
                    <div className="border-t border-gray-200 p-4 bg-gray-50">
                        {/* Total */}
                        <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                            <span className="text-lg font-bold text-gray-900">
                                Total:
                            </span>
                            <span className="text-2xl font-extrabold text-emerald-600">
                                KES {$cartTotal.toLocaleString()}
                            </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-2">
                            <a
                                href="/checkout"
                                className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg text-center transition-colors"
                            >
                                Proceed to Checkout
                            </a>
                            <button
                                onClick={closeCartPreview}
                                className="block w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-lg border border-gray-300 transition-colors"
                            >
                                Continue Shopping
                            </button>
                        </div>

                        <p className="text-xs text-center text-gray-600 mt-3">
                            <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                            FREE Delivery within Nairobi CBD
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
