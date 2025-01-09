/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        primary: '#4A90E2',
        healing: '#50B2A1',
        lavender: '#9B8EB5',
        sand: '#F5E6D3',
        error: '#E66C7E',
        warning: '#FFD666',
        success: '#66BB6A',
        'dark-gray': '#2D3436',
        'medium-gray': '#636E72',
        'light-gray': '#B2BEC3',
        'off-white': '#F7F9FC',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      fontSize: {
        'display': ['40px', '48px'],
        'h1': ['32px', '40px'],
        'h2': ['24px', '32px'],
        'h3': ['20px', '28px'],
        'body-large': ['18px', '28px'],
        'body': ['16px', '24px'],
        'small': ['14px', '20px'],
        'caption': ['12px', '16px'],
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        'xxl': '48px',
      },
      borderRadius: {
        'lg': '8px',
        'xl': '12px',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0,0,0,0.1)',
      },
      animation: {
        'pulse-slow': 'pulse 2s infinite',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
  ],
}

