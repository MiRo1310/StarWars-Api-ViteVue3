/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/**/*.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    screens:{

      'xxs' : '300px',
      'xs': '640px',
      'md': '768px',   
      'lg': '1024px',
      'xl': '1280px',      
      '2xl': '1536px',      
    },
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
