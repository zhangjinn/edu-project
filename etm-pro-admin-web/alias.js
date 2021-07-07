const path = require('path')
module.exports = {
  // idea 别名专用
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
}
