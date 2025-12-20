/**
 * Mobile Filter Drawer
 * Slide-up panel for mobile filter experience
 */
import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '@nanostores/react';
import { FiX, FiFilter, FiCheck } from 'react-icons/fi';
import Fuse from 'fuse.js';
import {
    searchQuery,
    selectedCategory,
    selectedBrand,
    selectedPriceRange,
    selectedStorage,
    selectedRAM,
    sortOrder,
    resetFilters,
} from '../stores/filterStore';

interface Product {
    slug: string;
    data: {
        name: string;
        price: number;
        category: string;
        brand: string;
        inStock: boolean;
        storage?: number;
        ram?: number;
    };
}

interface MobileFilterDrawerProps {
    products: Product[];
}

export const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({ products }) => {
    const [isOpen, setIsOpen] = useState(false);

    const $searchQuery = useStore(searchQuery);
    const $selectedCategory = useStore(selectedCategory);
    const $selectedBrand = useStore(selectedBrand);
    const $selectedPriceRange = useStore(selectedPriceRange);
    const $selectedStorage = useStore(selectedStorage);
    const $selectedRAM = useStore(selectedRAM);
    const $sortOrder = useStore(sortOrder);

    // Calculate active filter count
    const activeCount = [
        $searchQuery,
        $selectedCategory !== 'all' ? $selectedCategory : '',
        $selectedBrand !== 'all' ? $selectedBrand : '',
        $selectedPriceRange !== 'all' ? $selectedPriceRange : '',
        $selectedStorage !== 'all' ? $selectedStorage : '',
        $selectedRAM !== 'all' ? $selectedRAM : '',
    ].filter(Boolean).length;

    // Prevent body scroll when drawer is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, []);

    // 1. Filter by Search Query FIRST (same logic as desktop)
    const searchResults = useMemo(() => {
        if (!$searchQuery.trim()) return products;

        const fuse = new Fuse(products, {
            keys: ['data.name', 'data.brand', 'data.category'],
            threshold: 0.3,
            ignoreLocation: true
        });

        return fuse.search($searchQuery).map(r => r.item);
    }, [products, $searchQuery]);

    // 2. Compute Facets based on Search Results
    const facets = useMemo(() => {
        const counts = {
            category: {} as Record<string, number>,
            brand: {} as Record<string, number>,
            storage: {} as Record<string, number>,
            ram: {} as Record<string, number>,
        };

        searchResults.forEach(p => {
            // Category
            const cat = p.data.category;
            counts.category[cat] = (counts.category[cat] || 0) + 1;

            // Brand
            const brand = p.data.brand;
            counts.brand[brand] = (counts.brand[brand] || 0) + 1;

            // Storage
            if (p.data.storage) {
                const storage = p.data.storage.toString();
                counts.storage[storage] = (counts.storage[storage] || 0) + 1;
            }

            // RAM
            if (p.data.ram) {
                const ram = p.data.ram.toString();
                counts.ram[ram] = (counts.ram[ram] || 0) + 1;
            }
        });

        return counts;
    }, [searchResults]);

    // Helpers to sort keys
    const sortedBrands = Object.keys(facets.brand).sort();
    const sortedCategories = Object.keys(facets.category).sort();
    const sortedStorage = Object.keys(facets.storage).sort((a, b) => parseInt(a) - parseInt(b));
    const sortedRAM = Object.keys(facets.ram).sort((a, b) => parseInt(a) - parseInt(b));

    return (
        <>
            {/* Floating Filter Button - Only on mobile */}
            <button
                onClick={() => setIsOpen(true)}
                className="md:hidden fixed bottom-20 right-4 z-40 flex items-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-emerald-700 transition-all active:scale-95"
                aria-label="Open filters"
            >
                <FiFilter className="w-5 h-5" />
                <span className="font-semibold">Filters</span>
                {activeCount > 0 && (
                    <span className="bg-white text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full">
                        {activeCount}
                    </span>
                )}
            </button>

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-50 animate-fade-in"
                    onClick={() => setIsOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Drawer */}
            <div
                className={`md:hidden fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-2xl transform transition-transform duration-300 ease-out ${isOpen ? 'translate-y-0' : 'translate-y-full'
                    }`}
                style={{ maxHeight: '85vh' }}
                role="dialog"
                aria-modal="true"
                aria-label="Filter products"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-slate-900">Filters</h2>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Close filters"
                    >
                        <FiX className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto p-4 space-y-6" style={{ maxHeight: 'calc(85vh - 140px)' }}>
                    {/* Category */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                        <select
                            value={$selectedCategory}
                            onChange={(e) => selectedCategory.set(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
                        >
                            <option value="all">All Types</option>
                            {sortedCategories.map(cat => (
                                <option key={cat} value={cat}>
                                    {cat.charAt(0).toUpperCase() + cat.slice(1)} ({facets.category[cat]})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Brand */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Brand</label>
                        <select
                            value={$selectedBrand}
                            onChange={(e) => selectedBrand.set(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
                        >
                            <option value="all">All Brands</option>
                            {sortedBrands.map(brand => (
                                <option key={brand} value={brand}>
                                    {brand} ({facets.brand[brand]})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Price Range */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Price Range</label>
                        <select
                            value={$selectedPriceRange}
                            onChange={(e) => selectedPriceRange.set(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
                        >
                            <option value="all">Any Price</option>
                            <option value="under15k">Under KES 15,000</option>
                            <option value="15k-30k">KES 15,000 - 30,000</option>
                            <option value="30k-50k">KES 30,000 - 50,000</option>
                            <option value="above50k">Above KES 50,000</option>
                        </select>
                    </div>

                    {/* Storage */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Storage</label>
                        <select
                            value={$selectedStorage}
                            onChange={(e) => selectedStorage.set(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
                        >
                            <option value="all">Any Storage</option>
                            {sortedStorage.map(storage => (
                                <option key={storage} value={storage}>
                                    {storage}GB ({facets.storage[storage]})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* RAM */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">RAM</label>
                        <select
                            value={$selectedRAM}
                            onChange={(e) => selectedRAM.set(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
                        >
                            <option value="all">Any RAM</option>
                            {sortedRAM.map(ram => (
                                <option key={ram} value={ram}>
                                    {ram}GB ({facets.ram[ram]})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Sort */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Sort By</label>
                        <select
                            value={$sortOrder}
                            onChange={(e) => sortOrder.set(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
                        >
                            <option value="default">Default</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                            <option value="name-asc">Name: A-Z</option>
                        </select>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-3">
                    <button
                        onClick={() => {
                            resetFilters();
                        }}
                        className="flex-1 py-3 px-4 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        Clear All
                    </button>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="flex-1 py-3 px-4 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                    >
                        <FiCheck className="w-5 h-5" />
                        Apply Filters
                    </button>
                </div>
            </div>
        </>
    );
};
