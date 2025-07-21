import js from '@eslint/js';
import globals from 'globals';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2020,
        ...globals.node,
      },
      ecmaVersion: 2020,
      sourceType: 'module',
    },
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      // Prettier as ESLint rule
      'prettier/prettier': 'error',

      // Basic modern JS rules
      'prefer-const': 'error',
      'no-var': 'error',
      'no-unused-vars': 'off', // Turn off base rule
      '@typescript-eslint/no-unused-vars': 'error', // Use TypeScript version
    },
  },
  eslintConfigPrettier // This must be last
);
