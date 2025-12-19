import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

import mdx from '@astrojs/mdx';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
    site: 'https://sasagadgets.com',
    // output: 'static', // Default in Astro 5
    adapter: node({
        mode: 'standalone',
    }),
    integrations: [tailwind(), react(), sitemap(), mdx()],
});