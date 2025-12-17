# Project Rules & Guidelines

## 1. Architecture: 'No-Backend' & 'Island'
- **Framework**: Astro (Static Site Generation).
- **State**: Nano Stores (Lightweight, framework-agnostic).
- **Styling**: Tailwind CSS (Utility-first).
- **Data**: Content Collections (`src/content/`). **DO NOT** use external databases unless absolutely necessary.
- **Client JS**: Keep it to absolute minimum. Use `<script>` tags sparingly or Astro Islands (`client:load`) only for interactive components (Cart, Search).

## 2. SEO & Content Strategy (The "Traffic Engine")
> "Content brings them in, WhatsApp closes the deal."

- **Schema.org**: MUST include `JSON-LD` on every page.
    - `Product` schema for Shop pages.
    - `Article` schema for Blog pages.
    - `Organization` schema for Home page.
- **Meta Tags**: Title (50-60 chars) and Description (150-160 chars) are MANDATORY.
- **Images**:
    - MUST use Astro `<Image />` component for optimization.
    - MUST have descriptive `alt` text containing keywords.

## 3. Design & UI/UX (The "Trust Engine")
- **Color Psychology**:
    - **Primary**: `#0f172a` (Slate-900) or Deep Royal Blue. Represents Authority & Trust.
    - **Secondary**: `#10b981` (Emerald-500). Represents WhatsApp & Success.
    - **Accent**: `#f59e0b` (Amber-500). Represents "Gold/Premium" & Urgency.
- **Typography**: `Inter` or `Outfit` (Modern, Clean).
- **Whitespace**: Use generous padding. Clutter = Cheap.
- **Feedback**: Buttons must have `:hover` and `:active` states.

## 4. Coding Standards
- **TypeScript**: Strict mode enabled. No `any`.
- **Naming**: `cartStore`, `checkoutUtils`, `ProductCard` (PascalCase for Components, camelCase for logic).
- **Cleanliness**: Remove all `console.log` before committing.
- **Imports**: Use aliases (`@/components`, `@/layouts`) where possible.
