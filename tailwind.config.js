/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Brand Colors - Re:Claim Recovery Theme
        brand: {
          primary: '#C85A8C', // Recovery pink
          secondary: '#4F9D9D', // Progress teal
          accent: '#F4A07A', // Warm orange
        },
        // Mood Colors
        mood: {
          sad: '#E46C86',
          neutral: '#F4C86B',
          happy: '#6FBF9C',
        },
        // Light Theme
        light: {
          background: '#FFF7FA',
          surface: '#FFFFFF',
          text: '#2B1F2A',
          'text-secondary': '#6F5B68',
          border: '#E9D6E0',
          muted: '#F2E8EE',
        },
        // Dark Theme
        dark: {
          background: '#1A1218',
          surface: '#241A22',
          text: '#F6EEF2',
          'text-secondary': '#C9B5C1',
          border: '#2F2530',
          muted: '#3B2E3A',
        },
        // Semantic Colors
        success: '#6FBF9C',
        warning: '#F4C86B',
        error: '#E15A6B',
        info: '#6B8CE5',
      },
      borderRadius: {
        // Hero UI inspired - larger, softer radius
        hero: '14px',
        'hero-lg': '18px',
        'hero-xl': '24px',
        'hero-2xl': '32px',
      },
      boxShadow: {
        // Hero UI inspired - soft, subtle shadows
        'hero-sm': '0 2px 8px rgba(0, 0, 0, 0.04)',
        hero: '0 4px 14px rgba(0, 0, 0, 0.06)',
        'hero-lg': '0 8px 24px rgba(0, 0, 0, 0.08)',
        'hero-xl': '0 12px 40px rgba(0, 0, 0, 0.1)',
      },
      fontFamily: {
        sans: ['System'],
      },
      fontSize: {
        'hero-xs': ['12px', { lineHeight: '16px' }],
        'hero-sm': ['14px', { lineHeight: '20px' }],
        'hero-base': ['16px', { lineHeight: '24px' }],
        'hero-lg': ['18px', { lineHeight: '28px' }],
        'hero-xl': ['20px', { lineHeight: '28px' }],
        'hero-2xl': ['24px', { lineHeight: '32px' }],
        'hero-3xl': ['30px', { lineHeight: '36px' }],
        'hero-4xl': ['36px', { lineHeight: '40px' }],
      },
      spacing: {
        'hero-xs': '4px',
        'hero-sm': '8px',
        'hero-md': '12px',
        'hero-lg': '16px',
        'hero-xl': '24px',
        'hero-2xl': '32px',
        'hero-3xl': '48px',
      },
    },
  },
  plugins: [],
};
