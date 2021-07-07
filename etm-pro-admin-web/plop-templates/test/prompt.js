module.exports = {
  description: 'just for test',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'what is the name of the component?',
      default: 'test'
    }
  ],
  actions: data => {
    const actions = [
      {
        type: 'append',
        path: 'src/views/temp/index.vue',
        pattern: '<style scoped>',
        separator: '<separator>',
        unique: false,
        template: '<insert>simple</insert>'
      }
    ]
    return actions
  }
}
