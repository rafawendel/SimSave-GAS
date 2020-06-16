module.exports = {
  env: {
    es6: true,
    node: true,
    'googleappsscript/googleappsscript': true
  },
  extends: [
    /* 'airbnb-base',  */'eslint:recommended', 'plugin:prettier/recommended'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  plugins: [
    'prettier', 'googleappsscript'
  ],
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {
    'prettier/prettier': 'error',
    'spaced-comment': 'off',
    'no-undef': 'warn',
    'no-unused-vars': ['warn', {
      'argsIgnorePattern': '^_',
      'caughtErrorsIgnorePattern': '^_',
      'caughtErrors': 'all'
    }],
    'no-unused-expressions': 'warn',
    'no-param-reassign': 'warn',
    'prefer-destructuring': 'warn',
    'no-console': 'off',
    'camelcase': 'off',
    'no-throw-literal': 'off',
    "no-unused-vars": ['warn', { 'vars': 'local' }]
  },
  "globals": {
    "OAuth1": true,
    "OAuth2": true,
    "FirebaseApp": true
  }
};
