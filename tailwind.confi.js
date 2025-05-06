/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

module.exports = {
  content: [
    // Include App Router, Pages Router, and Components
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      /**
       * Theme colors
       * @see https://tailwindcss.com/docs/customizing-colors
       */
      colors: {
        // Custom brand colors
        primary: "#0054FF",
        "primary-dark": "#0046CC",
        accent: "#FF3B3F",
        "accent-dark": "#CC3232",
        background: "#FFFFFF",
        muted: "#F3F4F6",
        grey: {
          100: "#F3F4F6",
          300: "#D1D5DB",
          500: "#6B7280",
        },
        // Include default gray palette
        gray: colors.gray,
      },
      /**
       * Font families
       * @see https://tailwindcss.com/docs/font-family
       */
      fontFamily: {
        sans: ["Helvetica", '"Courier Prime"', ...defaultTheme.fontFamily.sans],
        mono: ['"Courier Prime"', ...defaultTheme.fontFamily.mono],
      },
      /**
       * Custom spacing scale
       * @see https://tailwindcss.com/docs/customizing-spacing
       */
      spacing: {
        "header-height": "4rem",
        "sidebar-width": "3rem",
        "input-height": "3rem",
      },
      /**
       * Border radius scale
       * @see https://tailwindcss.com/docs/border-radius
       */
      borderRadius: {
        md: "0.375rem",
      },
    },
  },
  plugins: [],
};
