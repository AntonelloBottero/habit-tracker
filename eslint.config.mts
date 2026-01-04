import tseslint from "typescript-eslint";
import nextPlugin from '@next/eslint-plugin-next';
import { defineConfig } from "eslint/config";

const files = [
  'app/**/*.{js,jsx,ts,tsx}',
  'components/**/*.{js,jsx,ts,tsx}',
  'hooks/**/*.{js,jsx,ts,tsx}',
  'tests/**/*.{js,jsx,ts,tsx}',
];

export default defineConfig([
  //style
  {
    files,
    rules: {
      'indent': ['error', 2],
      'semi': ['error', 'never'],
      'no-trailing-spaces': 'error',
      'block-spacing': 'error',
      'func-style': ['error', 'declaration']
    }
  },
  // next
  {
    files,
    plugins: {
      '@next/next': nextPlugin as never,
    },
    rules: {
      '@next/next/no-img-element': 'error',
      '@next/next/no-html-link-for-pages': 'error',
    }
  },
  // typescript
  ...tseslint.configs.recommended.map((c) => ({
    ...c,
    files,
  })),
]);
