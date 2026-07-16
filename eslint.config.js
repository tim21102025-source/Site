import js from '@eslint/js';
import astroPlugin from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astroPlugin.configs['flat/recommended'],
  prettierConfig,
  {
    rules: {
      'astro/no-set-html-directive': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      'prefer-rest-params': 'warn',
    },
    languageOptions: {
      globals: {
        dataLayer: 'readonly',
        gtag: 'readonly',
        bootstrap: 'readonly',
        AOS: 'readonly',
        GLightbox: 'readonly',
        Isotope: 'readonly',
        Swiper: 'readonly',
        PureCounter: 'readonly',
      },
    },
  },
  {
    ignores: ['dist/', 'public/assets/vendor/', '.astro/'],
  },
];
