import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  { ignores: ['dist', 'dist-server', 'node_modules'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      // Count JSX-referenced identifiers as used (automatic runtime: no
      // need for React-in-scope), so components used only in markup aren't
      // flagged by core no-unused-vars.
      'react/jsx-uses-vars': 'error',
      'react/jsx-uses-react': 'off',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      // The codebase prefixes intentionally-unused args with _; allow that.
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^[A-Z_]' }],
    },
  },
  {
    // dev-tweaks is a vendored design-host panel mounted only in
    // import.meta.env.DEV — it never ships to production. Its imperative
    // ref usage and unused locals are intentional; don't fail lint over
    // rewriting vendored tooling.
    files: ['src/features/dev-tweaks/**'],
    rules: {
      'react-hooks/refs': 'off',
      'react-hooks/immutability': 'off',
      'react-refresh/only-export-components': 'off',
      'no-unused-vars': 'off',
    },
  },
];
