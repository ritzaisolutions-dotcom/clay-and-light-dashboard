import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Main-site palette from brand.md
        cloud:        '#F5F2EC',
        'warm-linen': '#FBF8F3',
        burgundy:     '#EC6A37',
        'deep-burgundy': '#F37A48',
        sage:         '#A9B494',
        pistachio:    '#6F7F5F',
        ink:          '#2F2A24',
        dusk:         '#7B746B',
        border:       '#D9D1C7',
        'pale-pistachio': '#D9D1C7',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Playfair Display', 'Georgia', 'serif'],
        body:    ['Outfit', 'DM Sans', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}

export default config
