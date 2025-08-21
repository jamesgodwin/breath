/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        app: {
          bg: '#141414',
          headline: '#f5f5f5',
          body: '#a3a3a3',
          'btn-bg': '#e5e5e5',
          'btn-text': '#141414',
          'btn-stroke': '#404040',
          'element-bg': '#171717'
        }
      },
      fontFamily: {
        headline: ['EB Garamond', 'serif'],
        body: ['Karla', 'sans-serif'],
        button: ['IBM Plex Mono', 'monospace']
      }
    },
  },
  plugins: [],
}