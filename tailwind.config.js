/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        rosy: {
          50: '#FFF6F8',
          100: '#FFE8EE',
          200: '#FECDD8',
          300: '#F9A8BA',
          400: '#F08AA0',
          500: '#E8758F',
          600: '#D4537A',
          700: '#B53D64',
          800: '#8C2E4C',
          900: '#5C2034',
        },
        ink: '#2C1822',
        muted: '#5C3E48',
        champagne: '#C6A36A',
        gold: '#E8D5A3',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 24px 60px -28px rgba(181, 61, 100, 0.45)',
        glow: '0 0 0 1px rgba(232, 117, 143, 0.35), 0 16px 40px -18px rgba(181, 61, 100, 0.55)',
      },
    },
  },
  plugins: [],
}
