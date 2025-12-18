/**
 * Site Configuration
 * Centralized constants and helpers for the entire site
 */

export const SITE_CONFIG = {
    name: "SasaGadgets",
    tagline: "Get Gadgets Now",
    url: "https://sasagadgets.com",

    // Contact
    phone: "254714389231",
    whatsappNumber: "254714389231",

    // Location
    location: {
        city: "Nairobi",
        area: "CBD",
        country: "Kenya",
        countryCode: "KE",
    },

    // Social
    social: {
        whatsapp: "https://wa.me/254714389231",
    },

    // Business
    currency: "KES",
    deliveryAreas: ["Nairobi", "Mombasa", "Kisumu", "Nakuru"],
} as const;

/**
 * Generate WhatsApp URL with pre-filled message
 */
export function getWhatsAppUrl(message: string): string {
    return `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Generate WhatsApp message for product inquiry
 */
export function getProductWhatsAppUrl(productName: string, price: number): string {
    const message = `Hi! I'd like to purchase the ${productName} (KES ${price.toLocaleString()}). Is it still in stock?`;
    return getWhatsAppUrl(message);
}

/**
 * Format price with currency
 */
export function formatPrice(price: number): string {
    return `KES ${price.toLocaleString()}`;
}
