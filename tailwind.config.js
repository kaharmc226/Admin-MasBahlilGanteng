/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#10b981',
          hover: '#059669',
          light: '#f0fdf4',
        },
        vendor: {
          DEFAULT: '#f97316',
          hover: '#ea580c',
          light: '#fff7ed',
          accent: '#9a3412',
        },
        ahligizi: {
          DEFAULT: '#06b6d4',
          hover: '#0891b2',
          light: '#ecfeff',
          accent: '#155e75',
        },
        sekolah: {
          DEFAULT: '#8b5cf6',
          hover: '#7c3aed',
          light: '#f5f3ff',
          accent: '#5b21b6',
        },
        pemerintah: {
          DEFAULT: '#3b82f6',
          hover: '#2563eb',
          light: '#eff6ff',
          accent: '#1e3a8a',
        },
        text: {
          main: '#0f172a',
          muted: '#64748b',
        },
        surface: '#ffffff',
        bg: '#f8fafc',
        border: '#e2e8f0',
      },
      fontFamily: {
        heading: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        body: ['Outfit', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'soft-md': '0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05)',
        'soft-lg': '0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.05)',
        'soft-xl': '0 20px 25px -5px rgba(0,0,0,0.08), 0 8px 10px -6px rgba(0,0,0,0.04)',
        'card': '0 20px 40px rgba(0,0,0,0.03)',
      }
    },
  },
  plugins: [],
}
