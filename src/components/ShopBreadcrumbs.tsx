/**
 * ShopBreadcrumbs Component
 * Dynamic breadcrumbs based on active filters
 */
import React from 'react';
import { useStore } from '@nanostores/react';
import { selectedCategory, selectedBrand } from '../stores/filterStore';
import { FiHome, FiChevronRight } from 'react-icons/fi';

interface BreadcrumbItem {
    label: string;
    href?: string;
    onClick?: () => void;
}

export const ShopBreadcrumbs: React.FC = () => {
    const $category = useStore(selectedCategory);
    const $brand = useStore(selectedBrand);

    const items: BreadcrumbItem[] = [
        { label: 'Home', href: '/' },
        { label: 'Shop', href: '/shop' },
    ];

    // Add category if active
    if ($category !== 'all') {
        const categoryLabel = $category.charAt(0).toUpperCase() + $category.slice(1) + 's';
        items.push({
            label: categoryLabel,
            onClick: () => {
                // Keep category, remove brand
                const params = new URLSearchParams();
                params.set('category', $category);
                window.history.pushState({}, '', `/shop?${params.toString()}`);
                selectedBrand.set('all');
            },
        });
    }

    // Add brand if active
    if ($brand !== 'all') {
        items.push({ label: $brand });
    }

    // Schema.org BreadcrumbList
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.label,
            ...(item.href && { "item": `https://sasagadgets.com${item.href}` })
        }))
    };

    return (
        <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center flex-wrap gap-1 text-sm">
                {items.map((item, index) => (
                    <li key={index} className="flex items-center">
                        {index > 0 && (
                            <FiChevronRight className="w-4 h-4 text-slate-400 mx-1" aria-hidden="true" />
                        )}
                        {index === 0 && (
                            <FiHome className="w-4 h-4 mr-1 text-slate-500" aria-hidden="true" />
                        )}
                        {item.href ? (
                            <a
                                href={item.href}
                                className="text-slate-600 hover:text-emerald-600 transition-colors"
                            >
                                {item.label}
                            </a>
                        ) : item.onClick ? (
                            <button
                                onClick={item.onClick}
                                className="text-slate-600 hover:text-emerald-600 transition-colors"
                            >
                                {item.label}
                            </button>
                        ) : (
                            <span className="text-slate-900 font-medium">{item.label}</span>
                        )}
                    </li>
                ))}
            </ol>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
        </nav>
    );
};
