module.exports = {
  env: {
    es6: true,
    'googleappsscript/googleappsscript': true
  },
  extends: [
    'eslint:recommended', 'plugin:prettier/recommended', 'prettier'
  ],
  plugins: [
    'prettier', 'googleappsscript'
  ],
  parserOptions: {
    ecmaVersion: 2019
  },
  rules: {
    "prettier/prettier": ['error', {}, {
      'usePrettierrc': true
    }],
    'spaced-comment': 'off',
    'no-undef': 'warn',
    'no-unused-expressions': 'warn',
    'no-param-reassign': 'warn',
    'prefer-destructuring': 'warn',
    'no-console': 'off',
    'no-throw-literal': 'off',
    'no-unused-vars': ['warn', {
      'vars': 'local',
      'argsIgnorePattern': '^_',
      /* 'varsIgnorePattern': '^[A-Z0-9_]*$' */
    }]
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    'OAuth1': true,
    'OAuth2': true,
    'FirebaseApp': true
  }
};
