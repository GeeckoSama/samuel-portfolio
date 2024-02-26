/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontSize: {
        sm: '0.618rem',
        base: '1rem',
        xl: '1.618rem',
        '2xl': '2.618rem',
        '3xl': '4.236rem',
        '4xl': '6.854rem',
        '5xl': '11.090rem',
      },
      fontFamily: {
        heading: 'Allerta Stencil',
        body: 'Allerta',
      },
      fontWeight: {
        normal: '400',
        bold: '700',
      },
    },
  },
  daisyui: {
    themes: [
      {
        light: {
          primary: "#131111",
          secondary: "#ffe5e5",
          accent: "#c21414",
          neutral: "#262626",
          "base-100": "#f0f0f0",
        },
        dark: {
          primary: "#eeecec",
          secondary: "#1a0000",
          accent: "#eb3d3d",
          neutral: "#262626",
          "base-100": "#0f0f0f",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
