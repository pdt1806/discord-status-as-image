module.exports = {
  ignorePatterns: ['.eslintrc.cjs', 'vite.config.mjs', 'postcss.config.cjs'],
  extends: ['mantine', 'eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    quotes: 'off',
  },
};
