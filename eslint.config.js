import globals from 'globals';
import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    files: ['**/*.js'],
   ignores: ['dist/**', 'node_modules/**'],  
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'error',
      'preserve-caught-error': 'off', // отключаем, если не нужно
    },
  },
];