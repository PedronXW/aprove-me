import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        auto: 'repeat(auto-fit, minmax(350px, 1fr))',
        settings: 'repeat(auto-fit, minmax(180px, 1fr))',
      },
      colors: {
        primary_color: '#2336D5',
        secundary_color: '#ffffff',
        background_color: '#f2f2f2',
      },
      dropShadow: {
        '3xl': '2px 2px 2px rgba(0, 0, 0, .35)',
      },
      boxShadow: {
        inner: 'inset 4px 0px 4px 0px rgba(0, 0, 0, .18)',
      },
    },
  },
  plugins: [],
}
export default config
