import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#2F5BFF",
          50: "#EEF2FF",
          100: "#E3EAFF",
          200: "#C7D6FF",
          400: "#5B7CFF",
          500: "#2F5BFF",
          600: "#2447DB",
          700: "#1B36AD",
        },
        navy: {
          DEFAULT: "#0A0F2C",
          900: "#070B1F",
          800: "#0A0F2C",
          700: "#101838",
          600: "#161F49",
        },
        ink: "#0D1220",
        muted: "#6B7280",
        surface: "#F5F7FF",
        good: "#16A34A",
        purple: "#6D28D9",
        amber: "#F5B400",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 23, 42, 0.04), 0 8px 24px rgba(15, 23, 42, 0.06)",
        soft: "0 12px 40px rgba(20, 30, 80, 0.10)",
      },
    },
  },
  plugins: [],
};
export default config;
