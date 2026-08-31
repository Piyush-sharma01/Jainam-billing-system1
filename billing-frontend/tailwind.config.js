/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Existing light tokens (admin + storefront shell)
        primary:    '#142C4C',
        secondary:  '#E8672A',
        accent:     '#F3F1EA',
        canvas:     '#FAFAF8',
        surface:    '#FFFFFF',
        ink:        '#16181D',
        'ink-muted':'#68696B',
        hairline:   '#E6E4DD',
        // Dark homepage tokens
        dark: {
          bg:      '#101820',
          surface: '#18232D',
          deep:    '#0C1219',
          border:  '#1E2D3D',
          text:    '#F4F0E6',
          muted:   '#8B949E',
          copper:  '#D9822B',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
        mono:    ['IBM Plex Mono', 'Menlo', 'monospace'],
      },
      fontSize: {
        'display-xl': ['clamp(2.5rem,7vw,6rem)', { lineHeight: '1.0', letterSpacing: '-0.03em' }],
        'display-lg': ['clamp(2rem,5vw,4rem)',   { lineHeight: '1.05', letterSpacing: '-0.025em' }],
        'display-md': ['clamp(1.5rem,3.5vw,2.75rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        ticker: {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'fade-up':   'fadeUp 0.7s cubic-bezier(0.2,0.8,0.2,1) both',
        'fade-up-d': 'fadeUp 0.7s 0.15s cubic-bezier(0.2,0.8,0.2,1) both',
        'fade-in':   'fadeIn 1s ease both',
        'ticker':    'ticker 32s linear infinite',
      },
    },
  },
  plugins: [],
}
