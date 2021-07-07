import Vue from 'vue'
import VueI18n from 'vue-i18n'

const moduleZH = {}
const moduleEN = {}

const moduleZHs = require.context('./langs/moduleZH/', true, /.js$/)
moduleZHs.keys().forEach(modulesKey => {
  const attr = modulesKey.replace('./', '').replace('.js', '')
  moduleZH[attr] = moduleZHs(modulesKey).default
})

const moduleENs = require.context('./langs/moduleEN/', true, /.js$/)
moduleENs.keys().forEach(modulesKey => {
  const attr = modulesKey.replace('./', '').replace('.js', '')
  moduleEN[attr] = moduleENs(modulesKey).default
})

Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: 'zh', // 语言标识, 通过切换locale的值来实现语言切换,this.$i18n.locale
  messages: {
    'zh': moduleZH, // 中文语言包
    'en': moduleEN // 英文语言包
  }
})

export function changeLang(lang) {
  i18n.locale = lang
}

export default i18n
