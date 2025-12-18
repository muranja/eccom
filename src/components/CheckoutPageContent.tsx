/**
 * ============================================================================
 * CHECKOUT PAGE CONTENT (React Island)
 * ============================================================================
 * 
 * This component renders the full checkout page content.
 * It reads cart state, displays payment instructions, and handles the
 * "I Have Paid" -> "Call to Confirm" flow.
 * 
 * MUST be rendered with `client:load` in Astro.
 * 
 * ============================================================================
 */

import React, { useState } from 'react';
import { useStore } from '@nanostores/react';
import { cartItems, cartTotal, removeCartItem, clearCart, type CartItem } from '../stores/cartStore';

// ============================================================================
// CONFIGURATION (Replace with your actual details)
// ============================================================================
const PAYBILL_NUMBER = '247247';
const ACCOUNT_NAME = 'TECH-STORE';
const PHONE_NUMBER = '254714389231';

export const CheckoutPageContent: React.FC = () => {
    const $cartItems = useStore(cartItems);
    const $cartTotal = useStore(cartTotal);
    const [hasPaid, setHasPaid] = useState(false);

    const items = Object.values($cartItems) as CartItem[];

    const handleCall = () => {
        window.location.href = `tel:+${PHONE_NUMBER}`;
    };

    const handleWhatsApp = () => {
        let message = `✅ *New Order Request*\n\nI would like to purchase:\n\n`;
        items.forEach((item, i) => {
            message += `${i + 1}. ${item.name} (x${item.quantity}) @ KES ${item.price.toLocaleString()}\n`;
        });
        message += `\n💳 *TOTAL: KES ${$cartTotal.toLocaleString()}*\n\n`;
        message += `I have made the payment. Please confirm.`;

        const encoded = encodeURIComponent(message);
        window.open(`https://wa.me/${PHONE_NUMBER}?text=${encoded}`, '_blank');
    };

    return (
        <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-black text-slate-900 mb-2">🛒 Checkout</h1>
                <p className="text-gray-600">Review your order and complete payment</p>
            </div>

            {/* Empty Cart State */}
            {items.length === 0 && (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                    <div className="text-6xl mb-4">🛒</div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
                    <p className="text-gray-600 mb-6">Add some products to get started</p>
                    <a
                        href="/"
                        className="inline-block bg-emerald-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-600 transition-colors"
                    >
                        Browse Products
                    </a>
                </div>
            )}

            {/* Cart Items */}
            {items.length > 0 && (
                <>
                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6">
                        <div className="p-4 bg-slate-50 border-b border-gray-100">
                            <h2 className="font-bold text-slate-900">Order Summary</h2>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {items.map(item => (
                                <div key={item.id} className="p-4 flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold text-slate-900">{item.name}</p>
                                        <p className="text-sm text-gray-600">
                                            Qty: {item.quantity} × KES {item.price.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="font-bold text-slate-900">
                                            KES {(item.price * item.quantity).toLocaleString()}
                                        </span>
                                        <button
                                            onClick={() => removeCartItem(item.id)}
                                            className="text-red-500 hover:text-red-700 text-sm"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 bg-slate-50 border-t border-gray-100 flex justify-between items-center">
                            <span className="font-bold text-lg">Total:</span>
                            <span className="font-black text-2xl text-emerald-600">
                                KES {$cartTotal.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    {/* Free Delivery Banner */}
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 mb-6 text-center">
                        <span className="text-emerald-700 font-semibold">
                            🚚 FREE Delivery within Nairobi CBD
                        </span>
                    </div>

                    {/* Payment Instructions (shown before payment confirmation) */}
                    {!hasPaid && (
                        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 mb-6">
                            <h3 className="font-bold text-slate-900 text-lg mb-4">📝 Payment Instructions</h3>
                            <ol className="space-y-3 text-gray-700">
                                <li className="flex gap-3">
                                    <span className="bg-amber-200 text-amber-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                                    <span>Open <strong>M-Pesa</strong> on your phone</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="bg-amber-200 text-amber-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                                    <span>Go to <strong>Lipa na M-Pesa</strong> → <strong>Paybill</strong></span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="bg-amber-200 text-amber-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                                    <span>Business Number: <strong className="text-slate-900 bg-amber-100 px-2 py-0.5 rounded">{PAYBILL_NUMBER}</strong></span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="bg-amber-200 text-amber-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
                                    <span>Account Number: <strong className="text-slate-900 bg-amber-100 px-2 py-0.5 rounded">{ACCOUNT_NAME}</strong></span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="bg-amber-200 text-amber-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">5</span>
                                    <span>Amount: <strong className="text-slate-900 bg-amber-100 px-2 py-0.5 rounded">KES {$cartTotal.toLocaleString()}</strong></span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="bg-amber-200 text-amber-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">6</span>
                                    <span>Enter your <strong>M-Pesa PIN</strong> to confirm</span>
                                </li>
                            </ol>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-4">
                        {!hasPaid ? (
                            <button
                                onClick={() => setHasPaid(true)}
                                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 px-6 rounded-xl transition-colors text-lg shadow-lg"
                            >
                                ✅ I Have Paid
                            </button>
                        ) : (
                            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-3xl">✓</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">Payment Received!</h3>
                                    <p className="text-gray-600">Now contact us to confirm your order:</p>
                                </div>

                                <div className="space-y-3">
                                    <button
                                        onClick={handleCall}
                                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-3"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                        </svg>
                                        Call to Confirm
                                    </button>

                                    <button
                                        onClick={handleWhatsApp}
                                        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-3"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                        </svg>
                                        Confirm via WhatsApp
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Continue Shopping Link */}
                        <a
                            href="/"
                            className="block text-center text-gray-500 hover:text-emerald-600 transition-colors py-2"
                        >
                            ← Continue Shopping
                        </a>
                    </div>
                </>
            )}
        </div>
    );
};
