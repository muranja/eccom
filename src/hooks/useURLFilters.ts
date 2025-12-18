/**
 * useURLFilters Hook
 * Syncs filter store with URL query parameters
 */
import { useEffect, useRef } from 'react';
import { useStore } from '@nanostores/react';
import {
    searchQuery,
    selectedCategory,
    selectedBrand,
    selectedPriceRange,
    selectedStorage,
    selectedRAM,
    sortOrder,
    initFromURL,
    toURLParams,
} from '../stores/filterStore';

export function useURLFilters() {
    const isInitialized = useRef(false);

    // Subscribe to all filter stores
    const $searchQuery = useStore(searchQuery);
    const $category = useStore(selectedCategory);
    const $brand = useStore(selectedBrand);
    const $price = useStore(selectedPriceRange);
    const $storage = useStore(selectedStorage);
    const $ram = useStore(selectedRAM);
    const $sort = useStore(sortOrder);

    // Initialize from URL on mount
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const params = new URLSearchParams(window.location.search);
        initFromURL(params);
        isInitialized.current = true;
    }, []);

    // Update URL when filters change
    useEffect(() => {
        if (typeof window === 'undefined' || !isInitialized.current) return;

        const params = toURLParams();
        const newURL = params.toString()
            ? `${window.location.pathname}?${params.toString()}`
            : window.location.pathname;

        // Use replaceState to avoid polluting browser history
        window.history.replaceState({}, '', newURL);
    }, [$searchQuery, $category, $brand, $price, $storage, $ram, $sort]);

    // Handle browser back/forward
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handlePopState = () => {
            const params = new URLSearchParams(window.location.search);
            initFromURL(params);
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);
}
