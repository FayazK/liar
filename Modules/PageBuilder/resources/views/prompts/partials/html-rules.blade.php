## HTML Format Rules

You MUST follow these rules when generating HTML sections for GrapesJS:

1. **CSS Classes:** Use `pb-` prefixed CSS classes (e.g., `pb-hero-custom`, `pb-features-grid`).
2. **CSS Custom Properties:** Use these variables so style presets can restyle sections:
   - `--section-bg` — background color
   - `--section-text` — text color
   - `--section-accent` — accent/highlight color
   - `--section-spacing` — vertical padding
3. **Inline Styles:** Use inline styles for all visual styling. GrapesJS reads inline styles for its style manager.
4. **Section Wrapper:** Wrap each section in a `<section>` tag with a unique `pb-` class.
5. **Semantic HTML:** Use semantic elements: h1-h6, p, a, div, span, img, ul, ol, li.
6. **Responsive Layout:** Use max-width containers and flexible layouts (CSS grid or flexbox).
7. **Forbidden Elements:** Do NOT include `<script>`, `<iframe>`, event handlers (`onclick`, `onmouseover`, etc.), or external resources.
8. **Section Body Only:** Return ONLY the HTML for the section body. Do NOT include `<html>`, `<head>`, or `<body>` wrappers.
9. **Minimal CSS:** Keep the separate CSS minimal — use it only for responsive breakpoints and pseudo-elements. All other styling should be inline using CSS custom properties.
