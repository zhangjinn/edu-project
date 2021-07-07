const models = require.context('./', true, /.js$/)

const data = {}
models.keys().forEach(modulesKey => {
  const attr = modulesKey.replace('./', '').replace('.js', '')
  data[attr] = models(modulesKey).default
})

export default data
