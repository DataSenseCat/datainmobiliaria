/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}',
    './api/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1rem', md: '2rem' },
      screens: { sm: '640px', md: '768px', lg: '1024px', xl: '1200px' }
    },
    extend: {
      colors: {
        brand: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',   // azul del hero
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81'
        }
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,24,40,.05), 0 1px 3px rgba(16,24,40,.06)',
        cardHover: '0 8px 24px rgba(16,24,40,.12)',
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
      }
    }
  },
  plugins: [],
  safelist: [
    // por si en algún lado se usan arbitrarios
    { pattern: /(bg|text|border|from|to)-(brand|gray|green|emerald)-(50|100|200|300|400|500|600|700|800|900)/ },
    { pattern: /(bg|text|border)-\[\#.*\]/ }
  ]
}
