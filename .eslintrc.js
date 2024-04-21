module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    // 忽略换行符错误
    'prettier/prettier': 0,
    'react/no-unstable-nested-components': 0,
    'react-hooks/exhaustive-deps': 0,
    'no-unused-vars': 1,
    '@typescript-eslint/no-unused-vars': 0,
  },
};
