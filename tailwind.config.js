/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brandDeep: "#023dbb",
        brandIndigo: "#4460ef",
        brandBlue: "#308fef",
        brandCyan: "#4ec8ef",
        brandAmber: "#ffc857",
        brandDark: "#191919",
        brandInk: "#091124",
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #023dbb 0%, #4460ef 50%, #308fef 100%)',
        'hero-gradient': 'linear-gradient(135deg, #f8faff 0%, #e6f0ff 100%)',
      },
      boxShadow: {
        'glow-blue': '0 10px 30px rgba(2, 61, 187, 0.25)',
        'glow-cyan': '0 10px 30px rgba(78, 200, 239, 0.3)',
        'glow-amber': '0 10px 30px rgba(255, 200, 87, 0.35)',
        'card-hover': '0 20px 40px rgba(2, 61, 187, 0.15)',
      }
    },
  },
  plugins: [],
}
