/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'dark-jboss': '#272526',
        'gray-jboss': '#808185',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            'text-rendering': 'optimizeLegibility',
          },
        },
      },
    },
  },
  plugins: [],
}

