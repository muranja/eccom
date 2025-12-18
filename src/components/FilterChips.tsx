/**
 * FilterChips Component
 * Shows active filters as removable pills
 */
import React from 'react';
import { useStore } from '@nanostores/react';
import { FiX } from 'react-icons/fi';
import {
    searchQuery,
    selectedCategory,
    selectedBrand,
    selectedPriceRange,
    selectedStorage,
    selectedRAM,
    resetFilters,
} from '../stores/filterStore';

interface FilterChip {
    label: string;
    value: string;
    onRemove: () => void;
}

export const FilterChips: React.FC = () => {
    const $searchQuery = useStore(searchQuery);
    const $category = useStore(selectedCategory);
    const $brand = useStore(selectedBrand);
    const $price = useStore(selectedPriceRange);
    const $storage = useStore(selectedStorage);
    const $ram = useStore(selectedRAM);

    const chips: FilterChip[] = [];

    if ($searchQuery) {
        chips.push({
            label: `"${$searchQuery}"`,
            value: $searchQuery,
            onRemove: () => searchQuery.set(''),
        });
    }

    if ($category !== 'all') {
        const categoryLabels: Record<string, string> = {
            phone: 'Phones',
            laptop: 'Laptops',
            tablet: 'Tablets',
            accessory: 'Accessories',
        };
        chips.push({
            label: categoryLabels[$category] || $category,
            value: $category,
            onRemove: () => selectedCategory.set('all'),
        });
    }

    if ($brand !== 'all') {
        chips.push({
            label: $brand,
            value: $brand,
            onRemove: () => selectedBrand.set('all'),
        });
    }

    if ($price !== 'all') {
        const priceLabels: Record<string, string> = {
            'under15k': 'Under KES 15k',
            '15k-30k': 'KES 15k - 30k',
            '30k-50k': 'KES 30k - 50k',
            'above50k': 'Above KES 50k',
        };
        chips.push({
            label: priceLabels[$price] || $price,
            value: $price,
            onRemove: () => selectedPriceRange.set('all'),
        });
    }

    if ($storage !== 'all') {
        chips.push({
            label: `${$storage}GB Storage`,
            value: $storage,
            onRemove: () => selectedStorage.set('all'),
        });
    }

    if ($ram !== 'all') {
        chips.push({
            label: `${$ram}GB+ RAM`,
            value: $ram,
            onRemove: () => selectedRAM.set('all'),
        });
    }

    if (chips.length === 0) return null;

    return (
        <div
            className="flex flex-wrap items-center gap-2 mb-4"
            role="region"
            aria-label="Active filters"
        >
            <span className="text-sm text-slate-500 font-medium">Filters:</span>
            {chips.map((chip, index) => (
                <button
                    key={`${chip.value}-${index}`}
                    onClick={chip.onRemove}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium hover:bg-emerald-100 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                    aria-label={`Remove ${chip.label} filter`}
                >
                    {chip.label}
                    <FiX className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
            ))}
            {chips.length > 1 && (
                <button
                    onClick={resetFilters}
                    className="text-sm text-slate-500 hover:text-red-600 font-medium transition-colors underline underline-offset-2"
                >
                    Clear All
                </button>
            )}
        </div>
    );
};
