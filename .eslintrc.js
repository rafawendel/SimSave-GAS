module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'airbnb-base', 'eslint:recommended', 'plugin:prettier/recommended'
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
  env: {
    'googleappsscript/googleappsscript': true
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
    'no-console': 'off'
  },
  "globals": {
    "OAuth1": true,
    "OAuth2": true,
    "FirebaseApp": true
  }
};
