/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    fontSize: {
      xxs: ["0.5rem", "1rem"],
      xs: ["0.75rem", "1rem"],
      sm: ["0.875rem", "1.25rem"],
      base: ["1rem", "1.5rem"],
      lg: ["1.125rem", "1.75rem"],
      xl: ["1.25rem", "1.75rem"],
      "2xl": ["1.5rem", "2rem"],
      "3xl": ["1.875rem", "2.25rem"],
      "4xl": ["2.25rem", "2.5rem"],
      "5xl": ["3rem", "1"],
    },
    screens: {
      xxs: "300px",
      xs: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      // that is animation class
      animation: {
        fade: "fadeOut 5s",
      },

      // that is actual animation
      keyframes: (theme) => ({
        fadeOut: {
          "0%": { color: theme("dark:colors.yellow.300 colors.blue.300") },
          "100%": { color: theme("colors.transparent") },
        },
      }),
    },
  },
  plugins: [],
};
