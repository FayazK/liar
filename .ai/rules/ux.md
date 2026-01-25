# UI/UX Design Standards

## Visual Design (Shadow-Free)

**This project uses a flat, shadow-free design aesthetic**

✓ Use solid backgrounds with clear borders for depth and separation
✓ Create hierarchy through color, spacing, and typography (not shadows)
✓ Use border-radius for modern feel without shadows
✓ Leverage whitespace generously for clarity and breathing room
✓ Apply consistent spacing scale (4px, 8px, 16px, 24px, 32px, 48px)
✓ Differentiate interactive elements with color and border changes
✗ Never add box-shadow, drop-shadow, or text-shadow to any element
✗ Never use neumorphism or material design shadow patterns
✗ Never rely on shadows to indicate clickable elements

---

## Typography & Readability

✓ Body text minimum 16px (responsive to 14px on mobile if necessary)
✓ Line height 1.5-1.6 for body text (150-160%)
✓ Left-align all text blocks (never justify)
✓ Limit to 3 font families maximum
✓ Use font weight and size for hierarchy (not just color)
✓ Maintain heading structure: H1 → H2 → H3 (never skip levels)
✓ Keep line length 50-75 characters for optimal readability
✗ Never use font sizes below 12px
✗ Never use low-contrast text (minimum 4.5:1 for body, 3:1 for large text)
✗ Never use all-caps for long text (titles only)

---

## Color & Contrast (WCAG 2.2)

✓ Test all color combinations for 4.5:1 contrast minimum (normal text)
✓ Ensure 3:1 contrast for UI components and large text (19px+)
✓ Use color plus another indicator (icon, text, pattern) - never color alone
✓ Design for colorblind users (test with simulators)
✓ Use Ant Design theme tokens for all colors
✓ Maintain consistent color meaning (red=error, green=success, blue=info)
✗ Never rely on color alone to convey information or state
✗ Never use low contrast for aesthetic reasons
✗ Never hardcode hex colors in components

---

## Accessibility Requirements

### Touch Targets & Spacing
✓ Minimum 44×44 pixels for all interactive elements (buttons, links, inputs)
✓ Minimum 8px spacing between interactive elements
✓ Larger targets for primary actions (48×48 or bigger)

### Keyboard Navigation
✓ All functionality must work with keyboard only (Tab, Enter, Space, Arrows)
✓ Visible focus indicators with 3:1 contrast minimum
✓ Focus indicator at least 2px thick
✓ Logical tab order (left-to-right, top-to-bottom)
✓ Provide skip links to main content
✗ Never create keyboard traps (user can always exit modals/dropdowns)
✗ Never remove focus indicators without replacing them
✗ Never use mouse-only interactions

### Semantic HTML
✓ Use correct elements: button, a, nav, main, header, footer, article, section
✓ Use one H1 per page, maintain heading hierarchy
✓ Use label elements for all form inputs
✓ Use semantic HTML before adding ARIA (No ARIA is better than bad ARIA)
✓ Add alt text to all meaningful images
✗ Never use div/span with onClick when button/a is appropriate
✗ Never skip heading levels (H1 to H3)
✗ Never use placeholders as labels

---

## Human-Centered Content (Critical)

**Write for non-technical users with basic computer literacy (email, browsing)**

### Buttons & Actions
✓ Use action verbs that describe what happens: "Save Changes" "Create Account" "Download Report"
✓ Be specific about outcomes: "Send Message" not "Submit"
✓ Keep to 2-3 words when possible
✗ Never use technical jargon: "Submit" "Execute" "Deploy" "Authenticate"
✗ Never use vague labels: "OK" "Yes" "Continue" "Next" "Back"
✗ Never use developer terms visible to users

### Error Messages
✓ Explain what happened in plain language
✓ Explain why (if known)
✓ Tell users exactly how to fix it
✓ Be polite and helpful (never blame the user)
✓ Example: "Please check your email address - it needs to include an @ symbol"
✗ Never show technical errors: "Error 422: Validation failed" "NullPointerException"
✗ Never use generic messages: "An error occurred" "Something went wrong"
✗ Never use negative language: "Don't forget to..." → "Remember to..."

### Success Messages
✓ Confirm the action completed clearly
✓ Be specific about what happened
✓ Guide to next steps if applicable
✓ Example: "Your profile has been updated. Changes are visible immediately."
✗ Never leave users wondering if action worked
✗ Never use silent success (always confirm)

### General Copy
✓ Use conversational, friendly tone (write like talking to a person)
✓ Use active voice: "Save your changes" not "Changes will be saved"
✓ Use simple, everyday language (8th grade reading level)
✓ Use "you" and "your" to address users directly
✗ Never use technical terms without explanation
✗ Never use passive voice unnecessarily
✗ Never be overly formal or robotic
✗ Never use jargon: "authenticate" → "sign in", "parameters" → "settings"

