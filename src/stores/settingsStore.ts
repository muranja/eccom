/**
 * ============================================================================
 * APP SETTINGS STORE (Browser localStorage)
 * ============================================================================
 * 
 * Stores user preferences and app settings in the browser.
 * This allows personalization and faster loading by remembering:
 * - Recently viewed products
 * - User preferences (dark mode, etc.)
 * - Last visit timestamp
 * 
 * ============================================================================
 */

const SETTINGS_KEY = 'phoneshop_settings';
const RECENT_KEY = 'phoneshop_recent';
const MAX_RECENT = 10;

interface AppSettings {
    lastVisit: number;
    hasSeenWelcome: boolean;
    preferredPayment: 'mpesa' | 'card' | null;
}

const DEFAULT_SETTINGS: AppSettings = {
    lastVisit: Date.now(),
    hasSeenWelcome: false,
    preferredPayment: null,
};

/**
 * Get app settings from localStorage.
 */
export function getSettings(): AppSettings {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS;

    try {
        const stored = localStorage.getItem(SETTINGS_KEY);
        if (!stored) return DEFAULT_SETTINGS;

        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    } catch {
        return DEFAULT_SETTINGS;
    }
}

/**
 * Save app settings to localStorage.
 */
export function saveSettings(settings: Partial<AppSettings>): void {
    if (typeof window === 'undefined') return;

    try {
        const current = getSettings();
        const updated = { ...current, ...settings, lastVisit: Date.now() };
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    } catch {
        // Ignore storage errors
    }
}

/**
 * Get recently viewed product IDs.
 */
export function getRecentlyViewed(): string[] {
    if (typeof window === 'undefined') return [];

    try {
        const stored = localStorage.getItem(RECENT_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

/**
 * Add a product to recently viewed.
 */
export function addRecentlyViewed(productId: string): void {
    if (typeof window === 'undefined') return;

    try {
        const recent = getRecentlyViewed().filter(id => id !== productId);
        recent.unshift(productId); // Add to beginning

        // Keep only last MAX_RECENT items
        const trimmed = recent.slice(0, MAX_RECENT);
        localStorage.setItem(RECENT_KEY, JSON.stringify(trimmed));
    } catch {
        // Ignore storage errors
    }
}
