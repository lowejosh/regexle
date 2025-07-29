/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors';
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // standardized difficulty color palettes
        easy: colors.green,
        medium: colors.yellow,
        hard: colors.orange,
        expert: colors.red,
        nightmare: colors.purple,
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "color-flash-wiggle": {
          "0%, 100%": { 
            backgroundColor: "rgb(254 249 195)", 
            borderColor: "rgb(253 224 71)",
            transform: "rotate(0deg)"
          },
          "8%": { 
            backgroundColor: "rgb(254 249 195)", 
            borderColor: "rgb(253 224 71)",
            transform: "rotate(-3deg)"
          },
          "16%": { 
            backgroundColor: "rgb(254 226 226)", 
            borderColor: "rgb(248 113 113)",
            transform: "rotate(0deg)"
          },
          "25%": { 
            backgroundColor: "rgb(254 226 226)", 
            borderColor: "rgb(248 113 113)",
            transform: "rotate(3deg)"
          },
          "33%": { 
            backgroundColor: "rgb(219 234 254)", 
            borderColor: "rgb(96 165 250)",
            transform: "rotate(0deg)"
          },
          "41%": { 
            backgroundColor: "rgb(219 234 254)", 
            borderColor: "rgb(96 165 250)",
            transform: "rotate(-3deg)"
          },
          "50%": { 
            backgroundColor: "rgb(220 252 231)", 
            borderColor: "rgb(74 222 128)",
            transform: "rotate(0deg)"
          },
          "58%": { 
            backgroundColor: "rgb(220 252 231)", 
            borderColor: "rgb(74 222 128)",
            transform: "rotate(3deg)"
          },
          "66%": { 
            backgroundColor: "rgb(243 232 255)", 
            borderColor: "rgb(168 85 247)",
            transform: "rotate(0deg)"
          },
          "75%": { 
            backgroundColor: "rgb(243 232 255)", 
            borderColor: "rgb(168 85 247)",
            transform: "rotate(-3deg)"
          },
          "83%": { 
            backgroundColor: "rgb(255 237 213)", 
            borderColor: "rgb(251 146 60)",
            transform: "rotate(0deg)"
          },
          "91%": { 
            backgroundColor: "rgb(255 237 213)", 
            borderColor: "rgb(251 146 60)",
            transform: "rotate(3deg)"
          },
        },
        "color-flash-wiggle-dark": {
          "0%, 100%": { 
            backgroundColor: "rgb(133 77 14 / 0.3)", 
            borderColor: "rgb(161 98 7)",
            transform: "rotate(0deg)"
          },
          "8%": { 
            backgroundColor: "rgb(133 77 14 / 0.3)", 
            borderColor: "rgb(161 98 7)",
            transform: "rotate(-3deg)"
          },
          "16%": { 
            backgroundColor: "rgb(127 29 29 / 0.3)", 
            borderColor: "rgb(185 28 28)",
            transform: "rotate(0deg)"
          },
          "25%": { 
            backgroundColor: "rgb(127 29 29 / 0.3)", 
            borderColor: "rgb(185 28 28)",
            transform: "rotate(3deg)"
          },
          "33%": { 
            backgroundColor: "rgb(30 58 138 / 0.3)", 
            borderColor: "rgb(37 99 235)",
            transform: "rotate(0deg)"
          },
          "41%": { 
            backgroundColor: "rgb(30 58 138 / 0.3)", 
            borderColor: "rgb(37 99 235)",
            transform: "rotate(-3deg)"
          },
          "50%": { 
            backgroundColor: "rgb(20 83 45 / 0.3)", 
            borderColor: "rgb(34 197 94)",
            transform: "rotate(0deg)"
          },
          "58%": { 
            backgroundColor: "rgb(20 83 45 / 0.3)", 
            borderColor: "rgb(34 197 94)",
            transform: "rotate(3deg)"
          },
          "66%": { 
            backgroundColor: "rgb(107 33 168 / 0.3)", 
            borderColor: "rgb(147 51 234)",
            transform: "rotate(0deg)"
          },
          "75%": { 
            backgroundColor: "rgb(107 33 168 / 0.3)", 
            borderColor: "rgb(147 51 234)",
            transform: "rotate(-3deg)"
          },
          "83%": { 
            backgroundColor: "rgb(154 52 18 / 0.3)", 
            borderColor: "rgb(234 88 12)",
            transform: "rotate(0deg)"
          },
          "91%": { 
            backgroundColor: "rgb(154 52 18 / 0.3)", 
            borderColor: "rgb(234 88 12)",
            transform: "rotate(3deg)"
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "color-flash": "color-flash 2s ease-in-out infinite",
        "color-flash-dark": "color-flash-dark 2s ease-in-out infinite",
        "color-flash-wiggle": "color-flash-wiggle 2s ease-in-out infinite",
        "color-flash-wiggle-dark": "color-flash-wiggle-dark 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
