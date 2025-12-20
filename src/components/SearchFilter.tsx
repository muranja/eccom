/**
 * ============================================================================
 * ENHANCED SEARCH & FILTER BAR (React Island)
 * ============================================================================
 * Client-side search with advanced filters, URL sync, and accessibility.
 * Features: dynamic faceted search, autocomplete, quick filter tags.
 * ============================================================================
 */

import React, { useMemo, useState, useRef, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { FiSearch, FiX, FiZap, FiSmartphone, FiMonitor, FiStar, FiDollarSign, FiSliders } from 'react-icons/fi';
import { useURLFilters } from '../hooks/useURLFilters';
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
    minPrice,
    maxPrice,
    setPricePreset,
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
        image?: string;
    };
}

interface SearchFilterProps {
    products: Product[];
}

// Quick Filter Presets
const QUICK_FILTERS = [
    {
        label: 'Budget Phones',
        icon: FiDollarSign,
        filters: { category: 'phone', priceRange: 'under15k' },
        color: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
    },
    {
        label: 'Premium Phones',
        icon: FiStar,
        filters: { category: 'phone', priceRange: 'above50k' },
        color: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
    },
    {
        label: 'All Laptops',
        icon: FiMonitor,
        filters: { category: 'laptop' },
        color: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
    },
    {
        label: 'Samsung',
        icon: FiSmartphone,
        filters: { brand: 'Samsung' },
        color: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
    },
    {
        label: 'High Storage (128GB+)',
        icon: FiZap,
        filters: { storage: '128' },
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
    },
];

