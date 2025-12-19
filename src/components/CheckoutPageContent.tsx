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
import { FaWhatsapp } from 'react-icons/fa';
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

    // UI States
    const [hasPaid, setHasPaid] = useState(false); // Legacy: Manual confirm
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const items = Object.values($cartItems) as CartItem[];

    const WEBHOOK_URL = import.meta.env.PUBLIC_N8N_WEBHOOK_URL || 'https://gatuyu.duckdns.org/webhook-test/21dc22f4-26d8-4122-8b6a-d9c33c85df1c';

    const handleCall = () => {
        window.location.href = `tel:+${PHONE_NUMBER}`;
    };

    const handleWhatsApp = () => {
        let message = `✅ *New Order Reference*\n\nI would like to purchase:\n\n`;
        items.forEach((item, i) => {
            message += `${i + 1}. ${item.name} (x${item.quantity}) @ KES ${item.price.toLocaleString()}\n`;
        });
        message += `\n💳 *TOTAL: KES ${$cartTotal.toLocaleString()}*\n`;
        message += `📞 Customer: ${phoneNumber}\n\n`;
        message += `I have placed the order. Please confirm.`;

        const encoded = encodeURIComponent(message);
        window.open(`https://wa.me/${PHONE_NUMBER}?text=${encoded}`, '_blank');
    };

    const submitOrder = async () => {
        if (!phoneNumber || phoneNumber.length < 9) {
            setSubmitError('Please enter a valid phone number');
            return;
        }

        setIsSubmitting(true);
        setSubmitError('');

        const orderData = {
            items: items.map(i => ({ name: i.name, qty: i.quantity, price: i.price, id: i.id })),
            total: $cartTotal,
            customerPhone: phoneNumber,
            timestamp: new Date().toISOString()
        };

        try {
            // Send to n8n Webhook
            await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            setOrderPlaced(true);
            clearCart(); // Optional: clear cart or keep it until payment confirmed? Usually clear it.
            // Actually, keep cart for now or user loses context if they refresh. 
            // Let's NOT clear cart yet, wait for manual clear or assume success.
            // Better to clear it to prevent double order, but since we redirect...
            // Let's clear it.
            clearCart();

        } catch (error) {
            console.error("Order trigger failed", error);
            setSubmitError('Something went wrong. Please try again or contact us directly.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (orderPlaced) {
        return (
            <div className="max-w-xl mx-auto text-center py-12">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                    <span className="text-4xl">🎉</span>
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-4">Order Placed!</h2>
                <p className="text-gray-600 text-lg mb-8">
                    We have received your order. Please check your phone ({phoneNumber}) for an M-Pesa prompt to complete payment.
                </p>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8 text-left">
                    <h3 className="font-bold text-slate-900 mb-2">Didn't get a prompt?</h3>
                    <p className="text-gray-700 mb-4">
                        Don't worry! You can pay manually via Paybill:
                    </p>
                    <div className="space-y-2 font-mono text-sm">
                        <p>Paybill: <strong className="bg-white px-1 rounded">{PAYBILL_NUMBER}</strong></p>
                        <p>Account: <strong className="bg-white px-1 rounded">{ACCOUNT_NAME}</strong></p>
                    </div>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={handleWhatsApp}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                        <FaWhatsapp className="w-6 h-6" />
                        Chat on WhatsApp
                    </button>
                    <button
                        onClick={handleCall}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-3"
                    >
                        Call to Confirm
                    </button>
                    <a href="/" className="block text-emerald-600 font-semibold hover:underline mt-6">
                        Return to Shop
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-black text-slate-900 mb-2">Checkout</h1>
                <p className="text-gray-600">Secure M-Pesa Payment</p>
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
                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6 shadow-sm">
                        <div className="p-4 bg-slate-50 border-b border-gray-100">
                            <h2 className="font-bold text-slate-900">Order Summary</h2>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {items.map(item => (
                                <div key={item.id} className="p-4 flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold text-slate-900">{item.name}</p>
                                        <p className="text-sm text-gray-600">
                                            {item.quantity} x KES {item.price.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="font-bold text-slate-900">
                                            KES {(item.price * item.quantity).toLocaleString()}
                                        </span>
                                        <button
                                            onClick={() => removeCartItem(item.id)}
                                            className="text-red-500 hover:text-red-700 text-sm p-1"
                                            aria-label="Remove item"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 bg-slate-50 border-t border-gray-100 flex justify-between items-center">
                            <span className="font-bold text-lg">Total To Pay:</span>
                            <span className="font-black text-2xl text-emerald-600">
                                KES {$cartTotal.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    {/* Trust Badges */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-blue-50 p-3 rounded-lg flex items-center justify-center gap-2 text-blue-800 text-sm font-semibold">
                            <span>🔒</span> Secure Payment
                        </div>
                        <div className="bg-emerald-50 p-3 rounded-lg flex items-center justify-center gap-2 text-emerald-800 text-sm font-semibold">
                            <span>⚡</span> Instant Delivery
                        </div>
                    </div>

                    {/* Checkout Form */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                        <h3 className="font-bold text-lg text-slate-900 mb-4">M-Pesa Express Checkout</h3>

                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Phone Number (M-Pesa)
                            </label>
                            <input
                                type="tel"
                                placeholder="0712 345 678"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-lg transition-all"
                            />
                            {submitError && (
                                <p className="text-red-500 text-sm mt-2">{submitError}</p>
                            )}
                        </div>

                        <button
                            onClick={submitOrder}
                            disabled={isSubmitting}
                            className={`w-full py-4 px-6 rounded-xl font-bold text-white text-lg transition-all shadow-lg flex items-center justify-center gap-3
                                ${isSubmitting
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-emerald-600 hover:bg-emerald-700 hover:-translate-y-1'
                                }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <span>Pay KES {$cartTotal.toLocaleString()}</span>
                                    <span>→</span>
                                </>
                            )}
                        </button>

                        <p className="text-center text-xs text-gray-500 mt-4">
                            You will receive an M-Pesa prompt on your phone to complete payment.
                        </p>
                    </div>
                </>
            )}
        </div>
    );
};
