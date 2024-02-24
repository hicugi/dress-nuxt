import colors from "windicss/colors";
import { defineConfig } from "windicss/helpers";

export default defineConfig({
  darkMode: "class", // or 'media'
  extract: {
    include: [
      "**/*.{vue,html,jsx,tsx}",
      "./node_modules/vue-tailwind-datepicker/**/*.js",
    ],
    exclude: ["node_modules", ".git"],
  },
  theme: {
    extend: {
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      colors: {
        blue: colors.sky,
        red: colors.rose,
        pink: colors.fuchsia,
        "vtd-primary": colors.sky,
        "vtd-secondary": colors.gray,
      },
      fontFamily: {
        sans: ["Graphik", "sans-serif"],
        serif: ["Merriweather", "serif"],
      },
      spacing: {
        128: "32rem",
        144: "36rem",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [
    require("windicss/plugin/filters"),
    require("windicss/plugin/forms"),
    require("windicss/plugin/aspect-ratio"),
    require("windicss/plugin/line-clamp"),
    require("windicss/plugin/typography")({
      modifiers: ["DEFAULT", "sm", "lg", "red"],
    }),
  ],
});
