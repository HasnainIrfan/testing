/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  prefix: '',
  theme: {
    extend: {
      borderRadius: {
        10: '10px',
      },
      fontFamily: {
        Domine: 'var(--Domine-Regular)',
        DomineBold: 'var(--Domine-Bold)',
        DomineMedium: 'var(--Domine-Medium)',
        DomineSemiBold: 'var(--Domine-SemiBold)',
        SFProDisplayLight: 'var(--SF-Pro-Display-Light)',
        SFProDisplayBold: 'var(--SF-Pro-Display-Bold)',
        SFProDisplayMedium: 'var(--SF-Pro-Display-Medium)',
        SFProDisplayRegular: 'var(--SF-Pro-Display-Regular)',
        SFProDisplaySemibold: 'var(--SF-Pro-Display-Semibold)',
      },
      boxShadow: {
        paymentCard: '0px 4px 20px 10px rgba(119, 119, 119, 0.07)',
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
