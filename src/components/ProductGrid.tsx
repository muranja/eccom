/**
 * ============================================================================
 * PRODUCT GRID WITH ADVANCED FILTERING (React Island)
 * ============================================================================
 * Client-side filtered product display with multi-criteria filtering.
 * ============================================================================
 */

import React from 'react';
import { useStore } from '@nanostores/react';
import {
    searchQuery,
    selectedCategory,
    selectedBrand,
    selectedPriceRange,
    selectedStorage,
    selectedRAM,
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

    const PHONE_NUMBER = '254714389231';

    return (
        <>
            {filteredProducts.length === 0 ? (
                <div className="col-span-full text-center py-20 bg-white rounded-lg border border-dashed border-gray-300">
                    <div className="text-6xl mb-4">🔍</div>
                    <p className="text-xl text-gray-600">
                        No products found matching your criteria.
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                        Try adjusting your filters or search terms.
                    </p>
                </div>
            ) : (
                filteredProducts.map((product, index) => {
                    const whatsappMessage = encodeURIComponent(
                        `Hi! I'm interested in the ${product.data.name} (KES ${product.data.price.toLocaleString()}). Is this still available?`
                    );
                    const whatsappUrl = `https://wa.me/${PHONE_NUMBER}?text=${whatsappMessage}`;

                    return (
                        <div
                            key={product.slug}
                            className="group relative p-4 border border-slate-100 rounded-xl shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 bg-white overflow-hidden"
                        >
                            {/* Product Image */}
                            <a href={`/shop/${product.slug}`} className="block" aria-label={`View ${product.data.name} details`}>
                                <div className="relative h-48 w-full mb-4 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center">
                                    {product.data.image ? (
                                        <img
                                            src={product.data.image}
                                            alt={product.data.name}
                                            loading={index < 4 ? "eager" : "lazy"}
                                            decoding={index < 4 ? "sync" : "async"}
                                            fetchPriority={index < 4 ? "high" : "auto"}
                                            width={300}
                                            height={192}
                                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <span className="text-gray-400">No Image</span>
                                    )}
                                </div>
                            </a>

                            {/* Product Info */}
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider">
                                        {product.data.category}
                                    </p>
                                    <a href={`/shop/${product.slug}`}>
                                        <h3 className="font-bold text-lg text-slate-900 leading-tight hover:text-emerald-600 transition-colors">
                                            {product.data.name}
                                        </h3>
                                    </a>
                                </div>
                            </div>
                            <p className="text-gray-900 font-extrabold text-xl mt-2 mb-4">
                                KES {product.data.price.toLocaleString()}
                            </p>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                <a
                                    href={`/shop/${product.slug}`}
                                    className="flex-1 bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600 font-semibold shadow-sm transition-all active:scale-95 text-center"
                                >
                                    View Details
                                </a>
                                <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded flex items-center justify-center transition-all active:scale-95 shadow-sm"
                                    title="Chat on WhatsApp"
                                    aria-label={`Chat about ${product.data.name} on WhatsApp`}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    );
                })
            )}
        </>
    );
};
