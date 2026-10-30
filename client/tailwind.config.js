export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', '-apple-system', 'Helvetica Neue', 'Arial', 'sans-serif'] },
      colors: {
        ink: 'var(--color-ink)',
        'soft-ink': 'var(--color-soft-ink)',
        soft: 'var(--color-soft)',
        field: 'var(--color-field)',
        hairline: 'var(--color-hairline)',
        'hairline-soft': 'var(--color-hairline-soft)',
        muted: 'var(--color-muted)',
        card: 'var(--color-card)',
      },
    },
  },
};
