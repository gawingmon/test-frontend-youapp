/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#E94057",
        secondary: "#8A2387",
        accent: "#F27121",
        youapp: {
          primary: {
            DEFAULT: "#62CDCB",
            dark: "#4599DB",
          },
          secondary: {
            DEFAULT: "#0E1320",
            light: "#1A2540",
            dark: "#0A0F1A",
          },
          gradient: {
            blue: {
              from: "#62CDCB",
              to: "#4599DB",
            },
            purple: {
              from: "#8A2387",
              to: "#E94057",
            },
          },
          text: {
            primary: "#FFFFFF",
            secondary: "#AAAAAA",
            muted: "#666666",
          },
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        youapp: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'card': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'button': '0 4px 10px rgba(0, 0, 0, 0.1)',
        'hover': '0 8px 30px rgba(0, 0, 0, 0.12)',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      transitionDuration: {
        '250': '250ms',
        '400': '400ms',
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'bounce-out': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
    },
  },
  plugins: [],
}
