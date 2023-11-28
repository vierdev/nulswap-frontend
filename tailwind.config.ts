// import type { Config } from 'tailwindcss'
import withMT from '@material-tailwind/react/utils/withMT'

const config = withMT({
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        primary: '#32E08D',
        secondary: '#212429',
        tertiary: '#191B1F',
        red: '#ff2222',
      }
    },
    screens: {
      'md': '768px',
      'xsm': '420px',
      'sm': '320px'
    }
  },
  plugins: [],
})

export default config
