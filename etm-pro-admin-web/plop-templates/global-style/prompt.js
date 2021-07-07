const { notEmpty } = require('../utils')

module.exports = {
  description: 'add a global scss variable',
  prompts: [
    {
      type: 'input',
      name: 'varname',
      message: 'what is the name of this scss variable?',
      validate: notEmpty('varname')
    },
    {
      type: 'input',
      name: 'varvalue',
      message: 'what is the value of this scss variable?',
      validate: notEmpty('varvalue')
    }
  ]
}
