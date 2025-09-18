/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Use HSL variables correctly for theming
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        // 品牌色系
        primary: {
          DEFAULT: 'var(--primary)',
          light: 'var(--primary-light)',
          dark: 'var(--primary-dark)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          light: 'var(--secondary-light)',
        },
        // 状态色系
        success: 'var(--success)',
        warning: 'var(--warning)',
        error: 'var(--error)',
        info: 'var(--info)',
        // UI状态色系
        // Tailwind supports CSS color functions with alpha placeholders
        ring: 'rgb(var(--ring) / <alpha-value>)',
        'ring-offset-background': 'var(--ring-offset-background)',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
