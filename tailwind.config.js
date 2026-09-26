/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF5E00',
        secondary: '#243b53',
        accent: '#222732',
        neutral: '#2a2e37',
        'base-100': '#FFFFFF',
        'base-200': '#EFF3FA',
        'base-300': '#F6F6F6',
        'base-content': '#8B7676',
        'gold': "#FFD700",
        info: '#4A4A4A',
        success: '#16A34A',
        warning: '#e2d562',
        error: '#EF4444',
      },
      screens: {
        sm: '640px',
        lg: '1024px',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: false, // Disable DaisyUI themes
  },
};
