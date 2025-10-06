import tseslint from "typescript-eslint";
import nextPlugin from '@next/eslint-plugin-next';
import { defineConfig } from "eslint/config";

const files = [
  'app/**/*.{js,jsx,ts,tsx}',
  'components/**/*.{js,jsx,ts,tsx}',
  'hooks/**/*.{js,jsx,ts,tsx}',
];


export default defineConfig([
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
  ...tseslint.configs.recommended.map((c) => ({
    ...c,
    files,
  })),
]);
