const etmComponentGenerator = require('./plop-templates/etm-component/prompt')
const testGenerator = require('./plop-templates/test/prompt')
const globalStyleGenerator = require('./plop-templates/global-style/prompt')

module.exports = function(plop) {
  plop.setGenerator('EtmComponent', etmComponentGenerator)
  plop.setGenerator('Test', testGenerator)
  plop.setGenerator('GlobalStyle', globalStyleGenerator)
}
