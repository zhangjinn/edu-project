const { name } = require('./package.json')
const path = require('path')
const StyleLintPlugin = require('stylelint-webpack-plugin')

function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  devServer: {
    hot: true,
    disableHostCheck: true,
    port: 10011,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }

  },
  chainWebpack (config) {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('~assets', resolve('src/assets'))
      .set('components', resolve('src/components'))
      .set('router', resolve('src/router'))
      .set('~styles', resolve('src/styles'))

    config
      .plugin('html')
      .tap(args => {
        args[0].title = name
        args[0].packageName = name
        return args
      })

    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options => {
        return options
      })
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: '@import "./src/styles/index.scss";'
      }
    }
  },
  configureWebpack: {
    output: {
      library: name,
      libraryTarget: 'umd',
      jsonpFunction: `jsonp_${name}`
    },
    plugins: [new StyleLintPlugin({
      files: ['**/*.{vue,htm,html,css,sss,less,scss,sass}'],
      fix: true,
      cache: true,
      emitErrors: true,
      failOnError: false
    })]

  }
}
