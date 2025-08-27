/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50:"#eef6ff",100:"#d9ecff",200:"#bfe0ff",300:"#94cbff",400:"#61adff",
          500:"#3b8fff",600:"#256fe6",700:"#1d58b4",800:"#1b4a8f",900:"#1a3d73"
        }
      }
    },
  },
  plugins: [],
}
