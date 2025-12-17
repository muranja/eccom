import { atom, computed } from 'nanostores';

/**
 * ============================================================================
 * SEARCH & FILTER STORE
 * ============================================================================
 * Client-side search and filter state for products.
 * Enhanced with price, storage, RAM, and brand filters.
 * ============================================================================
 */

export const searchQuery = atom<string>('');
export const selectedCategory = atom<string>('all');
export const selectedBrand = atom<string>('all');
export const selectedPriceRange = atom<string>('all'); // 'all', 'under15k', '15k-30k', 'above30k'
export const selectedStorage = atom<string>('all'); // 'all', '32', '64', '128', '256'
export const selectedRAM = atom<string>('all'); // 'all', '2', '3', '4', '6', '8'

// Reset all filters
export function resetFilters() {
    searchQuery.set('');
    selectedCategory.set('all');
    selectedBrand.set('all');
    selectedPriceRange.set('all');
    selectedStorage.set('all');
    selectedRAM.set('all');
}
