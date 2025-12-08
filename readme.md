# Elsa CSS Framework ❄️

**Elsa** is a lightweight, classless CSS framework inspired by ice queen aesthetics, featuring elegant typography and a cool-toned color palette. Designed for content-focused websites, Elsa provides beautiful defaults for semantic HTML without requiring any classes, making it perfect for marketing pages, documentation, blogs, and internal tools. Built with a robust design token system using CSS custom properties and modern OKLCH colors, Elsa ensures visual consistency while remaining easy to customize and extend.

## Installation & Usage

### Basic Setup

Add the following line to the `<head>` of your HTML document:

```html
<link rel="stylesheet" href="elsa.css">
```

That's it! Your semantic HTML will automatically receive beautiful, cohesive styling.

### Expected Markup

Elsa works with standard semantic HTML5 elements:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>My Page</title>
  <link rel="stylesheet" href="elsa.css">
</head>
<body>
  <header>
    <h1>Welcome</h1>
    <nav>
      <a href="#about">About</a>
      <a href="#contact">Contact</a>
    </nav>
  </header>
  
  <main>
    <article>
      <h2>Article Title</h2>
      <p>Your content here...</p>
    </article>
  </main>
  
  <footer>
    <p>&copy; 2025 Your Name</p>
  </footer>
</body>
</html>
```

No classes required! Elsa styles all semantic elements automatically.

## Architecture

### Layer Structure

Elsa uses CSS `@layer` to manage cascade priority in a predictable way:

```css
@layer tokens, base, components, utilities, overrides;
```

**Layer Breakdown:**

- **`tokens`** – Design tokens (colors, spacing, typography, radius, shadows, transitions) defined as CSS custom properties in `:root`. No element rules exist here—only variable definitions.

- **`base`** – Pure element selectors (`body`, `h1`, `p`, `a`, `table`, `form`, etc.) that style semantic HTML without classes. This is the core of Elsa's "classless" approach.

- **`components`** – Optional reusable component classes (reserved for future expansion).

- **`utilities`** – Optional single-purpose helper classes (reserved for future expansion).

- **`overrides`** – Empty layer available for developers to add custom overrides that take precedence over framework styles.

### File Structure

Elsa is modular for maintainability:

```
elsa.css                (main file - imports all layers)
├── elsa-tokens.css     (design tokens layer)
├── elsa-base.css       (base element styles layer)
├── elsa-components.css (components layer - currently empty)
└── elsa-utilities.css  (utilities layer - currently empty)
```

The main `elsa.css` file imports each module into its respective layer, ensuring proper cascade order.

## Design Token System

All design decisions are defined as CSS custom properties in `elsa-tokens.css`, making the framework easy to customize.

### Color System

Elsa uses **OKLCH color space** for perceptually uniform colors with five main color families:

- **Gray** (`--color-gray-1` through `--color-gray-6`) – Cool-toned neutrals for text and borders
- **Ice** (`--color-ice-1` through `--color-ice-6`) – Primary theme color (blue/cyan)
- **Navy** (`--color-navy-1` through `--color-navy-5`) – Deep blue for contrast and text
- **Silver** (`--color-silver-1` through `--color-silver-5`) – Metallic tones for secondary elements
- **Lavender** (`--color-lavender-1` through `--color-lavender-5`) – Purple accent for highlights

Each family includes 5-6 shades (darkest to lightest), generated systematically using relative OKLCH values.

**Semantic Color Names:**

Color families are mapped to semantic tokens for clarity:

```css
--color-bg: var(--color-ice-6);        /* Page background */
--color-fg: var(--color-navy-1);       /* Text color */
--color-primary: var(--color-ice-3);   /* Primary accent */
--color-link: var(--color-ice-2);      /* Link color */
--color-border: var(--color-silver-3); /* Borders */
```

### Typography System

Elsa uses a **modular type scale** with a 1.4 ratio:

- **Display font**: Cormorant Garamond (elegant serif for headings)
- **Body font**: Montserrat (clean sans-serif for readability)

```css
--font-ratio: 1.4;
--font-size-h6: 1rem;
--font-size-h5: calc(1rem * 1.4);      /* 1.4rem */
--font-size-h4: calc(1.4rem * 1.4);    /* 1.96rem */
/* ... continues through h1 */
```

This creates harmonious visual hierarchy while allowing global adjustments by changing a single ratio value.

### Spacing System

Consistent spacing tokens follow a multiplicative scale:

```css
--space-xs: 0.25rem;
--space-sm: 0.5rem;
--space-md: 1rem;
--space-lg: 1.5rem;
--space-xl: 2rem;
--space-2xl: 3rem;
--space-3xl: 4rem;
```

### Additional Tokens

- **Border radius**: `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-full`
- **Shadows**: `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-ice` (themed glow)
- **Transitions**: `--transition-fast`, `--transition-base`, `--transition-slow`

## Features

### ✅ Classless Base Styling

Elsa styles all semantic HTML elements without requiring classes:

- Typography: `h1-h6`, `p`, `strong`, `em`, `small`, `mark`, `del`, `ins`, `abbr`
- Quotes: `blockquote`, `q`, `cite`
- Lists: `ul`, `ol`, `li`, `dl`, `dt`, `dd`
- Links: `a` (all states: link, hover, active, visited, focus-visible)
- Code: `code`, `pre`, `kbd`, `samp`
- Tables: `table`, `thead`, `tbody`, `tfoot`, `th`, `td`, `caption`
- Forms: `form`, `fieldset`, `legend`, `label`, `input`, `textarea`, `select`, `button`
- Media: `img`, `figure`, `figcaption`
- Interactive: `details`, `summary`
- Separators: `hr`

### ✅ Custom Form Styling

Forms are visually cohesive with elegant focus states:

- Consistent padding, borders, and border-radius across all input types
- Ice blue focus rings with subtle glows (accessible and attractive)
- Custom select dropdown arrows
- Button hover effects with subtle lift animation and icy shadow
- Themed checkbox/radio buttons using `accent-color`

### ✅ Micro-Interactions

Subtle transitions enhance user experience without being distracting:

- Link underlines fade in on hover
- Buttons lift slightly on hover with an icy glow shadow
- Table rows highlight on hover
- Form inputs glow when focused
- All transitions use design tokens (`--transition-fast`, etc.)

### ✅ Accessibility

Elsa prioritizes keyboard users and screen reader accessibility:

- Visible `:focus-visible` outlines on all interactive elements
- WCAG AA-level contrast between text and backgrounds
- Semantic HTML structure preserved
- No `outline: none` without proper replacements
- Hover states complemented by focus states (not hover-only interactions)

### ✅ Component Library

Elsa includes a comprehensive set of BEM-named components:

**Required Components:**
- **Buttons** (`.btn`) - Multiple variants (primary, secondary, frost, danger), sizes (sm, lg), and states
- **Cards** (`.card`) - Header, body, footer elements with frost, shadow, and bordered variants
- **Alerts** (`.alert`) - Info, success, warning, and danger message variants
- **Badges** (`.badge`) - Inline labels with multiple color variants

**Optional Components:**
- **Accordion** (`.accordion`) - Collapsible sections using native `<details>` elements
- **Progress Bars** (`.progress`) - Visual progress indicators with frost variant and sizing options

All components:
- Follow BEM naming convention (Block, Element, Modifier)
- Use design tokens exclusively (no hard-coded values)
- Include accessible focus states and ARIA-friendly markup
- Support composition (components work together seamlessly)

### ✅ Utility Classes

Over 100 single-purpose utility classes for quick styling adjustments:

**Display Utilities:**
- `.flex`, `.grid`, `.block`, `.inline`, `.inline-block`, `.hidden`

**Spacing Utilities:**
- Margin: `.mt-sm`, `.mb-lg`, `.ml-md`, `.mr-xs`, `.m-0`, `.m-auto`
- Padding: `.p-sm`, `.p-lg`, `.pt-md`, `.pb-lg`, `.px-md`, `.py-sm`, `.p-0`

**Text Utilities:**
- Alignment: `.text-left`, `.text-center`, `.text-right`
- Color: `.text-muted`, `.text-primary`, `.text-secondary`
- Size: `.text-sm`, `.text-base`, `.text-lg`
- Weight: `.font-normal`, `.font-medium`, `.font-semibold`, `.font-bold`
- Style: `.italic`, `.uppercase`

**Layout Utilities:**
- Containers: `.container`, `.container-sm`
- Sizing: `.w-full`, `.w-auto`, `.h-full`, `.h-auto`
- Flexbox: `.flex-row`, `.flex-col`, `.items-center`, `.justify-between`, `.gap-md`, `.flex-wrap`

**Color Utilities:**
- Background: `.bg-white`, `.bg-ice`, `.bg-frost`, `.bg-lavender`, `.bg-navy`
- Foreground: `.fg-white`, `.fg-muted`, `.fg-primary`, `.fg-navy`

**Visual Utilities:**
- Border radius: `.rounded-sm`, `.rounded-md`, `.rounded-lg`, `.rounded-full`
- Shadows: `.shadow-sm`, `.shadow-md`, `.shadow-lg`, `.shadow-ice`
- Borders: `.border`, `.border-ice`, `.border-none`

All utilities use design tokens and sit in the `@layer utilities` for predictable cascade behavior.

## Browser Support

Elsa uses modern CSS features:

- CSS `@layer` (cascade layers)
- OKLCH color space
- CSS custom properties (variables)
- Relative colors (`oklch(from ...)`)

**Recommended browsers:**
- Chrome/Edge 111+
- Firefox 113+
- Safari 16.4+

## Customization

To customize Elsa, override tokens in your own CSS:

```css
@layer overrides {
  :root {
    --color-primary: oklch(0.70 0.15 320); /* Change primary to pink */
    --font-ratio: 1.5;                      /* Increase heading size ratio */
    --space-md: 1.25rem;                    /* Adjust base spacing */
  }
}
```

The `overrides` layer has highest priority, allowing you to adjust any token without editing framework files.

## Development

### Running Locally (Important for Web Components!)

Web Components use JavaScript modules (`type="module"`), which are blocked by browser CORS policy when opening HTML files directly (`file://` protocol).

**To view Web Components, you must run a local web server:**

#### Mac/Linux:
```bash
cd /path/to/css-framework
python3 -m http.server 8000
```

Then open: `http://localhost:8000/web-components-demo.html`

#### Alternative (if Python not available):
- Use VS Code's "Live Server" extension
- Use Node.js `npx serve`
- Use any local development server

**Note:** CSS-only pages (`index.html`, `components-demo.html`) work fine when opened directly. Only Web Components require a server.

## Future Enhancements

Potential additions for future versions:

- Dark theme support (`.theme-dark`)
- Print stylesheet (`@media print`)
- Additional color palettes
- More component variants
- Animation library

## Credits

**Elsa CSS Framework** – Created by Faith Kauwe for ACS 3320 Advanced CSS  
Fonts: [Cormorant Garamond](https://fonts.google.com/specimen/Cormorant+Garamond) & [Montserrat](https://fonts.google.com/specimen/Montserrat) via Google Fonts

---

*Let it go, let it go, can't hold back your CSS anymore...* ❄️
