/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: '#f2eee7',
        ink: '#18201e',
        muted: '#59615c',
        copper: '#a56f48',
        sage: '#dde5dd',
        rule: '#d1c5b7',
        'app-canvas': '#f4f5f2',
        surface: '#fbfaf7',
        'table-head': '#eeece6',
        charcoal: '#1b2430',
      },
      boxShadow: {
        soft: '0 24px 80px rgba(16, 24, 40, 0.08)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['Iowan Old Style', 'Baskerville', 'Palatino Linotype', 'Book Antiqua', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
