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
        'gameboy': {
          'bg': '#8b956d',
          'screen': '#9bbc0f',
          'dark': '#0f380f',
          'light': '#306230',
        },
        'pokedex': {
          'red': '#dc2626',
          'blue': '#2563eb',
          'yellow': '#fbbf24',
        }
      },
      fontFamily: {
        'gameboy': ['monospace'],
      },
    },
  },
  plugins: [],
}
export default config
