/* eslint-disable */
const fs = require('fs')
const path = require('path')
const sass = require('node-sass')
const gulp = require('gulp')
const cleanCSS = require('gulp-clean-css')
const cssWrap = require('gulp-css-wrap')

const themes = [
  {
    name: 'etm-rainBlue',
    color: '#0EC0C8'
  },
  {
    name: 'etm-pink',
    color: '#F56B9B'
  },
  {
    name: 'etm-purple',
    color: '#8457f2'
  },
  {
    name: 'etm-warmOrange',
    color: '#FF9670'
  },
  {
    name: 'etm-blackGold',
    color: '#e4ac2f'
  },
  {
    name: 'etm-yellow',
    color: '#e4ac2f'
  },
  {
    name: 'etm-blue',
    color: '#3d7bff'
  },
  {
    name: 'etm-green',
    color: '#57C69A'
  },
  {
    name: 'etm-girlPink',
    color: '#FA8C8E'
  },
  {
    name: 'etm-lavenderPurple',
    color: '#CA6CF5'
  },
  {
    name: 'etm-brown',
    color: '#BA7A5C'
  },
  {
    name: 'etm-iceBlue',
    color: '#6CA1F5'
  }
]
const filePath = __dirname + '/packages/styles/src/'
const targetPath = __dirname + '/lib/styles/'

async function create() {
  let length = 0
  return new Promise(async (resolve, reject) => {
    try {
      for (const theme of themes) {
        console.log(`准备打包${theme.name}主题`)
        !fs.existsSync(targetPath) && fs.mkdirSync(targetPath)
        !fs.existsSync(targetPath + theme.name) && fs.mkdirSync(targetPath + theme.name)
        !fs.existsSync(targetPath + theme.name + '/fonts') && fs.mkdirSync(targetPath + theme.name + '/fonts')
        fs.copyFileSync(filePath + 'fonts/element-icons.ttf', targetPath + theme.name + '/fonts/element-icons.ttf')
        fs.copyFileSync(filePath + 'fonts/element-icons.woff', targetPath + theme.name + '/fonts/element-icons.woff')
        // css
        await sass.render({
          data: `
          $--color-primary: ${theme.color};
          ${fs.readFileSync(filePath + '/index.scss').toString()}
          `,
          outputStyle: 'compressed',
          file: filePath + '/index.scss'
        }, async (err, result) => {
          if (err) {
            console.log('压缩css出错了: ' + err)
            return
          }
          await fs.writeFileSync(targetPath + theme.name + '/index.css', result.css.toString())

          function buildTheme(theme) {
            length++
            return new Promise((resolve1) => {
              gulp.src(path.resolve(targetPath + theme.name + '/index.css'))/* 找需要添加命名空间的css文件，支持正则表达式 */
                .pipe(cssWrap({
                  selector: `.${ theme.name }`
                }))
                .pipe(cleanCSS())
                .pipe(gulp.dest(path.resolve(targetPath + '/' + theme.name))) /* 存放的目录 */
                .on('end', () => {
                  console.log(`${ theme.name }主题打包完成`)
                  resolve1()
                })
            })
          }

          function copyfont(theme) {
            return new Promise((resolve1) => {
              gulp.src(path.resolve(filePath + '/fonts/**'))
                .pipe(gulp.dest(path.resolve(`${ targetPath }/${ theme.name }/fonts/`)))
                .on('end', () => {
                  resolve1()
                })
            })
          }

          await copyfont(theme)
          await buildTheme(theme)
        })
      }
    } catch (e) {
      reject('build fail: ' + e)
    }
  })

}

create().then(() => {
})

