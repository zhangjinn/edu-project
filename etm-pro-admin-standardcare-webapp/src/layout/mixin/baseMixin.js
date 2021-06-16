import { parseTime } from '@/utils'
import { getCodeByPath } from '@/auth'
// import XLSX from 'xlsx'
let hiddenButtonAuth = null
export default {
  name: 'baseMixin',
  directives: {
    throttle: {
      inserted: function inserted (el, binding) {
        el.addEventListener('click', function () {
          if (!el.disabled) {
            el.disabled = true
            setTimeout(function () {
              el.disabled = false
            }, binding.value || 1200)
          }
        })
      }
    }
  },
  filters: {
    parseTime (val, format = '{y}-{m}-{d}') {
      if (val) {
        return parseTime(val, format)
      }
      return val
    }
  },
  data () {
    return {
      tableHeight: '',
      pageInfo: {
        pageSize: 10,
        pageNum: 1
      }
    }
  },
  mounted () {

  },
  methods: {
    /**
     * @description 快速通过prop获取value, 用于etm-tool-bar组件
     * @param prop
     * @param formData
     * @returns {*|number|bigint|string}
     */
    getValueByProp (prop, formData = this.formData) {
      const obj = formData.find(item => {
        return item.prop === prop
      })
      return (obj && obj.value) || ''
    },
    getObjectByProp (prop, formData = this.formData) {
      const obj = formData.find(item => {
        return item.prop === prop
      })
      return obj || {}
    },
    /**
     * 转换数据为下拉用
     * @param data
     * @param label
     * @param value
     * @returns {*}
     */
    convertDataToOptions (data, label = 'label', value = 'value') {
      return data.map(item => {
        return {
          label: item[label],
          value: item[value],
          ...item
        }
      })
    },
    forceUpdate () {
      this.$forceUpdate()
    },
    dateToWeek (date) {
      return '星期' + '日一二三四五六 '.charAt(new Date(date).getDay())
    },
    /**
     * 权限控制
     * @param authId {string} 权限ID server.module.action
     * @param parentRef {string} 父级ref引用 ref="tabs" v-model="activeName"
     * @param activeTabVar {string} 父级v-model的属性名 'activeName'
     * @returns {*}
     */
    hasAuth (authId, parentRef, activeTabVar) {
      if (!parentRef) {
        console.error('请传入父级的ref')
        return true
      }
      if (parentRef) {
        this.$nextTick(() => {
          try {
            const filter = this.$refs[parentRef].$slots.default.filter(i => i.tag)
            const find = filter.find(item => item.componentInstance.name === this[activeTabVar])
            if (!find) {
              this[activeTabVar] = filter.find(item => item.componentInstance.name).componentInstance.name
            }
          } catch (e) {
            this[activeTabVar] = ''
            let parentTag = this.$refs[parentRef]
            if (!parentTag) {
              console.error('请检查父级的ref是否是 => ', parentRef)
              return false
            }
            let index = 0
            while (parentTag.$options._componentTag !== 'etm-layout-split') {
              if (index > 100) {
                console.error(`'你代码结构有问题吧? 层级超过${index}层了'`)
              }
              index++
              parentTag = parentTag.$parent
            }
            if (parentTag.$el.parentNode) {
              parentTag.$el.parentNode.removeChild(parentTag.$el)
            }
            checkAuth(true)
          }
          checkAuth()
        })
      }

      function checkAuth (err) {
        if (err) {
          return false
        }
        if (!hiddenButtonAuth) {
          hiddenButtonAuth = JSON.parse(localStorage.getItem('CACHESOLUTION')).map(item => {
            return item.hiddenButtonList.map(button => {
              try {
                return JSON.parse(button.config).authId
              } catch (e) {
                console.error('error in src/layout/mixin/baseMixin.js:257 function:() ', e)
              }
            })
          }).flat(Infinity)
        }

        const BUTTON = JSON.parse(localStorage.getItem('BUTTON'))
        const code = getCodeByPath(authId)

        const findHidden = hiddenButtonAuth.find(authId => authId === code + '')
        if (findHidden) {
          return false
        }
        const result = BUTTON.find(item => {
          if (item.config) {
            try {
              item.config = JSON.parse(item.config)
            } catch (e) {
              console.log('序列化资源标识失败, 请确认标识是否为JSON格式', item)
            }
          }
          return item.config.authId === code
        })
        // console.log('result: ', result)
        if (!result) {
          return true
        } else {
          return !!result.buttonEnabled
        }
      }

      return checkAuth()
    },
    /**
     * 权限判断
     * @param authId
     * @returns {boolean}
     */
    hasAuthOfBool (authId) {
      if (!authId) {
        return false
      }
      if (!hiddenButtonAuth) {
        hiddenButtonAuth = JSON.parse(localStorage.getItem('CACHESOLUTION')).map(item => {
          return item.hiddenButtonList.map(button => {
            try {
              return JSON.parse(button.config).authId
            } catch (e) {
              console.error('error in src/layout/mixin/baseMixin.js:305 function:() ', e)
            }
          })
        }).flat(Infinity)
      }
      const code = getCodeByPath(authId)
      const findHidden = hiddenButtonAuth.find(authId => authId === code + '')
      if (findHidden) {
        return false
      }
      const BUTTON = JSON.parse(localStorage.getItem('BUTTON'))

      console.log('code: ', code)
      const result = BUTTON.find(item => {
        if (item.config) {
          try {
            item.config = JSON.parse(item.config)
          } catch (e) {
            console.log('序列化资源标识失败, 请确认标识是否为JSON格式', item)
          }
        }
        return item.config.authId === code
      })
      if (!result) {
        return true
      } else {
        return !!result.buttonEnabled
      }
    }
  }
}
