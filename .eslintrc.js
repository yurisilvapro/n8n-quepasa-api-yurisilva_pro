module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:n8n-nodes-base/nodes',
    'prettier',
  ],
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'n8n-nodes-base/node-param-display-name-miscased': 'error',
    'n8n-nodes-base/node-param-description-miscased': 'error',
  },
  ignorePatterns: ['dist/', 'node_modules/'],
};
