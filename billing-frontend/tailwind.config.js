/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ===== JAINAM BRAND SYSTEM (redesign) =====
        // The three brand colors — used with real visual weight, not just as buttons.
        navy:   '#1E3A8A',   // Blueprint Navy
        coral:  '#FF5A5F',   // High-Tech Coral
        paper:  '#FFFFFF',   // Stark White
        // Supporting neutrals (structure only — never competing with the 3 brand colors)
        ink:      '#0F1B3D',
        'ink-soft': '#4A5578',
        line:     '#E4E7F2',

        // Legacy tokens kept as aliases so any untouched component still renders
        // sensibly instead of breaking (mapped onto the new light system).
        primary:    '#1E3A8A',
        secondary:  '#FF5A5F',
        accent:     '#F3F1EA',
        canvas:     '#FFFFFF',
        surface:    '#FFFFFF',
        ink_old: '#16181D',
        'ink-muted':'#68696B',
        hairline:   '#E4E7F2',
        dark: {
          bg:      '#FFFFFF',
          surface: '#FFFFFF',
          deep:    '#1E3A8A',
          border:  '#E4E7F2',
          text:    '#0F1B3D',
          muted:   '#4A5578',
          copper:  '#FF5A5F',
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
