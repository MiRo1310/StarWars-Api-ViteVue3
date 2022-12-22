/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/**/*.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
// that is animation class
animation: {
  fade: 'fadeOut 5s',
},

// that is actual animation
keyframes: theme => ({
  fadeOut: {
    '0%': { color: theme('colors.yellow.300') },
    '100%': { color: theme('colors.transparent') },
  },
}),

    },
  },
  plugins: [],
}
