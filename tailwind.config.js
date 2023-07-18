/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors:{
        "primary": "#26A69A",
        "primary-100": "#1A736A",
        "secondary": "#80F2E7",
        "accent": "#0C5951",
        "neutral": "#263339",
        "base-100": "#E0F2F1",
        "info": "#E0F2E8",
        "success": "#BCE3E1",
        "warning": "#F2F1E0",
        "error": "#F1E0F2",
      }
    },
  },
  plugins: [],
}
