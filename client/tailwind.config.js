/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4F46E5", // Indigo-600
          hover: "#4338CA",   // Indigo-700
        },
        secondary: "#22C55E", // Green
        background: "#F9FAFB",
        text: "#111827",
        muted: "#6B7280",
        danger: "#EF4444",
      }
    },
  },
  plugins: [],
}
