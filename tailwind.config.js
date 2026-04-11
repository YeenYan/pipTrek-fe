/** @type {import('tailwindcss').Config} */
export default {
  // Enable class-based dark mode
  darkMode: 'class',

  // Scan all Vue and TS/JS files for class usage
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],

  theme: {
    extend: {
      // Semantic color tokens mapped to CSS variables from design-system.css
      colors: {
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        surfaceHover: 'var(--color-surface-hover)',
        border: 'var(--color-border)',
        textPrimary: 'var(--color-text-primary)',
        textSecondary: 'var(--color-text-secondary)',
        primary: 'var(--color-primary)',
        primaryHover: 'var(--color-primary-hover)',
        accent: 'var(--color-accent)',
        danger: 'var(--color-danger)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
      },
    },
  },

  plugins: [],
}
