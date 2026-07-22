import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0B0F19',
        surface: {
          DEFAULT: '#131826',
          hover: '#1B2233',
          raised: '#1A2035',
        },
        border: {
          DEFAULT: '#232B3D',
          subtle: '#1B2233',
        },
        primary: {
          DEFAULT: '#6366F1',
          hover: '#4F46E5',
          muted: '#312E81',
        },
        accent: {
          DEFAULT: '#A855F7',
          hover: '#9333EA',
        },
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
        text: {
          primary: '#F3F4F6',
          secondary: '#9CA3AF',
          muted: '#6B7280',
        },
        paper: '#FFFFFF',
        ink: {
          DEFAULT: '#111827',
          secondary: '#4B5563',
          muted: '#9CA3AF',
        },
        // CV şablonlarının vurgu renkleri — Canva tarzı, yumuşatılmış/mat
        // tonlar (bkz. src/lib/theme.ts, AccentColorId).
        'cv-accent': {
          antrasit: '#3F4A54',
          gri: '#75716C',
          bej: '#7C6449',
          ten: '#9C6B4E',
          bordo: '#7A3B45',
          lacivert: '#3A4D63',
          petrol: '#3F6259',
          hardal: '#9C7A3C',
          'toz-pembe': '#A9707A',
          zeytin: '#6B6F42',
        },
        // CV kağıdı için `cv-accent` tonlarının çok açık ("pastel")
        // versiyonları — koyu `ink` metin renkleriyle okunaklı kalması için
        // bilinçli olarak çok açık tutuldu (bkz. src/lib/theme.ts, PAPER
        // seçenekleri).
        'cv-paper': {
          antrasit: '#EEF0F1',
          gri: '#F1EFEC',
          bej: '#F5EEE4',
          ten: '#F7ECE3',
          bordo: '#F6E9EB',
          lacivert: '#EAEEF2',
          petrol: '#E9F0EE',
          hardal: '#F7F0E1',
          'toz-pembe': '#F7EBED',
          zeytin: '#F0F1E7',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '0.875rem',
      },
    },
  },
  plugins: [],
} satisfies Config
