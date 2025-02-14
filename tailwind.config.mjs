/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'neo-bg': '#EEF2F7',
        'neo-black': '#000000',
        'neo-accent': '#4ADE80',
        'neo-white': '#FFFFFF',
        'primary': '#4ADE80', // Green accent color from the image
        'secondary': '#475569',
        'background': '#EEF2F7', // Light blue/gray background
        'player': {
          'bg': '#000000', // Black player background
          'control': '#4ADE80', // Green control elements
        }
      },
      boxShadow: {
        'neo': '4px 4px 0 0 #000000',
      },
      fontFamily: {
        mono: ['VT323', 'monospace'],
        sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'fade-in-down': 'fadeInDown 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
