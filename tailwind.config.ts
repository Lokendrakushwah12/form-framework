import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["var(--font-inter)"],
      },
    },
  },
  plugins: [],
};

export default config;
