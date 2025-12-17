/**
 * ============================================================================
 * PRODUCT DATA & TYPES
 * ============================================================================
 * 
 * This file defines the Product interface used throughout the application.
 * It serves as the "contract" for product data, ensuring type safety.
 * 
 * USAGE:
 *   import type { Product } from '../data/products';
 * 
 * EXTENDING:
 *   To add new product fields, update the Product interface below.
 *   Then update src/content/config.ts to match the schema.
 * 
 * ============================================================================
 */

/**
 * Represents a product in the shop.
 * Fields map to the frontmatter in src/content/products/*.md files.
 */
export interface Product {
    /** Unique identifier (derived from filename slug in content collections) */
    id: string;

    /** Display name of the product */
    name: string;

    /** Price in KES (Kenyan Shillings) */
    price: number;

    /** Product category for filtering and display */
    category?: 'laptop' | 'phone' | 'accessory';

    /** Brand name (e.g., "HP", "Apple", "Samsung") */
    brand?: string;

    /** URL to product image */
    image?: string;

    /** Whether the product is available for purchase */
    inStock?: boolean;
}

/**
 * Sample products array for testing purposes.
 * In production, data comes from Content Collections (src/content/products/).
 */
export const sampleProducts: Product[] = [
    {
        id: 'hp-elitebook-840-g5',
        name: 'HP EliteBook 840 G5',
        price: 35000,
        category: 'laptop',
        brand: 'HP',
        inStock: true,
    },
    {
        id: 'iphone-13',
        name: 'iPhone 13 128GB',
        price: 85000,
        category: 'phone',
        brand: 'Apple',
        inStock: true,
    },
];
