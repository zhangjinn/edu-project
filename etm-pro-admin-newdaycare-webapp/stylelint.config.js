module.exports = {
  defaultSeverity: 'error',
  extends: 'stylelint-config-sass-guidelines', // 官方推荐
  rules: {
    'selector-max-id': 1, // id选择器1个
    'max-nesting-depth': 10, // 嵌套深度
    'selector-max-compound-selectors': 10, // 复合选择器个数
    'color-no-invalid-hex': true, // 禁止使用无效的十六进制颜色
    'no-duplicate-selectors': true, // 禁止在声明块中使用重复的属性
    'property-no-unknown': true, // 禁止未知属性
    'unit-no-unknown': true, // 禁止未知属性
    'declaration-block-no-duplicate-properties': true, // 禁止在声明块中使用重复的属性。
    'selector-class-pattern': null, // 关闭大小写检测
    'selector-pseudo-element-no-unknown': [
      true,
      {
        ignorePseudoElements: ['v-deep']
      }
    ],
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['mixin', 'each', 'extend', 'content', 'include', 'for', 'function', 'return']
      }
    ],
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['export']
      }
    ],
    // 'scss/dollar-variable-pattern': /^\$([a-z])([a-z0-9])/
    'scss/dollar-variable-pattern': /\w?/,
    'scss/at-mixin-pattern': /\w?/
  }
}
