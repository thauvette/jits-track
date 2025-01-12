/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          // navy
          50: '#f6f9f9',
          100: '#e5f1f7',
          200: '#c4e1ed',
          300: '#93c1d5',
          400: '#5b9cb5',
          500: '#437b95',
          600: '#376078',
          700: '#2c485b',
          800: '#1f3040',
          900: '#131d29',
        },
        purple: {
          50: '#f8f5fa',
          100: '#f2eaf5',
          200: '#e4d5ec',
          300: '#d2b9df',
          400: '#bc96cf',
          500: '#a370bd',
          600: '#874ca4',
          650: '#7d4698',
          700: '#6a3b81',
          800: '#5c3370',
          900: '#4a2a5b',
        },
        highlight: {
          // orange
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
      },
    },
  },
  plugins: [],
};
