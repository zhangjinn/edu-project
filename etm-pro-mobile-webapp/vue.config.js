const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');

module.exports = {
    devServer: {
        disableHostCheck: true,
        port: 8082  // 此处修改你想要的端口号，
    },
    lintOnSave: true,
    css: {
        loaderOptions: {
            sass: {
                prependData: `@import "@/assets/style/mixin.scss";`
            },
            postcss: {
                plugins: [
                    autoprefixer({
                        overrideBrowserslist: ['Android >= 4.0', 'iOS >= 7'],
                        grid: true
                    }),
                    pxtorem({
                        rootValue: 37.5,
                        propList: ['*'],
                    })
                ]
            },
        }
    },

}

