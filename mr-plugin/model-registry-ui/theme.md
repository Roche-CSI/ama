# Daisy UI Custom Theme Usage Guide

## Using Theme Colors in Components

Daisy UI provides utility classes that correspond to your theme colors. Here are some examples:

```html
<!-- Using primary color -->
<button class="btn btn-primary">Primary Button</button>

<!-- Using secondary color as background -->
<div class="bg-secondary text-secondary-content p-4">
  This div has a secondary background color
</div>

<!-- Using accent color for text -->
<p class="text-accent">This text is in the accent color</p>

<!-- Using base colors -->
<div class="bg-base-100 text-base-content">
  This uses your main background and text colors
</div>
```

## Best Practices

### 1. Consistent Color Usage
- Use `primary` for main actions or emphasis
- Use `secondary` for alternative actions
- Use `accent` sparingly for highlights or to draw attention
- Use `base-100` as your main background color
- Use `base-content` as your main text color

### 2. Accessibility
- Ensure sufficient contrast between background and text colors
- Use `*-content` colors (e.g., `primary-content`) for text on colored backgrounds

### 3. Responsive Design
Daisy UI is built on Tailwind, so use Tailwind's responsive prefixes:

```html
<button class="btn btn-primary md:btn-secondary lg:btn-accent">
  Responsive Button
</button>
```

### 4. Customizing Components
Extend Daisy UI components using Tailwind classes:

```html
<button class="btn btn-primary hover:bg-primary-focus">
  Custom Hover Effect
</button>
```

### 5. Dark Mode
- If you want to support dark mode, consider creating a separate dark theme
- Use the `data-theme` attribute to switch themes

### 6. Use Semantic Classes
- Prefer semantic classes like `btn-primary` over direct color classes like `bg-primary`
- This makes it easier to maintain and update your theme

### 7. Avoid Hardcoding Colors
- Instead of using hex values directly, use theme color classes
- This ensures consistency and makes it easier to update your theme globally

### 8. Component-Specific Theming
- For components that need specific styling, consider creating custom utility classes in your Tailwind config

### 9. Use Base Colors for Layout
Use `base-100`, `base-200`, and `base-300` for different levels of your layout:

```html
<div class="bg-base-100">
  <header class="bg-base-200">...</header>
  <main class="bg-base-100">...</main>
  <footer class="bg-base-300">...</footer>
</div>
```

### 10. State Management
Use appropriate colors for different states:

```html
<button class="btn btn-primary hover:btn-primary-focus active:btn-primary-focus">
  Interactive Button
</button>
```

## Remember

These theme colors are tied to your custom theme:
- `primary` refers to your LogoBlue (#1E82FF)
- `secondary` refers to your LogoLightBlue (#4095FF)
- `accent` refers to your LogoDarkBlue (#0064FF)

This makes it easy to maintain a consistent look across your application.

## Updating the Theme

If you need to update the theme colors or add new variations:

1. Modify the `daisyui-theme.js` file in your project
2. Rebuild your CSS (usually done automatically if you're using a build process)
3. The changes will be reflected everywhere you've used the theme color classes

By following these guidelines, you'll create a consistent, maintainable, and visually appealing UI with your custom Daisy UI theme.
