## Example Sections

Here are examples of well-formatted sections:

### Example 1: Hero Section
HTML:
```html
<section class="pb-hero-full" style="background-color: var(--section-bg, #1a1a2e); color: var(--section-text, #ffffff); padding: var(--section-spacing, 6rem) 2rem; text-align: center;">
  <div style="max-width: 800px; margin: 0 auto;">
    <h1 style="font-size: 3rem; margin-bottom: 1rem;">Build Something Amazing</h1>
    <p style="font-size: 1.25rem; opacity: 0.9; margin-bottom: 2rem;">Create beautiful, responsive pages with our drag-and-drop builder. No coding required.</p>
    <a href="#" style="display: inline-block; background: var(--section-accent, #e94560); color: #fff; padding: 0.875rem 2rem; border-radius: 0.5rem; text-decoration: none; font-weight: 600;">Get Started</a>
  </div>
</section>
```
CSS:
```css
.pb-hero-full { min-height: 60vh; display: flex; align-items: center; justify-content: center; }
```

### Example 2: Features Grid Section
HTML:
```html
<section style="background-color: var(--section-bg, #ffffff); color: var(--section-text, #333333); padding: var(--section-spacing, 4rem) 2rem;">
  <div style="max-width: 1200px; margin: 0 auto; text-align: center;">
    <h2 style="font-size: 2rem; margin-bottom: 0.5rem;">Why Choose Us</h2>
    <p style="opacity: 0.7; margin-bottom: 3rem;">Everything you need to succeed</p>
    <div class="pb-features-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem;">
      <div style="padding: 2rem;">
        <div style="width: 48px; height: 48px; background: var(--section-accent, #e94560); border-radius: 0.75rem; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.5rem;">&#10022;</div>
        <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">Fast Performance</h3>
        <p style="opacity: 0.7;">Lightning-fast load times that keep your visitors engaged.</p>
      </div>
      <div style="padding: 2rem;">
        <div style="width: 48px; height: 48px; background: var(--section-accent, #e94560); border-radius: 0.75rem; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.5rem;">&#9672;</div>
        <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">Easy to Use</h3>
        <p style="opacity: 0.7;">Intuitive drag-and-drop interface anyone can master.</p>
      </div>
      <div style="padding: 2rem;">
        <div style="width: 48px; height: 48px; background: var(--section-accent, #e94560); border-radius: 0.75rem; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.5rem;">&#11041;</div>
        <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">Fully Responsive</h3>
        <p style="opacity: 0.7;">Looks perfect on every device, from mobile to desktop.</p>
      </div>
    </div>
  </div>
</section>
```
CSS:
```css
@media (max-width: 768px) { .pb-features-grid { grid-template-columns: 1fr !important; } }
```
