'use strict'
const path = require('path')
const gulp = require('gulp')
const cleanCSS = require('gulp-clean-css')
const cssWrap = require('gulp-css-wrap')
const { series, src, dest } = require('gulp')
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const cssmin = require('gulp-cssmin')

// const themeName = 'etm-yellow'
// const themeName = 'etm-purple'
// const themeName = 'etm-pink'
// const themeName = 'etm-brown'
// const themeName = 'etm-green'
const themeName = 'etm-blue'
const stylesPath = 'packages/styles'

// 编译scss
function compile() {
  console.log('当前主题是: ' + themeName)
  return src(path.resolve(stylesPath + '/src/index.scss'))
    .pipe(sass.sync())
    .pipe(autoprefixer({
      browsers: ['ie >= 11', 'last 2 versions'],
      cascade: false
    }))
    .pipe(cssmin())
    .pipe(dest(path.resolve(`./lib/styles/${themeName}`)))
}

function copyfont() {
  return src(path.resolve(stylesPath + '/src/fonts/**'))
    .pipe(cssmin())
    .pipe(dest(path.resolve(`./lib/styles/${themeName}/fonts`)))
}

// 包裹css
function buildTheme() {
  return gulp.src(path.resolve(`./lib/styles/${themeName}/index.css`))/* 找需要添加命名空间的css文件，支持正则表达式 */
    .pipe(cssWrap({
      selector: `.${themeName}` /* 添加的命名空间 */
    }))
    .pipe(cleanCSS())
    .pipe(gulp.dest(path.resolve(`./lib/styles/${themeName}`))) /* 存放的目录 */
}

// exports.build = series(compile, copyfont)
exports.build = series(compile, copyfont, buildTheme)
