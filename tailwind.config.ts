import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0A0A",
        foreground: "#FFFEFA",
        ink: "#191818",
        offwhite: "#FFFEFA",
        coral: {
          DEFAULT: "#FB575F",
          light: "#FF7D8A",
        },
        purple: {
          DEFAULT: "#8F53FC",
          light: "#A880FF",
        },
      },
      fontFamily: {
        sans: ["var(--font-urbanist)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-merriweather)", "ui-serif", "Georgia", "serif"],
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(90deg, #FB575F 0%, #8F53FC 100%)",
        "brand-gradient-light": "linear-gradient(90deg, #FF7D8A 0%, #A880FF 100%)",
        "brand-gradient-radial": "radial-gradient(circle, #FB575F 0%, #8F53FC 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
