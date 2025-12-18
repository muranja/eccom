/**
 * ============================================================================
 * ENHANCED SEARCH & FILTER BAR (React Island)
 * ============================================================================
 * Client-side search with advanced filters, URL sync, and accessibility.
 * ============================================================================
 */

import React from 'react';
import { useStore } from '@nanostores/react';
import { FiSearch, FiSmartphone, FiMonitor, FiTablet } from 'react-icons/fi';
import { useURLFilters } from '../hooks/useURLFilters';
import {
    searchQuery,
    selectedCategory,
    selectedBrand,
    selectedPriceRange,
    selectedStorage,
    selectedRAM,
    sortOrder,
    resetFilters,
    getActiveFilterCount,
} from '../stores/filterStore';

export const SearchFilter: React.FC = () => {
    // Sync filters with URL
    useURLFilters();

    const $searchQuery = useStore(searchQuery);
    const $selectedCategory = useStore(selectedCategory);
    const $selectedBrand = useStore(selectedBrand);
    const $selectedPriceRange = useStore(selectedPriceRange);
    const $selectedStorage = useStore(selectedStorage);
    const $selectedRAM = useStore(selectedRAM);
    const $sortOrder = useStore(sortOrder);

    const hasActiveFilters =
        $searchQuery ||
        $selectedCategory !== 'all' ||
        $selectedBrand !== 'all' ||
        $selectedPriceRange !== 'all' ||
        $selectedStorage !== 'all' ||
        $selectedRAM !== 'all';

    return (
        <div
            className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mb-6"
            role="search"
            aria-label="Filter products"
        >
            {/* Search Input */}
            <div className="mb-4 relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
                <input
                    type="search"
                    placeholder="Search by name or brand..."
                    value={$searchQuery}
                    onChange={(e) => searchQuery.set(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-lg"
                    aria-label="Search products"
                />
            </div>

            {/* Filter Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {/* Category */}
                <select
                    value={$selectedCategory}
                    onChange={(e) => selectedCategory.set(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white text-sm"
                    aria-label="Filter by category"
                >
                    <option value="all">All Types</option>
                    <option value="phone">Phones</option>
                    <option value="laptop">Laptops</option>
                    <option value="tablet">Tablets</option>
                </select>

                {/* Brand */}
                <select
                    value={$selectedBrand}
                    onChange={(e) => selectedBrand.set(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white text-sm"
                    aria-label="Filter by brand"
                >
                    <option value="all">All Brands</option>
                    <option value="Samsung">Samsung</option>
                    <option value="Tecno">Tecno</option>
                    <option value="Infinix">Infinix</option>
                    <option value="Xiaomi">Xiaomi</option>
                    <option value="Oppo">Oppo</option>
                    <option value="Realme">Realme</option>
                    <option value="Vivo">Vivo</option>
                    <option value="Apple">Apple</option>
                    <option value="Nokia">Nokia</option>
                    <option value="Itel">Itel</option>
                    <option value="Umidigi">Umidigi</option>
                    <option value="HP">HP</option>
                </select>

                {/* Price Range */}
                <select
                    value={$selectedPriceRange}
                    onChange={(e) => selectedPriceRange.set(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white text-sm"
                    aria-label="Filter by price range"
                >
                    <option value="all">Any Price</option>
                    <option value="under15k">Under 15k</option>
                    <option value="15k-30k">15k - 30k</option>
                    <option value="30k-50k">30k - 50k</option>
                    <option value="above50k">Above 50k</option>
                </select>

                {/* Storage */}
                <select
                    value={$selectedStorage}
                    onChange={(e) => selectedStorage.set(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white text-sm"
                    aria-label="Filter by storage capacity"
                >
                    <option value="all">Any Storage</option>
                    <option value="32">32GB</option>
                    <option value="64">64GB</option>
                    <option value="128">128GB</option>
                    <option value="256">256GB+</option>
                </select>

                {/* RAM */}
                <select
                    value={$selectedRAM}
                    onChange={(e) => selectedRAM.set(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white text-sm"
                    aria-label="Filter by RAM"
                >
                    <option value="all">Any RAM</option>
                    <option value="2">2GB</option>
                    <option value="3">3GB</option>
                    <option value="4">4GB</option>
                    <option value="6">6GB+</option>
                    <option value="8">8GB+</option>
                </select>

                {/* Sort */}
                <select
                    value={$sortOrder}
                    onChange={(e) => sortOrder.set(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white text-sm"
                    aria-label="Sort products"
                >
                    <option value="default">Sort By</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name-asc">Name: A-Z</option>
                </select>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
                <div className="mt-4 text-center">
                    <button
                        onClick={resetFilters}
                        className="px-6 py-2 text-gray-600 hover:text-red-600 font-medium transition-colors border border-gray-300 rounded-lg hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                        aria-label="Clear all filters"
                    >
                        Clear All Filters
                    </button>
                </div>
            )}
        </div>
    );
};
