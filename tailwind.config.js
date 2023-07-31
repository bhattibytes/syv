module.exports = {
  darkMode: false, // or 'media' or 'class',
  important: true,
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      transitionProperty: {
        height: 'height',
      },
      width: {
        'half-screen': '50vw',
      },
      minWidth: {
        '1/6': '16.6666667%',
        'half-screen': '50vw',
      },
      maxWidth: {
        '1/6': '16.6666667%',
        'half-screen': '50vw',
      },
      backgroundSize: {
        auto: 'auto',
        cover: 'cover',
        contain: 'contain',
        '50%': '50%',
        16: '4rem',
      },
      contrast: {
        max: '100',
      },
      brightness: {
        max: '100',
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['active'],
      filter: ['group-hover'],
      grayscale: ['group-hover'],
      contrast: ['group-hover'],
      brightness: ['group-hover'],
    },
  },
  plugins: [],
};
