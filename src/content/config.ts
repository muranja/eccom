import { defineCollection, z } from 'astro:content';

const products = defineCollection({
    type: 'content',
    schema: z.object({
        name: z.string(),
        price: z.number(),
        category: z.enum(['laptop', 'phone', 'accessory', 'tablet']),
        image: z.string().optional(),
        brand: z.string(),
        inStock: z.boolean().default(true),
        // Enhanced specs for filtering
        storage: z.number().optional(), // in GB
        ram: z.number().optional(), // in GB
        battery: z.number().optional(), // in mAh
        camera: z.string().optional(), // e.g., "64MP"
        screenSize: z.number().optional(), // in inches
        processor: z.string().optional(), // e.g., "Intel Core i5-8350U"
    }),
});

const blog = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(),
        pubDate: z.date(),
        author: z.string().default('Tech Shop Expert'),
        image: z.string().optional(),
        relatedProducts: z.array(z.string()).optional(), // references to product slugs
    }),
});

export const collections = {
    'products': products,
    'blog': blog,
};
