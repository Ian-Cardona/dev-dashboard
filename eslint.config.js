import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      'packages/vscode-extension/out/**',
      '**/dist/**',
      '**/build/**',
      '**/node_modules/**',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ['**/*.{ts,mts,cts}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: { ...globals.browser, ...globals.es2020, ...globals.node },
      ecmaVersion: 2020,
      sourceType: 'module',
    },
    rules: {
      'prefer-const': 'error',
      'no-var': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
    },
  },

  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.es2020, ...globals.node },
      ecmaVersion: 2020,
      sourceType: 'module',
    },
    rules: {
      'prefer-const': 'error',
      'no-var': 'error',
      'no-unused-vars': 'error',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },

  {
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },
  eslintConfigPrettier
);
