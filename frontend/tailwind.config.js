/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0f172a",
        card: "#1e293b",
        border: "#334155",
        primary: "#7c3aed", // violet
        secondary: "#06b6d4", // cyan
        muted: "#94a3b8",
        success: "#10b981",
        error: "#ef4444",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
