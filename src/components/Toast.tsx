/**
 * ============================================================================
 * TOAST NOTIFICATION SYSTEM
 * ============================================================================
 * 
 * Provides visual feedback for user actions.
 * Auto-dismisses after 3 seconds.
 * 
 * ============================================================================
 */

import React from 'react';
import { useStore } from '@nanostores/react';
import { atom } from 'nanostores';

export interface ToastMessage {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
}

/**
 * Toast messages store
 */
export const toastMessages = atom<ToastMessage[]>([]);

/**
 * Show a toast notification
 */
export function showToast(
    message: string,
    type: ToastMessage['type'] = 'success',
    duration: number = 3000
) {
    const id = Date.now().toString() + Math.random();
    const newToast: ToastMessage = { id, message, type, duration };

    toastMessages.set([...toastMessages.get(), newToast]);

    setTimeout(() => {
        toastMessages.set(toastMessages.get().filter(t => t.id !== id));
    }, duration);
}

/**
 * Dismiss a specific toast
 */
export function dismissToast(id: string) {
    toastMessages.set(toastMessages.get().filter(t => t.id !== id));
}

/**
 * Toast Container Component
 * Render this once in your layout
 */
export const ToastContainer: React.FC = () => {
    const messages = useStore(toastMessages);

    if (messages.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 z-[100] space-y-2 pointer-events-none">
            {messages.map((toast) => (
                <div
                    key={toast.id}
                    className={`px-4 py-3 rounded-lg shadow-lg animate-slide-in-right pointer-events-auto ${toast.type === 'success' ? 'bg-emerald-600' :
                            toast.type === 'error' ? 'bg-red-600' :
                                toast.type === 'warning' ? 'bg-amber-600' :
                                    'bg-blue-600'
                        } text-white font-semibold flex items-center gap-2 min-w-[250px]`}
                    role="alert"
                >
                    {/* Icon */}
                    <span className="text-xl">
                        {toast.type === 'success' && '✓'}
                        {toast.type === 'error' && '✕'}
                        {toast.type === 'warning' && '⚠'}
                        {toast.type === 'info' && 'ℹ'}
                    </span>

                    {/* Message */}
                    <span className="flex-1">{toast.message}</span>

                    {/* Close button */}
                    <button
                        onClick={() => dismissToast(toast.id)}
                        className="text-white/80 hover:text-white text-lg font-bold"
                        aria-label="Dismiss notification"
                    >
                        ×
                    </button>
                </div>
            ))}
        </div>
    );
};
