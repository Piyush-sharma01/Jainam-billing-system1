/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
colors: {
  // ===== JAINAM BRAND SYSTEM =====
  navy:   '#223382',
  coral:  '#F98513',
  paper:  '#F4F1EC',

  // Supporting brand colors
  aster:  '#9BACD8',
  tan:    '#DAD1C8',
  deadly: '#111144',

  // Supporting neutrals
  ink:       '#0F1B3D',
  'ink-soft': '#4A5578',
  line:      '#E4E7F2',

  // Legacy tokens
  primary:    '#223382',
  secondary:  '#F98513',
  accent:     '#F3F1EA',
  canvas:     '#F4F1EC',
  surface:    '#F4F1EC',
  ink_old:    '#16181D',
  'ink-muted':'#68696B',
  hairline:   '#E4E7F2',

  dark: {
    bg:      '#F4F1EC',
    surface: '#F4F1EC',
    deep:    '#223382',
    border:  '#E4E7F2',
    text:    '#0F1B3D',
    muted:   '#4A5578',
    copper:  '#F98513',
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
