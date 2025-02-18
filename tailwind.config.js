/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        'netflix-red': 'hsl(var(--netflix-red))',
        'netflix-red-hover': 'hsl(var(--netflix-red-hover))',
      },
      fontFamily: {
        sans: ['Netflix Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};