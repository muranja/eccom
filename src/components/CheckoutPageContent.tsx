/**
 * ============================================================================
 * CHECKOUT PAGE CONTENT (React Island)
 * ============================================================================
 * 
 * WhatsApp-based checkout - no backend required!
 * Generates a pre-filled WhatsApp message with order details and M-Pesa instructions.
 * 
 * ============================================================================
 */

import React, { useState } from 'react';
import { useStore } from '@nanostores/react';
import { FaWhatsapp } from 'react-icons/fa';
import { FiMapPin, FiUser, FiShoppingBag, FiTrash2, FiLock, FiZap, FiCreditCard, FiPhone } from 'react-icons/fi';
import { cartItems, cartTotal, removeCartItem, clearCart, type CartItem } from '../stores/cartStore';

// ============================================================================
// CONFIGURATION
// ============================================================================
const PHONE_NUMBER = '254714389231';
const PAYBILL_NUMBER = '247247';
const ACCOUNT_NUMBER = '0714389231';

// Delivery locations (Nairobi areas)
const DELIVERY_LOCATIONS = [
    'Nairobi CBD',
    'Westlands',
    'Kilimani / Lavington',
    'South B / South C',
    'Eastlands (Buru, Umoja, Kayole)',
    'Karen / Langata',
    'Kasarani / Roysambu',
    'Thika Road (TRM, Garden City)',
    'Kileleshwa / Hurlingham',
    'Upperhill',
    'Embakasi',
    'Rongai',
    'Kitengela',
    'Other (specify in chat)',
];

