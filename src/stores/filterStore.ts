import { atom } from 'nanostores';

/**
 * ============================================================================
 * SEARCH & FILTER STORE
 * ============================================================================
 * Client-side search and filter state for products.
 * Enhanced with URL sync support.
 * ============================================================================
 */

// Filter atoms
export const searchQuery = atom<string>('');
export const selectedCategory = atom<string>('all');
export const selectedBrand = atom<string>('all');
export const selectedPriceRange = atom<string>('all');
export const selectedStorage = atom<string>('all');
export const selectedRAM = atom<string>('all');
export const sortOrder = atom<string>('default');

// Valid options for validation
export const VALID_CATEGORIES = ['all', 'phone', 'laptop', 'tablet', 'accessory'];
export const VALID_BRANDS = ['all', 'Samsung', 'Tecno', 'Infinix', 'Xiaomi', 'Oppo', 'Realme', 'Vivo', 'Apple', 'Nokia', 'HP', 'Itel', 'Umidigi'];
export const VALID_PRICE_RANGES = ['all', 'under15k', '15k-30k', '30k-50k', 'above50k'];
export const VALID_STORAGE = ['all', '32', '64', '128', '256'];
export const VALID_RAM = ['all', '2', '3', '4', '6', '8'];
export const VALID_SORT = ['default', 'price-asc', 'price-desc', 'name-asc', 'newest'];

/**
 * Initialize filters from URL search params
 */
export function initFromURL(params: URLSearchParams): void {
    const category = params.get('category');
    const brand = params.get('brand');
    const price = params.get('price');
    const storage = params.get('storage');
    const ram = params.get('ram');
    const sort = params.get('sort');
    const q = params.get('q');

    if (q) searchQuery.set(q);
    if (category && VALID_CATEGORIES.includes(category)) selectedCategory.set(category);
    if (brand && VALID_BRANDS.includes(brand)) selectedBrand.set(brand);
    if (price && VALID_PRICE_RANGES.includes(price)) selectedPriceRange.set(price);
    if (storage && VALID_STORAGE.includes(storage)) selectedStorage.set(storage);
    if (ram && VALID_RAM.includes(ram)) selectedRAM.set(ram);
    if (sort && VALID_SORT.includes(sort)) sortOrder.set(sort);
}

/**
 * Convert current filters to URL search params
 */
export function toURLParams(): URLSearchParams {
    const params = new URLSearchParams();

    const q = searchQuery.get();
    const category = selectedCategory.get();
    const brand = selectedBrand.get();
    const price = selectedPriceRange.get();
    const storage = selectedStorage.get();
    const ram = selectedRAM.get();
    const sort = sortOrder.get();

    if (q) params.set('q', q);
    if (category !== 'all') params.set('category', category);
    if (brand !== 'all') params.set('brand', brand);
    if (price !== 'all') params.set('price', price);
    if (storage !== 'all') params.set('storage', storage);
    if (ram !== 'all') params.set('ram', ram);
    if (sort !== 'default') params.set('sort', sort);

    return params;
}

/**
 * Get active filter count (for mobile badge)
 */
export function getActiveFilterCount(): number {
    let count = 0;
    if (searchQuery.get()) count++;
    if (selectedCategory.get() !== 'all') count++;
    if (selectedBrand.get() !== 'all') count++;
    if (selectedPriceRange.get() !== 'all') count++;
    if (selectedStorage.get() !== 'all') count++;
    if (selectedRAM.get() !== 'all') count++;
    return count;
}

/**
 * Reset all filters to default
 */
export function resetFilters(): void {
    searchQuery.set('');
    selectedCategory.set('all');
    selectedBrand.set('all');
    selectedPriceRange.set('all');
    selectedStorage.set('all');
    selectedRAM.set('all');
    sortOrder.set('default');
}
