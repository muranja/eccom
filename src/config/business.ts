/**
 * ============================================================================
 * BUSINESS CONFIGURATION
 * ============================================================================
 * 
 * Single source of truth for all business constants.
 * Update values here instead of searching through multiple files.
 * 
 * ============================================================================
 */

/**
 * Business Configuration Object
 * All business-related constants in one place
 */
export const BUSINESS_CONFIG = {
    // Contact Information
    phone: import.meta.env.PUBLIC_PHONE_NUMBER || '254714389231',
    paybill: import.meta.env.PUBLIC_PAYBILL_NUMBER || '247247',
    accountName: import.meta.env.PUBLIC_ACCOUNT_NAME || 'TECH-STORE',

    // Business Details
    businessName: 'SasaGadgets',
    location: 'Nairobi CBD',
    country: 'Kenya',

    // SEO & Branding
    tagline: 'Get Gadgets Now (Sasa!)',
    description: 'Latest smartphones, laptops & tech delivered to your doorstep.',

    // URLs
    siteUrl: import.meta.env.PUBLIC_SITE_URL || 'https://sasagadgets.com',

    // Operating Hours
    workingHours: {
        open: '08:00',
        close: '18:00',
        timezone: 'Africa/Nairobi',
        days: 'Monday - Saturday',
    },

    // Delivery
    delivery: {
        freeDeliveryArea: 'Nairobi CBD',
        deliveryMessage: 'FREE Delivery within Nairobi CBD',
    },
} as const;

/**
 * Helper: Generate WhatsApp URL with pre-filled message
 */
export function getWhatsAppUrl(message: string, phoneNumber?: string): string {
    const phone = phoneNumber || BUSINESS_CONFIG.phone;
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/**
 * Helper: Generate product WhatsApp message
 */
export function getProductWhatsAppMessage(productName: string, price: number): string {
    return `Hi! I'm interested in the ${productName} (KES ${price.toLocaleString()}). Is this still available?`;
}

/**
 * Helper: Generate checkout WhatsApp message
 */
export function getCheckoutWhatsAppMessage(productName: string, price: number): string {
    return `Hi! I'd like to purchase the ${productName} (KES ${price.toLocaleString()}). Is it still in stock?`;
}

/**
 * Type-safe access to business config
 */
export type BusinessConfig = typeof BUSINESS_CONFIG;
