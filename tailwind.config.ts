import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'pokedex': {
          'red': '#dc2626',
          'red-dark': '#b91c1c',
          'red-light': '#ef4444',
          'blue': '#2563eb',
          'blue-dark': '#1d4ed8',
          'yellow': '#fbbf24',
          'screen': '#000000',
          'screen-bg': '#1a1a1a',
          'button': '#3b82f6',
          'button-dark': '#2563eb',
        },
        'gameboy': {
          'bg': '#8b956d',
          'screen': '#9bbc0f',
          'dark': '#0f380f',
          'light': '#306230',
        }
      },
      boxShadow: {
        'pokedex': '8px 8px 0 0 rgba(0,0,0,1)',
        'pokedex-hover': '12px 12px 0 0 rgba(0,0,0,1)',
        'pokedex-active': '4px 4px 0 0 rgba(0,0,0,1)',
      },
      fontFamily: {
        'gameboy': ['monospace'],
      },
    },
  },
  plugins: [],
}
export default config
