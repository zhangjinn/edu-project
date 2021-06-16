const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  devServer: {
    open: true,
    overlay: {
      warning: false,
      error: false
    }
  },
  configureWebpack: {
    output: {
      libraryExport: 'default'
    }
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('~', resolve('packages'))
    config.module
      .rule('eslint')
      .exclude.add(path.resolve('./lib'))
      .end()
    config.module
      .rule('js')
      .include
      .add('/src/')
      .end()
      .include.add(/packages/)
      .end()
      .use('babel')
      .loader('babel-loader')
      .tap(options => {
        // 修改它的选项...
        return options
      })
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => Object.assign(options, { limit: 15240 }))
  },
  css: {
    extract: false,
    loaderOptions: {
      // 给 sass-loader 传递选项
      sass: {
        prependData: `@import "packages/styles/src/common/var.scss";`
      }
    }
  }
}
