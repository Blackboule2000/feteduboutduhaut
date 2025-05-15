/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'festival': {
          turquoise: '#29A7B7',
          yellow: '#FFD700',
          red: '#E4002B',
          cream: '#FFF8DC',
          black: '#111111',
          orange: '#FF6B35'
        }
      },
      fontFamily: {
        'display': ['Rainy Days', 'Playfair Display', 'Georgia', 'serif'],
        'title': ['Rainy Days', 'Anton', 'Impact', 'Haettenschweiler', 'Franklin Gothic Bold', 'sans-serif'],
        'retro': ['Bebas Neue', 'Franklin Gothic Medium', 'Franklin Gothic', 'ITC Franklin Gothic', 'Arial Narrow', 'sans-serif'],
        'body': ['Roboto Slab', 'Franklin Gothic Medium', 'Franklin Gothic', 'ITC Franklin Gothic', 'Arial', 'sans-serif']
      },
      backgroundImage: {
        'retro-pattern': "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
        'noise': "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyBAMAAADsEZWCAAAAGFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANxM8mAAAACHRSTlMzMzMzMzMzM85JBgUAAAA1SURBVDjLY2CgNhg1waiJUROsNUD8OpE0GGFEQxPEr6M+GGGEGEDUt6MmRk2MmhgETYwCAFR3CVGj3jHGAAAAAElFTkSuQmCC')"
      },
      perspective: {
        '1000': '1000px'
      },
      transformStyle: {
        'preserve-3d': 'preserve-3d'
      }
    }
  },
  plugins: []
};