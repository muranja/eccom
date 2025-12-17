# SasaGadgets 🛒

Modern e-commerce platform for selling phones, laptops, and tech gadgets in Kenya. Built with Astro, React, and TailwindCSS.

## Features

- 🚀 **Fast & Modern** - Built with Astro for blazing-fast performance
- 🛍️ **Shopping Cart** - Persistent cart with Nano Stores
- 📱 **Responsive Design** - Mobile-first approach
- 💳 **M-Pesa Integration** - Pay on delivery workflow
- 📊 **SEO Optimized** - Product schema markup
- 🔍 **Search & Filters** - Advanced product filtering
- 📝 **Blog** - Tech news and product reviews

## Tech Stack

- **Framework:** Astro 5.0
- **UI:** React 18 + TailwindCSS
- **State Management:** Nano Stores
- **Content:** Markdown with Astro Content Collections
- **Styling:** TailwindCSS

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/muranja/eccom.git
cd eccom

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:4321` to see your site.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run astro` - Run Astro CLI commands

## Project Structure

```
/
├── public/             # Static assets
├── src/
│   ├── components/     # React & Astro components
│   ├── content/        # Blog posts & products (Markdown)
│   ├── layouts/        # Page layouts
│   ├── pages/          # Routes & pages
│   ├── stores/         # Nano stores (cart state)
│   ├── styles/         # Global CSS
│   └── utils/          # Helper functions
├── astro.config.mjs    # Astro configuration
└── tailwind.config.mjs # Tailwind configuration
```

## Configuration

### Environment Variables

Create a `.env` file in the root:

```env
PUBLIC_PHONE_NUMBER=254714389231
PUBLIC_PAYBILL_NUMBER=247247
PUBLIC_ACCOUNT_NAME=TECH-STORE
```

## Deployment

The site is optimized for deployment on:

- **Netlify** (recommended)
- **Vercel**
- **Cloudflare Pages**

Simply connect your Git repository and deploy!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your own e-commerce needs.

## Contact

- **Website:** https://sasagadgets.com
- **WhatsApp:** +254714389231

---

Built with ❤️ in Nairobi, Kenya 🇰🇪
