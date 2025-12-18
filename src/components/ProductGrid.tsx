/**
 * ============================================================================
 * PRODUCT GRID WITH ADVANCED FILTERING (React Island)
 * ============================================================================
 * Client-side filtered product display with multi-criteria filtering,
 * sorting, product count, and enhanced accessibility.
 * ============================================================================
 */

import React from 'react';
import { useStore } from '@nanostores/react';
import { FiSearch, FiHardDrive, FiCpu, FiPackage } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
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
        image?: string;
        inStock: boolean;
        storage?: number;
        ram?: number;
        battery?: number;
        camera?: string;
        screenSize?: number;
    };
}

interface ProductGridProps {
    products: Product[];
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
    const $searchQuery = useStore(searchQuery);
    const $selectedCategory = useStore(selectedCategory);
    const $selectedBrand = useStore(selectedBrand);
    const $selectedPriceRange = useStore(selectedPriceRange);
    const $selectedStorage = useStore(selectedStorage);
    const $selectedRAM = useStore(selectedRAM);
    const $sortOrder = useStore(sortOrder);

    // Filter products based on all criteria
    const filteredProducts = products.filter((product) => {
        // Search filter
        const matchesSearch =
            product.data.name.toLowerCase().includes($searchQuery.toLowerCase()) ||
            product.data.brand.toLowerCase().includes($searchQuery.toLowerCase());

        // Category filter
        const matchesCategory =
            $selectedCategory === 'all' || product.data.category === $selectedCategory;

        // Brand filter
        const matchesBrand =
            $selectedBrand === 'all' || product.data.brand === $selectedBrand;

        // Price range filter
        let matchesPrice = true;
        if ($selectedPriceRange !== 'all') {
            const price = product.data.price;
            switch ($selectedPriceRange) {
                case 'under15k':
                    matchesPrice = price < 15000;
                    break;
                case '15k-30k':
                    matchesPrice = price >= 15000 && price < 30000;
                    break;
                case '30k-50k':
                    matchesPrice = price >= 30000 && price < 50000;
                    break;
                case 'above50k':
                    matchesPrice = price >= 50000;
                    break;
            }
        }

        // Storage filter
        let matchesStorage = true;
        if ($selectedStorage !== 'all' && product.data.storage) {
            const storageValue = parseInt($selectedStorage);
            if ($selectedStorage === '256') {
                matchesStorage = product.data.storage >= storageValue;
            } else {
                matchesStorage = product.data.storage === storageValue;
            }
        }

        // RAM filter
        let matchesRAM = true;
        if ($selectedRAM !== 'all' && product.data.ram) {
            const ramValue = parseInt($selectedRAM);
            if ($selectedRAM === '6' || $selectedRAM === '8') {
                matchesRAM = product.data.ram >= ramValue;
            } else {
                matchesRAM = product.data.ram === ramValue;
            }
        }

        return (
            matchesSearch &&
            matchesCategory &&
            matchesBrand &&
            matchesPrice &&
            matchesStorage &&
            matchesRAM
        );
    });

