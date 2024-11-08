module.exports = {
  "root": true,
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:vue/vue3-essential",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended"
  ],
  "overrides": [
    {
      "files": ["*.cjs", "*.ts", "*.tsx", "*.vue"],
      "rules": {
        "no-undef": "off"
      }
    }
  ],
  "parser": "vue-eslint-parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
    "parser": "@typescript-eslint/parser"
  },
  "plugins": ["vue", "@typescript-eslint"],
  "rules": {
    "arrow-body-style": "off",
    "prefer-arrow-callback": "off",
    "no-var": "error",
    "no-empty": ["error", { "allowEmptyCatch": true }],
    "no-void": "error",
    "prefer-const": [
      "warn",
      { "destructuring": "all", "ignoreReadBeforeAssign": true }
    ],
    "prefer-template": "error",
    "object-shorthand": [
      "error",
      "always",
      { "ignoreConstructors": false, "avoidQuotes": true }
    ],
    "block-scoped-var": "error",
    "no-constant-condition": ["error", { "checkLoops": false }],
    "block-spacing": "off",
    "no-redeclare": "off",
    "object-curly-spacing": ["error", "always"],

    "@typescript-eslint/no-redeclare": "error",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/ban-types": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }
    ],
    "no-unused-vars": "off",

    "vue/no-v-html": "off",
    "vue/require-default-prop": "off",
    "vue/require-explicit-emits": "off",
    "vue/multi-word-component-names": "off",
    "vue/one-component-per-file": "off"
  },
  ignores: [
    'node_modules/**', // 忽略 node_modules 目录
    'dist/**',         // 忽略 dist 目录
  ],
}
