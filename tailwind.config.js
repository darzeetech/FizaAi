/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      animation: {
        slideInLeft: 'slideInLeft 0.3s ease-out',
      },
      keyframes: {
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      fontFamily: {
        Bungeeregular: ['Regular'],
        inter: ['Inter'],
        Roboto: ['Roboto'],
        Sen: ['Sen'],
        Bungee: ['Bungee'],
        Bungeea: ['Bungee Tint'],
        heading: ['DM Serif Display'],
      },
    },
  },
  plugins: [],
};