export const SearchFilter: React.FC<SearchFilterProps> = ({ products }) => {
    // Sync filters with URL
    useURLFilters();

    const $searchQuery = useStore(searchQuery);
    const $selectedCategory = useStore(selectedCategory);
    const $selectedBrand = useStore(selectedBrand);
    const $selectedPriceRange = useStore(selectedPriceRange);
    const $selectedStorage = useStore(selectedStorage);
    const $selectedRAM = useStore(selectedRAM);
    const $sortOrder = useStore(sortOrder);
    const $minPrice = useStore(minPrice);
    const $maxPrice = useStore(maxPrice);

    // UI state
    const [showAutocomplete, setShowAutocomplete] = useState(false);
    const [showPricePanel, setShowPricePanel] = useState(false);
    const [inputFocused, setInputFocused] = useState(false);
    const searchContainerRef = useRef<HTMLDivElement>(null);
    const pricePanelRef = useRef<HTMLDivElement>(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
                setShowAutocomplete(false);
            }
            if (pricePanelRef.current && !pricePanelRef.current.contains(e.target as Node)) {
                setShowPricePanel(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fuse instance for autocomplete
    const fuse = useMemo(() => new Fuse(products, {
        keys: ['data.name', 'data.brand'],
        threshold: 0.3,
        ignoreLocation: true,
        includeScore: true
    }), [products]);

    // Autocomplete suggestions (max 5)
    const autocompleteSuggestions = useMemo(() => {
        if (!$searchQuery.trim() || $searchQuery.length < 2) return [];
        return fuse.search($searchQuery).slice(0, 5).map(r => r.item);
    }, [$searchQuery, fuse]);

    // 1. Filter by Search Query FIRST to determine the "Search Universe"
    const searchResults = useMemo(() => {
        if (!$searchQuery.trim()) return products;
        return fuse.search($searchQuery).map(r => r.item);
    }, [products, $searchQuery, fuse]);

    // 2. Compute Facets based on Search Results
    const facets = useMemo(() => {
        const counts = {
            category: {} as Record<string, number>,
            brand: {} as Record<string, number>,
            storage: {} as Record<string, number>,
            ram: {} as Record<string, number>,
        };

        searchResults.forEach(p => {
            const cat = p.data.category;
            counts.category[cat] = (counts.category[cat] || 0) + 1;

            const brand = p.data.brand;
            counts.brand[brand] = (counts.brand[brand] || 0) + 1;

            if (p.data.storage) {
                const storage = p.data.storage.toString();
                counts.storage[storage] = (counts.storage[storage] || 0) + 1;
            }

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

    const hasActiveFilters =
        $searchQuery ||
        $selectedCategory !== 'all' ||
        $selectedBrand !== 'all' ||
        $selectedPriceRange !== 'all' ||
        $selectedStorage !== 'all' ||
        $selectedRAM !== 'all';

    // Apply a quick filter preset
    const applyQuickFilter = (filters: { category?: string; brand?: string; priceRange?: string; storage?: string }) => {
        resetFilters();
        if (filters.category) selectedCategory.set(filters.category);
        if (filters.brand) selectedBrand.set(filters.brand);
        if (filters.priceRange) selectedPriceRange.set(filters.priceRange);
        if (filters.storage) selectedStorage.set(filters.storage);
    };

    // Handle autocomplete item click
    const handleAutocompleteClick = (slug: string) => {
        setShowAutocomplete(false);
        window.location.href = `/shop/${slug}`;
    };

    return (
        <div
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-8"
            role="search"
            aria-label="Filter products"
        >
            {/* Quick Filter Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide self-center mr-1">Quick:</span>
                {QUICK_FILTERS.map((qf) => {
                    const Icon = qf.icon;
                    return (
                        <button
                            key={qf.label}
                            onClick={() => applyQuickFilter(qf.filters)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${qf.color}`}
                        >
                            <Icon className="w-3.5 h-3.5" />
                            {qf.label}
                        </button>
                    );
                })}
            </div>

            {/* Top Row: Search & Sort */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-grow" ref={searchContainerRef}>
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="search"
                        placeholder="Search for phones, laptops, and more..."
                        value={$searchQuery}
                        onChange={(e) => {
                            searchQuery.set(e.target.value);
                            setShowAutocomplete(true);
                        }}
                        onFocus={() => {
                            setInputFocused(true);
                            if ($searchQuery.length >= 2) setShowAutocomplete(true);
                        }}
                        onBlur={() => setInputFocused(false)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-medium text-slate-900 placeholder:text-slate-400"
                        aria-label="Search products"
                        autoComplete="off"
                    />
                    {$searchQuery && (
                        <button
                            onClick={() => {
                                searchQuery.set('');
                                setShowAutocomplete(false);
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-red-500 transition-colors"
                        >
                            <FiX className="w-4 h-4" />
                        </button>
                    )}

                    {/* Autocomplete Dropdown */}
                    {showAutocomplete && autocompleteSuggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden">
                            {autocompleteSuggestions.map((product, idx) => (
                                <button
                                    key={product.slug}
                                    onClick={() => handleAutocompleteClick(product.slug)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors ${idx !== autocompleteSuggestions.length - 1 ? 'border-b border-slate-100' : ''}`}
                                >
                                    {product.data.image && (
                                        <img
                                            src={product.data.image}
                                            alt=""
                                            className="w-10 h-10 object-contain bg-slate-100 rounded-lg"
                                        />
                                    )}
                                    <div className="flex-grow min-w-0">
                                        <p className="font-medium text-slate-900 truncate">{product.data.name}</p>
                                        <p className="text-sm text-slate-500">{product.data.brand} · KES {product.data.price.toLocaleString()}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex-shrink-0 w-full md:w-48">
                    <select
                        value={$sortOrder}
                        onChange={(e) => sortOrder.set(e.target.value)}
                        className="w-full appearance-none px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 font-medium text-slate-700 cursor-pointer hover:border-slate-300 transition-colors bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2364748b%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_12px] bg-no-repeat bg-[right_1rem_center]"
                    >
                        <option value="default">Relevance</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="name-asc">Name: A-Z</option>
                    </select>
                </div>
            </div>

            {/* Filters Grid - Hidden on mobile, shown on tablet+ */}
            <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-5 gap-3">
                {/* Category */}
                <select
                    value={$selectedCategory}
                    onChange={(e) => selectedCategory.set(e.target.value)}
                    className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 cursor-pointer hover:border-slate-300 transition-colors"
                >
                    <option value="all">All Categories</option>
                    {sortedCategories.map(cat => (
                        <option key={cat} value={cat}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)} ({facets.category[cat]})
                        </option>
                    ))}
                </select>

                {/* Brand */}
                <select
                    value={$selectedBrand}
                    onChange={(e) => selectedBrand.set(e.target.value)}
                    className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 cursor-pointer hover:border-slate-300 transition-colors"
                >
                    <option value="all">All Brands</option>
                    {sortedBrands.map(brand => (
                        <option key={brand} value={brand}>
                            {brand} ({facets.brand[brand]})
                        </option>
                    ))}
                </select>

                {/* Price Filter - Enhanced */}
                <div className="relative" ref={pricePanelRef}>
                    <button
                        onClick={() => setShowPricePanel(!showPricePanel)}
                        className={`w-full px-3 py-2.5 bg-slate-50 border rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer hover:border-slate-300 transition-colors flex items-center justify-between gap-2 ${$selectedPriceRange !== 'all' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200'
                            }`}
                    >
                        <span>
                            {$selectedPriceRange === 'all' ? 'Any Price' :
                                $selectedPriceRange === 'under15k' ? 'Under 15k' :
                                    $selectedPriceRange === '15k-30k' ? '15k - 30k' :
                                        $selectedPriceRange === '30k-50k' ? '30k - 50k' :
                                            $selectedPriceRange === 'above50k' ? 'Above 50k' : 'Custom'}
                        </span>
                        <svg className={`w-4 h-4 transition-transform ${showPricePanel ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {/* Price Panel Dropdown */}
                    {showPricePanel && (
                        <div className="absolute top-full left-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-50 p-4 w-[280px]">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Quick Ranges</p>
                            <div className="grid grid-cols-2 gap-2 mb-4">
                                {[
                                    { value: 'under15k', label: 'Under 15K' },
                                    { value: '15k-30k', label: '15K - 30K' },
                                    { value: '30k-50k', label: '30K - 50K' },
                                    { value: 'above50k', label: 'Above 50K' },
                                ].map(preset => (
                                    <button
                                        key={preset.value}
                                        onClick={() => {
                                            setPricePreset(preset.value);
                                            setShowPricePanel(false);
                                        }}
                                        className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${$selectedPriceRange === preset.value
                                            ? 'bg-emerald-500 text-white border-emerald-500'
                                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-emerald-300'
                                            }`}
                                    >
                                        {preset.label}
                                    </button>
                                ))}
                            </div>

                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Custom Range (KES)</p>
                            <div className="flex items-center gap-2 mb-4">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={$minPrice || ''}
                                    onChange={(e) => {
                                        minPrice.set(Number(e.target.value) || 0);
                                        selectedPriceRange.set('custom');
                                    }}
                                    className="w-24 min-w-0 px-2 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                />
                                <span className="text-slate-400 flex-shrink-0">to</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={$maxPrice || ''}
                                    onChange={(e) => {
                                        maxPrice.set(Number(e.target.value) || 200000);
                                        selectedPriceRange.set('custom');
                                    }}
                                    className="w-24 min-w-0 px-2 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                />
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        setPricePreset('all');
                                        setShowPricePanel(false);
                                    }}
                                    className="flex-1 px-3 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                                >
                                    Clear
                                </button>
                                <button
                                    onClick={() => setShowPricePanel(false)}
                                    className="flex-1 px-3 py-2 text-sm font-medium text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors"
                                >
                                    Apply
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Storage */}
                <select
                    value={$selectedStorage}
                    onChange={(e) => selectedStorage.set(e.target.value)}
                    className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 cursor-pointer hover:border-slate-300 transition-colors"
                >
                    <option value="all">Any Storage</option>
                    {sortedStorage.map(storage => (
                        <option key={storage} value={storage}>
                            {storage}GB ({facets.storage[storage]})
                        </option>
                    ))}
                </select>

                {/* RAM */}
                <select
                    value={$selectedRAM}
                    onChange={(e) => selectedRAM.set(e.target.value)}
                    className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 cursor-pointer hover:border-slate-300 transition-colors"
                >
                    <option value="all">Any RAM</option>
                    {sortedRAM.map(ram => (
                        <option key={ram} value={ram}>
                            {ram}GB ({facets.ram[ram]})
                        </option>
                    ))}
                </select>
            </div>

            {/* Clear All */}
            {hasActiveFilters && (
                <div className="mt-6 flex justify-center">
                    <button
                        onClick={resetFilters}
                        className="inline-flex items-center gap-2 px-6 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 font-medium rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400"
                    >
                        <span className="text-sm">Clear All</span>
                        <FiX className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
};

