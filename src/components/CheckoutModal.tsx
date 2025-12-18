import React, { useState } from 'react';
import { useStore } from '@nanostores/react';
import { cartItems, cartTotal, removeCartItem, type CartItem } from '../stores/cartStore';

// Configuration
const PAYBILL_NUMBER = '247247';
const ACCOUNT_NAME = 'TECH-STORE';
const PHONE_NUMBER = '254714389231';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
    const $cartItems = useStore(cartItems);
    const $cartTotal = useStore(cartTotal);
    const [hasPaid, setHasPaid] = useState(false);

    const items = Object.values($cartItems) as CartItem[];

    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
            setHasPaid(false);
        }
    };

    const handleCall = () => {
        window.location.href = `tel:+${PHONE_NUMBER}`;
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold">🛒 Your Order</h2>
                    <button
                        onClick={() => { onClose(); setHasPaid(false); }}
                        className="text-gray-300 hover:text-white text-2xl"
                    >
                        ×
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {items.length === 0 ? (
                        <p className="text-center text-gray-600 py-8">Your cart is empty</p>
                    ) : (
                        items.map(item => (
                            <div key={item.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
                                <div>
                                    <p className="font-semibold text-slate-900">{item.name}</p>
                                    <p className="text-sm text-gray-600">Qty: {item.quantity} × KES {item.price.toLocaleString()}</p>
                                </div>
                                <button
                                    onClick={() => removeCartItem(item.id)}
                                    className="text-red-500 hover:text-red-700 text-sm"
                                >
                                    Remove
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Total & Delivery */}
                {items.length > 0 && (
                    <div className="border-t border-gray-200 p-4 space-y-3">
                        <div className="flex justify-between text-lg font-bold">
                            <span>Total:</span>
                            <span className="text-emerald-600">KES {$cartTotal.toLocaleString()}</span>
                        </div>
                        <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 text-center">
                            <span className="text-emerald-700 font-medium">🚚 FREE Delivery within Nairobi CBD</span>
                        </div>
                    </div>
                )}

                {/* Payment Instructions */}
                {items.length > 0 && !hasPaid && (
                    <div className="border-t border-gray-200 p-4 bg-amber-50">
                        <h3 className="font-bold text-slate-900 mb-2">📝 Payment Instructions</h3>
                        <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                            <li>Open M-Pesa on your phone</li>
                            <li>Go to <strong>Lipa na M-Pesa</strong> → Paybill</li>
                            <li>Business Number: <strong className="text-slate-900">{PAYBILL_NUMBER}</strong></li>
                            <li>Account Number: <strong className="text-slate-900">{ACCOUNT_NAME}</strong></li>
                            <li>Amount: <strong className="text-slate-900">KES {$cartTotal.toLocaleString()}</strong></li>
                            <li>Enter your M-Pesa PIN to confirm</li>
                        </ol>
                    </div>
                )}

                {/* Action Buttons */}
                {items.length > 0 && (
                    <div className="p-4 border-t border-gray-200">
                        {!hasPaid ? (
                            <button
                                onClick={() => setHasPaid(true)}
                                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                            >
                                ✅ I Have Paid
                            </button>
                        ) : (
                            <div className="space-y-3">
                                <p className="text-center text-emerald-600 font-semibold">
                                    ✓ Payment Received! Call to confirm your order:
                                </p>
                                <button
                                    onClick={handleCall}
                                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                    </svg>
                                    Call to Confirm Order
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
