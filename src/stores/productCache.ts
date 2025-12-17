/**
 * ============================================================================
 * PRODUCT CACHE (localStorage)
 * ============================================================================
 * 
 * Caches product data in localStorage for faster subsequent page loads.
 * Products are loaded once from the server, then served from cache.
 * 
 * USAGE:
 *   import { getCachedProducts, cacheProducts } from '../stores/productCache';
 *   
 *   // On initial load
 *   cacheProducts(products);
 *   
 *   // On subsequent loads
 *   const cached = getCachedProducts();
 * 
 * ============================================================================
 */

import type { Product } from '../data/products';

const STORAGE_KEY = 'phoneshop_products';
const CACHE_DURATION_MS = 1000 * 60 * 60; // 1 hour

interface CachedData {
    products: Product[];
    timestamp: number;
}

/**
 * Check if cache is still valid (not expired).
 */
function isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < CACHE_DURATION_MS;
}

/**
 * Get cached products from localStorage.
 * Returns null if cache is expired or doesn't exist.
 */
export function getCachedProducts(): Product[] | null {
    if (typeof window === 'undefined') return null;

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return null;

        const data: CachedData = JSON.parse(stored);

        if (isCacheValid(data.timestamp)) {
            return data.products;
        }

        // Cache expired, remove it
        localStorage.removeItem(STORAGE_KEY);
        return null;
    } catch {
        return null;
    }
}

/**
 * Cache products to localStorage.
 */
export function cacheProducts(products: Product[]): void {
    if (typeof window === 'undefined') return;

    try {
        const data: CachedData = {
            products,
            timestamp: Date.now(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
        // Storage full or unavailable, ignore
    }
}

/**
 * Clear the product cache.
 */
export function clearProductCache(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
}
