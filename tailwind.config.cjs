module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      backgroundImage: {
        'logo': "url(./static/logo.png)"
      },
      fontFamily: {
        'sans': ['"Open Sans"', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
}
