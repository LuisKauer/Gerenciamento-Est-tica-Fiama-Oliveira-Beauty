module.exports = {
  env: {
      browser: true,
      es2021: true,
  },
  extends: ['airbnb-base'],
  parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
  },
  rules: {
      'no-console': 'off',
      indent: 'off',
      'eol-last': 0,
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
      'class-methods-use-this': 'off',
      'import/first': 'off',
      'no-param-reassign': 'off',
  },
};