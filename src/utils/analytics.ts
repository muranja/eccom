/**
 * ============================================================================
 * ANALYTICS & EVENT TRACKING
 * ============================================================================
 * 
 * Centralized tracking for all user interactions.
 * Supports Google Analytics, Plausible, and console logging for development.
 * 
 * ============================================================================
 */

type EventCategory = 'ecommerce' | 'engagement' | 'error' | 'performance';

interface TrackEventParams {
    category: EventCategory;
    action: string;
    label?: string;
    value?: number;
    metadata?: Record<string, any>;
}

/**
 * Analytics Service
 * Handles all event tracking across the application
 */
class Analytics {
    private isProduction = import.meta.env.PROD;
    private isEnabled = typeof window !== 'undefined';

    /**
     * Track custom event
     */
    trackEvent({ category, action, label, value, metadata }: TrackEventParams) {
        // Console log in development
        if (!this.isProduction) {
            console.log('[Analytics]', { category, action, label, value, metadata });
        }

        if (!this.isEnabled || !this.isProduction) return;

        // Google Analytics 4
        if ((window as any).gtag) {
            (window as any).gtag('event', action, {
                event_category: category,
                event_label: label,
                value: value,
                ...metadata,
            });
        }

        // Plausible Analytics (if installed)
        if ((window as any).plausible) {
            (window as any).plausible(action, {
                props: { category, label, ...metadata },
            });
        }
    }

    /**
     * E-commerce Events
     */

    trackProductView(productId: string, productName: string, price: number) {
        this.trackEvent({
            category: 'ecommerce',
            action: 'view_item',
            label: productName,
            value: price,
            metadata: {
                product_id: productId,
                currency: 'KES',
            },
        });
    }

    trackAddToCart(productId: string, productName: string, price: number, quantity: number = 1) {
        this.trackEvent({
            category: 'ecommerce',
            action: 'add_to_cart',
            label: productName,
            value: price * quantity,
            metadata: {
                product_id: productId,
                quantity,
                currency: 'KES',
            },
        });
    }

    trackRemoveFromCart(productId: string, productName: string, price: number) {
        this.trackEvent({
            category: 'ecommerce',
            action: 'remove_from_cart',
            label: productName,
            value: price,
            metadata: {
                product_id: productId,
                currency: 'KES',
            },
        });
    }

    trackCheckoutStarted(cartValue: number, itemCount: number) {
        this.trackEvent({
            category: 'ecommerce',
            action: 'begin_checkout',
            value: cartValue,
            metadata: {
                item_count: itemCount,
                currency: 'KES',
            },
        });
    }

    trackWhatsAppClick(context: 'product' | 'cart' | 'checkout') {
        this.trackEvent({
            category: 'engagement',
            action: 'whatsapp_click',
            label: context,
        });
    }

    /**
     * Engagement Events
     */

    trackSearch(searchTerm: string, resultsCount: number) {
        this.trackEvent({
            category: 'engagement',
            action: 'search',
            label: searchTerm,
            value: resultsCount,
        });
    }

    trackFilterApplied(filterType: string, filterValue: string) {
        this.trackEvent({
            category: 'engagement',
            action: 'filter_applied',
            label: `${filterType}:${filterValue}`,
        });
    }

    trackCartPreviewOpened() {
        this.trackEvent({
            category: 'engagement',
            action: 'cart_preview_opened',
        });
    }

    /**
     * Error Tracking
     */

    trackError(errorMessage: string, errorStack?: string, errorContext?: string) {
        this.trackEvent({
            category: 'error',
            action: 'error_occurred',
            label: errorMessage,
            metadata: {
                stack: errorStack,
                context: errorContext,
            },
        });

        // Also log to console
        console.error('[Error Tracked]', errorMessage, errorStack);
    }

    /**
     * Performance Tracking
     */

    trackPageLoad(pageName: string, loadTime: number) {
        this.trackEvent({
            category: 'performance',
            action: 'page_load',
            label: pageName,
            value: Math.round(loadTime),
        });
    }
}

/**
 * Singleton instance
 */
export const analytics = new Analytics();
