/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f0ff',
          100: '#e0e0ff',
          200: '#c7c7ff',
          300: '#a3a3ff',
          400: '#7a7aff',
          500: '#5c5cff',
          600: '#4040ff',
          700: '#3333e6',
          800: '#2a2ab8',
          900: '#262691',
          950: '#161655',
        },
        dark: {
          50: '#f6f6f9',
          100: '#ececf3',
          200: '#d6d6e4',
          300: '#b3b3cd',
          400: '#8a8ab1',
          500: '#6b6b97',
          600: '#56567d',
          700: '#474766',
          800: '#3d3d55',
          900: '#1a1a2e',
          950: '#0f0f1a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
