/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],

  theme: {
    extend: {
      colors: {
        luster: "#F4F1EC",
        aster: "#9BACD8",
        habanero: "#F98513",
        tan: "#DAD1C8",
        royal: "#223382",
        deadly: "#111144",

        ink: "#111144",
        "ink-soft": "#5E6680",
        line: "#DAD1C8",

        primary: "#223382",
        secondary: "#F98513",
        accent: "#9BACD8",
        canvas: "#F4F1EC",
        surface: "#FFFFFF",
      },

      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "Menlo", "monospace"],
      },

      fontSize: {
        "display-xl": [
          "clamp(2.5rem,7vw,6rem)",
          { lineHeight: "1.0", letterSpacing: "-0.03em" },
        ],
        "display-lg": [
          "clamp(2rem,5vw,4rem)",
          { lineHeight: "1.05", letterSpacing: "-0.025em" },
        ],
        "display-md": [
          "clamp(1.5rem,3.5vw,2.75rem)",
          { lineHeight: "1.1", letterSpacing: "-0.02em" },
        ],
      },

      keyframes: {
        fadeUp: {
          from: {
            opacity: "0",
            transform: "translateY(24px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },

        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },

        ticker: {
          from: {
            transform: "translateX(0)",
          },
          to: {
            transform: "translateX(-50%)",
          },
        },
      },

      animation: {
        "fade-up":
          "fadeUp 0.7s cubic-bezier(0.2,0.8,0.2,1) both",
        "fade-up-d":
          "fadeUp 0.7s 0.15s cubic-bezier(0.2,0.8,0.2,1) both",
        "fade-in":
          "fadeIn 1s ease both",
        ticker:
          "ticker 32s linear infinite",
      },
    },
  },

  plugins: [],
};
