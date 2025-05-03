// File: .eslintrc.js

module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    ecmaVersion: 12,
    sourceType: 'module',
    warnOnUnsupportedTypeScriptVersion: false,
  },
  plugins: ['@typescript-eslint', 'import', 'prettier'],
  extends: [
    'airbnb-typescript/base',      // Airbnb + TypeScript
    'plugin:prettier/recommended', // включает eslint-plugin-prettier и eslint-config-prettier
  ],
  settings: {
    'import/resolver': {
      typescript: {
        project: './tsconfig.json',
        alwaysTryTypes: true,
      },
    },
    'import/extensions': [
      'error',
      'ignorePackages',
      {ts: 'never', tsx: 'never', js: 'never', jsx: 'never'},
    ],
  },
  rules: {
    // Приводим в соответствие с Prettier
    'prettier/prettier': 'error',

    // Управление расширениями импортов
    'import/extensions': 'off',

    // Разрешаем импорт из src даже если это в devDependencies
    'import/no-extraneous-dependencies': ['error', {
      devDependencies: [
        'src/**/*.ts',        // все ваши .ts файлы
        'src/**/*.spec.ts',   // тесты, если будут
        'src/**/__tests__/*', // тестовые папки
      ],
      optionalDependencies: false,
      peerDependencies: false,
    }],

    // Критичные проблемы
    'no-unused-vars': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-floating-promises': 'error',

    // Ослабляем шумные правила
    'import/prefer-default-export': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
  },
};