export const CheckoutPageContent: React.FC = () => {
    const $cartItems = useStore(cartItems);
    const $cartTotal = useStore(cartTotal);

    // Form state
    const [customerName, setCustomerName] = useState('');
    const [deliveryLocation, setDeliveryLocation] = useState('');
    const [formError, setFormError] = useState('');

    const items = Object.values($cartItems) as CartItem[];

    // Generate WhatsApp message (plain text, no emojis for compatibility)
    const generateWhatsAppMessage = (): string => {
        let message = `*NEW ORDER - SasaGadgets*\n\n`;

        message += `*Items:*\n`;
        items.forEach((item, i) => {
            const itemTotal = item.price * item.quantity;
            message += `${i + 1}. ${item.name} (x${item.quantity}) - KES ${itemTotal.toLocaleString()}\n`;
        });

        message += `\n*Total: KES ${$cartTotal.toLocaleString()}*\n\n`;

        message += `*Delivery:* ${deliveryLocation}\n`;
        message += `*Customer:* ${customerName}\n\n`;

        message += `----------------------------\n`;
        message += `*Payment Instructions:*\n`;
        message += `Pay via M-Pesa Paybill:\n`;
        message += `- Paybill: ${PAYBILL_NUMBER}\n`;
        message += `- Account: ${ACCOUNT_NUMBER}\n`;
        message += `- Amount: KES ${$cartTotal.toLocaleString()}\n\n`;
        message += `Once paid, reply with M-Pesa confirmation message.\n`;
        message += `----------------------------`;

        return message;
    };

    // Handle checkout
    const handleProceedToWhatsApp = () => {
        // Validation
        if (!customerName.trim()) {
            setFormError('Please enter your name');
            return;
        }
        if (!deliveryLocation) {
            setFormError('Please select a delivery location');
            return;
        }

        setFormError('');

        // Generate message and open WhatsApp
        const message = generateWhatsAppMessage();
        const encoded = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${PHONE_NUMBER}?text=${encoded}`;

        // Open WhatsApp
        window.open(whatsappUrl, '_blank');

        // Clear cart after a short delay (so user sees it worked)
        setTimeout(() => {
            clearCart();
        }, 1000);
    };

    // Handle call
    const handleCall = () => {
        window.location.href = `tel:+${PHONE_NUMBER}`;
    };

    return (
        <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-black text-slate-900 mb-2">Checkout</h1>
                <p className="text-gray-600">Complete your order via WhatsApp</p>
            </div>

            {/* Empty Cart State */}
            {items.length === 0 && (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="text-6xl mb-4">🛒</div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
                    <p className="text-gray-600 mb-6">Add some products to get started</p>
                    <a
                        href="/shop"
                        className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
                    >
                        Browse Products
                    </a>
                </div>
            )}

            {/* Cart Items */}
            {items.length > 0 && (
                <>
                    {/* Order Summary */}
                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6 shadow-sm">
                        <div className="p-4 bg-slate-50 border-b border-gray-200 flex items-center gap-2">
                            <FiShoppingBag className="w-5 h-5 text-slate-600" />
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
                                            className="text-red-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                                            aria-label="Remove item"
                                        >
                                            <FiTrash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 bg-emerald-50 border-t border-emerald-100 flex justify-between items-center">
                            <span className="font-bold text-lg text-emerald-900">Total To Pay:</span>
                            <span className="font-black text-2xl text-emerald-700">
                                KES {$cartTotal.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    {/* Trust Badges */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-blue-50 p-3 rounded-xl flex items-center justify-center gap-2 text-blue-800 text-sm font-semibold border border-blue-100">
                            <FiLock className="w-4 h-4" /> Secure Order
                        </div>
                        <div className="bg-emerald-50 p-3 rounded-xl flex items-center justify-center gap-2 text-emerald-800 text-sm font-semibold border border-emerald-100">
                            <FiZap className="w-4 h-4" /> Fast Delivery
                        </div>
                    </div>

                    {/* Customer Details Form */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                        <h3 className="font-bold text-lg text-slate-900 mb-6">Delivery Details</h3>

                        {/* Name Input */}
                        <div className="mb-5">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                <FiUser className="w-4 h-4" />
                                Your Name
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. John Kamau"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-lg transition-all"
                            />
                        </div>

                        {/* Location Dropdown */}
                        <div className="mb-6">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                <FiMapPin className="w-4 h-4" />
                                Delivery Location
                            </label>
                            <select
                                value={deliveryLocation}
                                onChange={(e) => setDeliveryLocation(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-lg transition-all bg-white appearance-none cursor-pointer"
                            >
                                <option value="">Select your area...</option>
                                {DELIVERY_LOCATIONS.map(loc => (
                                    <option key={loc} value={loc}>{loc}</option>
                                ))}
                            </select>
                        </div>

                        {/* Error Message */}
                        {formError && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                {formError}
                            </div>
                        )}

                        {/* WhatsApp Button */}
                        <button
                            onClick={handleProceedToWhatsApp}
                            className="w-full py-4 px-6 rounded-xl font-bold text-white text-lg bg-green-500 hover:bg-green-600 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-3"
                        >
                            <FaWhatsapp className="w-6 h-6" />
                            Proceed to Pay via WhatsApp
                        </button>

                        {/* M-Pesa Preview */}
                        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                            <h4 className="font-bold text-amber-800 mb-2 text-sm flex items-center gap-2"><FiCreditCard className="w-4 h-4" /> Payment via M-Pesa</h4>
                            <div className="space-y-1 text-sm text-amber-900">
                                <p><strong>Paybill:</strong> {PAYBILL_NUMBER}</p>
                                <p><strong>Account:</strong> {ACCOUNT_NUMBER}</p>
                                <p><strong>Amount:</strong> KES {$cartTotal.toLocaleString()}</p>
                            </div>
                        </div>

                        {/* Alternative Contact */}
                        <div className="mt-6 text-center">
                            <p className="text-gray-500 text-sm mb-2">Prefer to call?</p>
                            <button
                                onClick={handleCall}
                                className="text-emerald-600 font-semibold hover:underline"
                            >
                                <FiPhone className="w-4 h-4 inline" /> Call +254 714 389 231
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

