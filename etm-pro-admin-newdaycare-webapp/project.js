module.exports = {
  modules: [
    ['daycare', '早托'],
    ['guardcare', '幼托'],
    ['newdaycare', '幼儿园']
  ],
  commitTypes: [
    {
      value: 'feat',
      name: '✨  新增产品功能'
    },
    {
      value: 'fix',
      name: '⛏  修复 bug'
    },
    {
      value: 'hotfix',
      name: '❌  紧急修复 bug'
    },
    {
      value: 'docs',
      name: '⚔  文档的变更'
    },
    {
      value: 'style',
      name:
        '⛩  不改变代码功能的变动(如删除空格、格式化、去掉末尾分号等)'
    },
    {
      value: 'refactor',
      name: '⚙  重构代码。不包括 bug 修复、功能新增'
    }
  ]
}
