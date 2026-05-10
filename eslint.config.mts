import tseslint from "typescript-eslint"
import stylistic from '@stylistic/eslint-plugin'
import { defineConfig, globalIgnores } from "eslint/config"

const files = [
  'app/**/*.{js,jsx,ts,tsx}',
  'components/**/*.{js,jsx,ts,tsx}',
  'hooks/**/*.{js,jsx,ts,tsx}',
  'tests/**/*.{js,jsx,ts,tsx}',
]
const ignores = [
  '.next/**/*.{js,jsx,ts,tsx}'
]

export default defineConfig([
  globalIgnores(['.next/*']),
  //style
  {
    files,
    rules: {
      'semi': ['error', 'never'],
      'no-trailing-spaces': 'error',
      'block-spacing': 'error',
      'func-style': ['error', 'declaration']
    }
  },
  // next
  /* {
    files,
    plugins: {
      '@next/next': nextPlugin as never,
    },
    rules: {
      '@next/next/no-img-element': 'error',
      '@next/next/no-html-link-for-pages': 'error',
    }
  }, */
  // typescript
  ...tseslint.configs.recommended.map((c) => ({
    ...c,
    files,
  })),
  // stylistic
  {
    plugins: {
      '@stylistic': stylistic
    },
    rules: {
      '@stylistic/indent': ['error', 2],
    }
  }
]);
