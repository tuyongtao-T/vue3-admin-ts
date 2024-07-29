module.exports = {
  processors: [],
  plugins: ['stylelint-order'],
  extends: ['stylelint-config-standard', 'stylelint-config-recess-order', 'stylelint-config-html/vue'],
  rules: {
    // 未知方法
    'function-no-unknown': [
      true,
      {
        ignoreFunctions: ['theme']
      }
    ],
    'alpha-value-notation': 'number',
    'selector-class-pattern': null,
    'block-no-empty': true,
    'no-empty-source': null,
    'number-max-precision': [
      6,
      {
        ignoreUnits: ['em'],
        severity: 'warning'
      }
    ],
    'color-no-invalid-hex': true,
    // 未知规则rule
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['tailwind', 'apply', 'variants', 'responsive', 'screen', 'layer', 'function', 'if', 'each', 'include', 'mixin']
      }
    ],
    'font-family-no-missing-generic-family-keyword': null,
    'rule-empty-line-before': [
      'always',
      {
        ignore: ['after-comment', 'first-nested']
      }
    ],
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['deep', 'global']
      }
    ],
    'selector-pseudo-element-no-unknown': [
      true,
      {
        ignorePseudoElements: ['v-deep', 'v-global', 'v-slotted']
      }
    ]
  },
  ignoreFiles: ['**/*.js', '**/*.jsx', '**/*.tsx', '**/*.ts'],
  overrides: [
    {
      files: ['*.vue', '**/*.vue', '*.html', '**/*.html'],
      customSyntax: 'postcss-html'
    },
    {
      files: ['*.less', '**/*.less'],
      customSyntax: 'postcss-less'
    }
  ]
}
