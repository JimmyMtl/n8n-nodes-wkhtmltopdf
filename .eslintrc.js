module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
  },
  extends: [
    'eslint:recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  rules: {
    // n8n specific rules
    'no-console': 'off',
    'no-unused-vars': 'off',
    'no-undef': 'off',
  },
  ignorePatterns: ['dist/', 'node_modules/', '*.js'],
};
