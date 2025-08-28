/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  prefix: '',
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
      },
      borderRadius: {
        10: '10px',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        Outfit: 'var(--Outfit-Regular)',
        OutfitBold: 'var(--Outfit-Bold)',
        OutfitMedium: 'var(--Outfit-Medium)',
        OutfitSemiBold: 'var(--Outfit-SemiBold)',
      },
      boxShadow: {
        paymentCard: '0px 4px 20px 10px rgba(119, 119, 119, 0.07)',
        sidebar: 'rgba(89, 102, 122, 0.1) -9px 0px 20px',
      },
      fontSize: {
        sm: '14px',
        'sm-13': '13px',
        'sm-15': '15px',
      },
      keyframes: {
        spin: {
          to: {
            transform: 'rotate(360deg)',
          },
        },
      },
      animation: {
        spin: 'spin 1s linear infinite',
      },
    },
    screens: {
      mobile: '400px',
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
      xxl: '1440px',
      base: '920px',
    },
  },
  plugins: [],
}
