/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Medium-inspired color palette
        'medium-green': '#1a8917',
        'medium-bg': '#ffffff',
        'medium-text': '#242424',
        'medium-text-secondary': '#6b6b6b',
        'medium-border': '#e6e6e6',
        'medium-accent': '#1a8917',
        'medium-hover': '#f9f9f9',
      },
      fontFamily: {
        // Instrument Serif for headings, system fonts for body
        serif: ['Instrument Serif', 'Georgia', 'serif'],
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'sans-serif'],
      },
      fontSize: {
        // Medium typography scale
        'medium-large': ['2.25rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'medium-h1': ['2rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'medium-h2': ['1.5rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        'medium-body': ['1.125rem', { lineHeight: '1.58' }],
        'medium-small': ['0.875rem', { lineHeight: '1.4' }],
      },
      maxWidth: {
        'medium': '680px',
        'medium-wide': '728px',
      },
      spacing: {
        'medium': '24px',
        'medium-large': '48px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography')({
      DEFAULT: {
        css: {
          // Force typography plugin to use Instrument Serif for headings
          'h1, h2, h3, h4, h5, h6': {
            fontFamily: '"Instrument Serif", Georgia, serif',
            fontWeight: '700',
          },
        },
      },
    }),
  ],
}
