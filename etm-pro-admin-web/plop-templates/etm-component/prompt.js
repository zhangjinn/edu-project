const { notEmpty } = require('../utils')

module.exports = {
  description: 'generate a EtmComponent project',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'what is the name of the component?',
      validate: notEmpty('name')
    },
    {
      type: 'checkbox',
      name: 'blocks',
      message: 'Blocks:',
      choices: [{
        name: '<template>',
        value: 'template',
        checked: true
      },
      {
        name: '<script>',
        value: 'script',
        checked: true
      },
      {
        name: 'style',
        value: 'style',
        checked: true
      }
      ],
      validate(value) {
        if (value.indexOf('script') === -1 && value.indexOf('template') === -1) {
          return 'Components require at least a <script> or <template> tag.'
        }
        return true
      }
    }
  ],
  actions: data => {
    const name = '{{pascalCase name}}'
    const actions = [
      {
        type: 'add',
        path: `src/layout/main/${name}/index.js`,
        templateFile: 'plop-templates/etm-component/index.hbs',
        data: {
          name: name
        }
      },
      {
        type: 'add',
        path: `src/layout/main/${name}/src/${name}.vue`,
        templateFile: 'plop-templates/etm-component/component.hbs',
        data: {
          name: name,
          template: data.blocks.includes('template'),
          script: data.blocks.includes('script'),
          style: data.blocks.includes('style')
        }
      }
    ]
    return actions
  }
}
