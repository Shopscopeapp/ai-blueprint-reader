import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3B82F6",
          dark: "#1E3A8A",
        },
        secondary: {
          DEFAULT: "#8B5CF6",
          cyan: "#06B6D4",
        },
        accent: {
          DEFAULT: "#10B981",
        },
        background: {
          dark: "#0F172A",
          light: "#FFFFFF",
        },
        text: {
          light: "#F8FAFC",
          dark: "#1E293B",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;