---

## Form Design

### Structure & Labels
✓ Keep forms as short as possible (only essential fields)
✓ Use visible labels above or left of fields (always visible)
✓ Group related fields together with whitespace
✓ Use appropriate input types (email, tel, date, number for better mobile keyboards)
✓ Show password requirements before user starts typing
✓ Use help text below fields for clarification (not in placeholders)
✗ Never use placeholders as labels (they disappear when typing)
✗ Never show errors while user is still typing (premature validation)
✗ Never hide essential information in tooltips

### Validation & Errors
✓ Validate inline on blur (when user leaves field)
✓ Show errors immediately below the problem field
✓ Use red color plus error icon (not color alone)
✓ Provide specific, helpful error messages
✓ Mark required fields clearly with asterisk or "(required)"
✓ Disable submit button during processing with loading state
✗ Never validate while user is still typing
✗ Never show generic errors at top of form only
✗ Never use vague validation messages

---

## Loading States & Feedback

### Skeleton Screens (Preferred)
✓ Use skeleton screens for page/section loading (better than spinners)
✓ Match skeleton structure to actual content layout
✓ Animate with subtle shimmer or pulse
✓ Replace progressively as content loads
✓ Use for loads expected to take 2-10 seconds
✗ Never use for loads under 1 second (distracting)
✗ Never show static skeleton indefinitely

### Loading Indicators
✓ Use spinners for small operations (button actions, table rows)
✓ Show progress percentage for long operations (>10 seconds)
✓ Disable buttons during processing
✓ Update button text to show status: "Saving..." "Processing..."
✗ Never leave users guessing if something is happening
✗ Never use spinners for full-page loading (use skeleton instead)

### Optimistic Updates
✓ Update UI immediately for common actions (likes, favorites, simple edits)
✓ Provide rollback if server action fails
✓ Show error if action fails with option to retry
✗ Never use for critical operations (payments, deletions)
✗ Never leave UI in wrong state if action fails

---

## Empty States

✓ Explain why content area is empty
✓ Provide clear call-to-action to populate
✓ Use friendly illustration or icon
✓ Keep message positive and helpful
✓ Example: "You haven't created any projects yet. Click 'New Project' to get started."
✗ Never show just "No results" or "Empty"
✗ Never leave users confused about what to do

---

## Navigation & Wayfinding

✓ Keep navigation consistent across all pages
✓ Highlight current page/section clearly
✓ Use clear, descriptive labels (not clever/ambiguous names)
✓ Limit top-level nav to 5-7 items
✓ Provide breadcrumbs for deep hierarchies
✓ Make all nav items keyboard accessible
✗ Never use icon-only navigation without labels or tooltips
✗ Never change nav structure between sections
✗ Never hide essential navigation

---

## Responsive & Mobile

✓ Design mobile-first, then scale up
✓ Use bottom navigation for mobile complex apps
✓ Ensure touch targets are 44×44 minimum on mobile
✓ Test on real devices (not just browser resize)
✓ Use native input types for better mobile keyboards
✓ Stack elements vertically on mobile
✗ Never make mobile users zoom/pan to interact
✗ Never hide important features on mobile
✗ Never assume users have large screens

---

## UI/UX Anti-Patterns

✗ Adding shadows (box-shadow, drop-shadow, text-shadow)
✗ Using technical jargon in user-facing text
✗ Vague button text ("Submit" "OK" "Continue")
✗ Generic error messages ("Error occurred" "Invalid input")
✗ Placeholders as labels (labels must always be visible)
✗ Touch targets smaller than 44×44 pixels
✗ Low contrast text or UI elements
✗ Missing keyboard navigation or focus indicators
✗ Hardcoded colors instead of theme tokens
✗ Validating forms while user is still typing

---

## UI/UX Checklist

Before committing code:

- [ ] No shadows used anywhere (box-shadow, drop-shadow, text-shadow)
- [ ] All interactive elements minimum 44×44 pixels
- [ ] Color contrast meets WCAG 2.2 (4.5:1 for text, 3:1 for UI)
- [ ] All functionality works with keyboard only
- [ ] Focus indicators visible with 3:1 contrast
- [ ] Semantic HTML used (button, a, nav, main, header, footer)
- [ ] All form inputs have visible labels (not just placeholders)
- [ ] Button text is action-oriented: "Save Changes" not "Submit"
- [ ] Error messages are helpful: what happened, why, how to fix
- [ ] Success messages confirm what happened
- [ ] No technical jargon visible to users
- [ ] Loading states shown for operations over 1 second
- [ ] Empty states provide clear next actions
- [ ] Mobile responsive with touch targets 44×44 minimum
- [ ] Ant Design theme tokens used (no hardcoded colors)
