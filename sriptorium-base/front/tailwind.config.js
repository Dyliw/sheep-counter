//@type {import('tailwindcss').Config}

module.exports={
contet:[
    "./src/**/*.{js,jsx,ts,tsx}",
],
  theme: {
    extend: {
      //Personalizaciones
      colors: {
        'azul': '#5d7099',
        'verde': '#4a7164',
        'rojo': '#953f3f',
      },
      spacing: {
        '128': '32rem', 
      }
    },
  },
  plugins: [],
}