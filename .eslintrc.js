module.exports = {
  root: true,
  extends: [
    '@react-native',
  ],
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/func-call-spacing': 'off',
    'prettier/prettier': 'off',
    'react-hooks/exhaustive-deps': 'warn',
    'react-native/no-inline-styles': 'warn',
    'linebreak-style': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    'no-console': 0,
    '@typescript-eslint/no-duplicate-enum-values': 'off',
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/explicit-module-boundary-types': 'off',
      },
    },
  ],
};
