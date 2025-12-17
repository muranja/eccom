/**
 * ============================================================================
 * SOCIAL PROOF COMPONENT - "Recently Bought" Notification
 * ============================================================================
 * Displays simulated purchase notifications to build trust.
 * In production, connect to real order data.
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';

interface Notification {
    id: number;
    name: string;
    product: string;
    location: string;
}

const notifications: Notification[] = [
    { id: 1, name: 'John K.', product: 'iPhone 13', location: 'Westlands' },
    { id: 2, name: 'Sarah M.', product: 'HP EliteBook 840 G5', location: 'Nairobi CBD' },
    { id: 3, name: 'Peter N.', product: 'Samsung S22', location: 'Karen' },
    { id: 4, name: 'Jane W.', product: 'iPhone 13', location: 'Kileleshwa' },
];

export const SocialProof: React.FC = () => {
    const [visible, setVisible] = useState(false);
    const [currentNotification, setCurrentNotification] = useState<Notification>(notifications[0]);

    useEffect(() => {
        const showNotification = () => {
            // Pick a random notification
            const random = notifications[Math.floor(Math.random() * notifications.length)];
            setCurrentNotification(random);
            setVisible(true);

            // Hide after 5 seconds
            setTimeout(() => {
                setVisible(false);
            }, 5000);
        };

        // Show first notification after 3 seconds
        const initialTimer = setTimeout(showNotification, 3000);

        // Then show every 15 seconds
        const interval = setInterval(showNotification, 15000);

        return () => {
            clearTimeout(initialTimer);
            clearInterval(interval);
        };
    }, []);

    if (!visible) return null;

    return (
        <div className="fixed bottom-6 left-6 z-50 animate-slide-in max-w-sm">
            <div className="bg-white rounded-lg shadow-2xl border border-gray-100 p-4 flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold flex-shrink-0">
                    {currentNotification.name[0]}
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-slate-900 text-sm">
                            {currentNotification.name}
                        </p>
                        <span className="text-xs text-gray-500">
                            {currentNotification.location}
                        </span>
                    </div>
                    <p className="text-xs text-gray-600">
                        Just bought <span className="font-semibold text-emerald-600">{currentNotification.product}</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">A few minutes ago</p>
                </div>
                <button
                    onClick={() => setVisible(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                    ✕
                </button>
            </div>
        </div>
    );
};
