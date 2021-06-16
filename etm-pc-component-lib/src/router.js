import VueRouter from 'vue-router'
import Vue from 'vue'

const files = require.context('@/views', true, /\.vue$/)
const pages = {}
files.keys().forEach(key => {
  pages[key.replace(/(\.\/|\.vue)/g, '')] = files(key).default
})

const generator = []
Object.keys(pages).forEach(item => {
  generator.push({
    path: `/${pages[item].name.replace(/-/g, '/')}`,
    name: pages[item].name,
    component: pages[item]
  })
})

Vue.use(VueRouter)
export default new VueRouter({
  routes: generator
})