    // Sort products
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch ($sortOrder) {
            case 'price-asc':
                return a.data.price - b.data.price;
            case 'price-desc':
                return b.data.price - a.data.price;
            case 'name-asc':
                return a.data.name.localeCompare(b.data.name);
            default:
                return 0;
        }
    });

    const PHONE_NUMBER = '254714389231';
    const totalProducts = products.length;
    const filteredCount = sortedProducts.length;

    // Build suggestion buttons for empty state
    const getSuggestions = () => {
        const suggestions: { label: string; action: () => void }[] = [];

        if ($selectedBrand !== 'all') {
            suggestions.push({
                label: `All ${$selectedBrand}`,
                action: () => {
                    selectedCategory.set('all');
                    selectedPriceRange.set('all');
                    selectedStorage.set('all');
                    selectedRAM.set('all');
                },
            });
        }

        if ($selectedCategory !== 'all') {
            const categoryLabel = $selectedCategory.charAt(0).toUpperCase() + $selectedCategory.slice(1) + 's';
            suggestions.push({
                label: `All ${categoryLabel}`,
                action: () => {
                    selectedBrand.set('all');
                    selectedPriceRange.set('all');
                    selectedStorage.set('all');
                    selectedRAM.set('all');
                },
            });
        }

        suggestions.push({
            label: 'Clear All Filters',
            action: resetFilters,
        });

        return suggestions;
    };

    return (
        <>
            {/* Product Count - Accessible live region */}
            <div
                className="col-span-full mb-4"
                role="status"
                aria-live="polite"
                aria-atomic="true"
            >
                <p className="text-sm text-slate-600">
                    Showing <span className="font-semibold text-slate-900">{filteredCount}</span> of{' '}
                    <span className="font-semibold text-slate-900">{totalProducts}</span> products
                </p>
            </div>

            {sortedProducts.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-gray-300 shadow-sm">
                    <FiPackage className="w-16 h-16 text-slate-300 mb-4" aria-hidden="true" />
                    <p className="text-xl font-bold text-slate-800 mb-2">
                        No products found
                    </p>
                    <p className="text-base text-gray-500 max-w-md text-center mb-6">
                        {$selectedBrand !== 'all' && $selectedCategory !== 'all'
                            ? `No ${$selectedBrand} ${$selectedCategory}s match your filters.`
                            : $selectedBrand !== 'all'
                                ? `No ${$selectedBrand} products match your filters.`
                                : $selectedCategory !== 'all'
                                    ? `No ${$selectedCategory}s match your filters.`
                                    : "We couldn't find matches for your criteria."
                        }
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                        {getSuggestions().map((suggestion, index) => (
                            <button
                                key={index}
                                onClick={suggestion.action}
                                className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg font-medium hover:bg-emerald-100 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            >
                                {suggestion.label}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                sortedProducts.map((product, index) => {
                    const whatsappMessage = encodeURIComponent(
                        `Hi! I'm interested in the ${product.data.name} (KES ${product.data.price.toLocaleString()}). Is this still available?`
                    );
                    const whatsappUrl = `https://wa.me/${PHONE_NUMBER}?text=${whatsappMessage}`;

                    return (
                        <div
                            key={product.slug}
                            className="group relative flex flex-col h-full bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 border border-slate-200 overflow-hidden"
                        >
                            {/* Product Image */}
                            <a href={`/shop/${product.slug}`} className="block relative overflow-hidden" aria-label={`View ${product.data.name} details`}>
                                <div className="aspect-[4/3] w-full bg-slate-100 flex items-center justify-center p-6 transition-colors duration-300 group-hover:bg-slate-50">
                                    {product.data.image ? (
                                        <img
                                            src={product.data.image}
                                            alt={product.data.name}
                                            width="300"
                                            height="225"
                                            loading={index < 6 ? "eager" : "lazy"}
                                            decoding={index < 6 ? "sync" : "async"}
                                            fetchPriority={index < 3 ? "high" : "auto"}
                                            className="object-contain w-full h-full mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <span className="text-gray-400 font-medium">No Image</span>
                                    )}
                                </div>
                                {/* Floating Badge */}
                                <div className="absolute top-3 left-3">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide bg-white/90 backdrop-blur-sm text-emerald-700 shadow-sm border border-emerald-100">
                                        {product.data.category}
                                    </span>
                                </div>
                                {/* Stock Badge */}
                                {!product.data.inStock && (
                                    <div className="absolute top-3 right-3">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide bg-red-100 text-red-700">
                                            Out of Stock
                                        </span>
                                    </div>
                                )}
                            </a>

                            {/* Product Info */}
                            <div className="flex flex-col flex-grow p-5">
                                <a href={`/shop/${product.slug}`} className="group-hover:text-emerald-700 transition-colors">
                                    <h3 className="font-bold text-lg text-slate-900 leading-snug mb-1 line-clamp-2">
                                        {product.data.name}
                                    </h3>
                                </a>

                                {/* Specs Preview */}
                                <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 mt-2 flex-wrap">
                                    {product.data.storage && (
                                        <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                            <FiHardDrive className="h-3 w-3" aria-hidden="true" /> {product.data.storage}GB
                                        </span>
                                    )}
                                    {product.data.ram && (
                                        <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                            <FiCpu className="h-3 w-3" aria-hidden="true" /> {product.data.ram}GB
                                        </span>
                                    )}
                                </div>

                                <div className="mt-auto pt-4 border-t border-slate-100">
                                    <div className="flex items-baseline justify-between mb-4">
                                        <p className="text-slate-900 font-extrabold text-xl">
                                            <span className="text-sm font-normal text-gray-500 mr-1">KES</span>
                                            {product.data.price.toLocaleString()}
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="grid grid-cols-5 gap-2">
                                        <a
                                            href={`/shop/${product.slug}`}
                                            className="col-span-3 flex items-center justify-center bg-slate-900 text-white px-4 py-2.5 rounded-lg hover:bg-slate-800 font-semibold shadow-sm hover:shadow transition-all active:scale-[0.98] text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                                        >
                                            View Details
                                        </a>
                                        <a
                                            href={whatsappUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="col-span-2 flex items-center justify-center bg-emerald-600 text-white px-3 py-2.5 rounded-lg hover:bg-emerald-700 transition-all active:scale-[0.98] shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                                            title="Chat on WhatsApp"
                                            aria-label={`Chat about ${product.data.name} on WhatsApp`}
                                        >
                                            <span className="font-medium mr-1.5 hidden sm:inline text-sm">Chat</span>
                                            <FaWhatsapp className="h-5 w-5" aria-hidden="true" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })
            )}
        </>
    );
};
