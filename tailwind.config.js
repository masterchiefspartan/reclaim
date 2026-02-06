/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Brand Colors - Reclaim Recovery Theme (Warm Amber)
        brand: {
          primary: '#F5A623', // Golden amber - main accent
          'primary-light': '#FBC56D',
          'primary-dark': '#D4890F',
          'primary-subtle': '#FEF3DC',
          secondary: '#4F9D9D', // Calming teal
          'secondary-light': '#7BB8B8',
          'secondary-dark': '#3A7A7A',
          accent: '#F4A07A', // Warm coral
          'accent-light': '#F7BFA3',
          'accent-dark': '#E8875A',
        },
        // Mood Colors
        mood: {
          happy: '#4CAF50',
          'happy-light': '#81C784',
          sad: '#E57373',
          'sad-light': '#FFCDD2',
          calm: '#4DB6AC',
          'calm-light': '#B2DFDB',
          anxious: '#FFD54F',
          'anxious-light': '#FFF8E1',
          neutral: '#9E9E9E',
          'neutral-light': '#E0E0E0',
          hopeful: '#64B5F6',
          'hopeful-light': '#BBDEFB',
          grateful: '#81C784',
          'grateful-light': '#C8E6C9',
          energized: '#FF8A65',
          'energized-light': '#FFCCBC',
        },
        // Light Theme (Warm Cream)
        light: {
          background: '#F5F2ED',
          'background-secondary': '#FAF8F5',
          surface: '#FFFFFF',
          'surface-elevated': '#FFFFFF',
          text: '#1A1A1A',
          'text-secondary': '#666666',
          'text-muted': '#999999',
          border: '#E8E5E0',
          'border-light': '#F0EDE8',
          divider: '#E0DDD8',
          muted: '#FEF3DC',
        },
        // Dark Theme
        dark: {
          background: '#121212',
          'background-secondary': '#1E1E1E',
          surface: '#1E1E1E',
          'surface-elevated': '#2D2D2D',
          text: '#F5F5F5',
          'text-secondary': '#B0B0B0',
          'text-muted': '#757575',
          border: '#333333',
          'border-light': '#2A2A2A',
          divider: '#3D3D3D',
          muted: 'rgba(245, 166, 35, 0.15)',
        },
        // Semantic Colors
        success: '#4CAF50',
        warning: '#FFC107',
        error: '#F44336',
        info: '#2196F3',
      },
      borderRadius: {
        // Hero UI inspired - larger, softer radius
        hero: '12px',
        'hero-lg': '16px',
        'hero-xl': '20px',
        'hero-2xl': '24px',
        'hero-3xl': '32px',
      },
      boxShadow: {
        // Hero UI inspired - soft, subtle shadows
        'hero-sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
        hero: '0 2px 8px rgba(0, 0, 0, 0.08)',
        'hero-lg': '0 4px 12px rgba(0, 0, 0, 0.1)',
        'hero-xl': '0 8px 24px rgba(0, 0, 0, 0.12)',
        // Amber glow for primary elements
        'hero-primary': '0 4px 12px rgba(245, 166, 35, 0.3)',
        // Card shadow
        card: '0 4px 16px rgba(0, 0, 0, 0.06)',
      },
      fontFamily: {
        sans: ['System'],
      },
      fontSize: {
        'hero-xs': ['10px', { lineHeight: '14px' }],
        'hero-sm': ['12px', { lineHeight: '16px' }],
        'hero-base': ['14px', { lineHeight: '20px' }],
        'hero-md': ['16px', { lineHeight: '24px' }],
        'hero-lg': ['18px', { lineHeight: '28px' }],
        'hero-xl': ['22px', { lineHeight: '28px' }],
        'hero-2xl': ['28px', { lineHeight: '36px' }],
        'hero-3xl': ['36px', { lineHeight: '44px' }],
        'hero-4xl': ['48px', { lineHeight: '56px' }],
      },
      spacing: {
        'hero-xxs': '2px',
        'hero-xs': '4px',
        'hero-sm': '8px',
        'hero-md': '12px',
        'hero-lg': '16px',
        'hero-xl': '20px',
        'hero-2xl': '24px',
        'hero-3xl': '32px',
        'hero-4xl': '40px',
        'hero-5xl': '48px',
      },
    },
  },
  plugins: [],
};
