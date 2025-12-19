# Product Creation Rules

When creating a new product file in `src/content/products/`, you **MUST** follow these rules to ensure consistency and prevent build errors.

## 1. File Structure
- **Extension**: Always use `.mdx`
- **Location**: Save in `d:/phoneshop/src/content/products/`
- **Naming**: Use kebab-case for the filename (e.g., `samsung-galaxy-s24.mdx`). This filename becomes the `slug`.

## 2. Frontmatter (Required Fields)
Every product MUST have this YAML frontmatter at the top:

```yaml
---
name: "Product Name"          # String: Full product name
price: 50000                  # Number: Price in KES (no commas)
category: "phone"             # Enum: 'phone', 'laptop', 'tablet', 'accessory'
brand: "Samsung"              # String: Brand name
image: "/images/products/..." # String: Path to image (use generic if specific missing)
inStock: true                 # Boolean: true or false
storage: 128                  # Number (Optional): Storage in GB
ram: 8                        # Number (Optional): RAM in GB
battery: 5000                 # Number (Optional): Battery in mAh
camera: "50MP"                # String (Optional): Main camera specs
screenSize: 6.5               # Number (Optional): Screen size in inches
processor: "Intel Core i5"    # String (Optional): Processor model
---
```

## 3. MDX Components
You should use the standardized components for the content body.

### Imports
Always import components at the top (after frontmatter):
```mdx
import { ProsCons } from '../../components/mdx/ProsCons';
import { TechSpecsTable } from '../../components/mdx/TechSpecsTable';
```

### Specs Table
Use the `<TechSpecsTable />` for detailed specs.
**Rule**: `value` MUST be a string. Do NOT use quotes inside quotes without escaping, or better yet, avoid quotes in the value text.
*   **Correct**: `value: "6.5 inches"`
*   **Incorrect**: `value: "6.5" inches"`

```tsx
<TechSpecsTable specs={[
  { key: "Display", value: "6.7 inches FHD+" },
  { key: "Processor", value: "Snapdragon 680" }
]} />
```

### Pros & Cons
Use the `<ProsCons />` component for reviews.
```tsx
<ProsCons 
  pros={["Good battery", "Nice screen"]}
  cons={["Slow charging"]}
/>
```

## 4. Content Guidelines
- **Title**: Start with an H2 (`## Name Price in Kenya...`).
- **Description**: Add 1-2 paragraphs describing the product value proposition.
- **Verdict**: End with a brief recommendation.
