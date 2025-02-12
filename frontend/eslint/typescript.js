const { resolve } = require('path');

module.exports = {
  parserOptions: {
    project: resolve(__dirname, '../tsconfig.json'),
  },

  extends: [
    'airbnb-typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:prettier/recommended',
  ],

  plugins: ['simple-import-sort'],

  rules: {
    // It's helpful to split functionality into multiple functions within a class.
    'class-methods-use-this': 'off',

    // Throws errors for exported functions, which is a common pattern with ES modules.
    '@typescript-eslint/unbound-method': 'off',

    // Named exports are nicer to work with for a variety of reasons:
    // https://basarat.gitbook.io/typescript/main-1/defaultisbad
    'import/no-default-export': 'error',
    'import/prefer-default-export': 'off',

    // Let ESlint sort our imports for us so we don't have to think about it.
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': 'error',
  },
};
