import { parseTime } from '@/utils'
import XLSX from 'xlsx'
import { getCodeByPath } from '@/auth'
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
      weChatUrl: '',
      tableHeight: '',
      pageInfo: {
        pageSize: 10,
        pageNum: 1
      }
    }
  },
  mounted () {
    this.__init__()
  },
  methods: {
    __init__ () {
      this.getWechatUrl()
    },
    getWechatUrl () {
      try {
        const mobileUrl = JSON.parse(JSON.parse(localStorage.getItem('hostConfig')).config).mobileUrl
        const currentOrganizationId = +JSON.parse(localStorage.getItem('currentOrganizationId'))
        const currentOrganization = JSON.parse(localStorage.getItem('organizations')).find(curr => {
          return curr.enterpriseId === currentOrganizationId
        })
        this.weChatUrl = mobileUrl + '?organizationId=' + currentOrganization.encryptedEnterpriseId
      } catch (e) {
        console.error('error in /src/layout/mixin/baseMixin.js:55 function getWechatUrl() ', e)
      }
    },
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
    resetProp () {
      this.formData.forEach(item => {
        item.value = ''
      })
    },
    resetValue (target, valueArr) {
      target.forEach((item, index) => {
        if (Array.isArray(valueArr)) {
          item.value = valueArr[index]
        } else {
          item.value = ''
        }
      })
    },
    /**
     * @description 重置表格自适应高度
     * @param etmTableRef
     */
    async resetHeight (etmTableRef) {
      await this.$nextTick()
      const els = this.$refs[etmTableRef].$el
      const tableTop = this.computedHeight(els)
      const tableHeight = window.innerHeight - tableTop - 78
      this.tableHeight = tableHeight
      return tableHeight
    },

    /**
     * @description 计算表格自适应高度
     * @param ref
     * @returns {number}
     */
    computedHeight (ref) {
      let top = 0
      if (ref.nodeName.toLowerCase() === 'body') {
        top += ref.offsetTop
      } else {
        while (ref) {
          top += ref.offsetTop
          ref = ref.offsetParent
        }
      }
      return top
    },
    /**
     * 转换数据为下拉用
     * @param data
     * @param label
     * @param value
     * @returns {*}
     */
    convertDataToOptions (data, label = 'label', value = 'value') {
      const result = data.map(item => {
        return {
          label: item[label],
          value: item[value],
          ...item
        }
      })
      return result
    },
    forceUpdate () {
      this.$forceUpdate()
    },
    dateToWeek (date) {
      return '星期' + '日一二三四五六 '.charAt(new Date(date).getDay())
    },
    /**
     * @function 前端处理导出表格
     * @param id {string}
     * @param name {string} 导出表格名称
     * @param sheetName {string} 导出表格sheet名称
     * @param ref {Dom} 节点
     * @param opt {Object} 表格设置
     * @param opt.wpx {string|number} 列宽（px)
     * @param opt.hpx {string|number} 行宽（px)
     * @param opt.formatter {function} 格式化单元格 ：接收参数 (key, cell, value) 【单元格行列号，单元格，单元格的值】
     * @param opt.raw {boolean} 默认为true 将每个单元格将保留原始字符串
     * @param opt.dateNF {string} 在字符串输出中使用指定的日期格式
     * @param opt.cellDates {boolean} 默认为false 将日期存储为类型d（默认为n）
     * @param opt.skipHeader {boolean} 默认为false 如果为true，导出的表格不包含标题行
     * @param opt.display {boolean} 默认为false 如果为true，则不会解析隐藏的行和单元格
     * @returns {*}
     */
    exportTableToExcel ({ id = null, ref = null, name = '表格', sheetName = name, opt = {} }) {
      let table = null
      if (id) table = document.getElementById(id)
      else if (ref) table = ref
      else {
        console.error('使用exportTableToExcel错误：导出表格必须传入表格节点元素或者表格节点id')
        return
      }
      const {
        wpx = 200,
        hpx = 50,
        formatter = null,
        raw = true,
        dateNF = 'm/d/yy',
        skipHeader = false,
        cellDates = false,
        display = false
      } = opt
      const wb = XLSX.utils.table_to_book(table, { sheet: sheetName, raw, dateNF, skipHeader, cellDates, display })
      const sheet = wb.Sheets[wb.SheetNames[0]]
      const range = XLSX.utils.decode_range(sheet['!ref'])
      const noRows = range.e.r // No. of rows
      const noCols = range.e.c // No. of cols
      sheet['!cols'] = []
      sheet['!rows'] = []
      for (let i = 0; i < noCols; i++) {
        sheet['!cols'].push({ wpx })
      }
      for (let i = 0; i <= noRows; i++) {
        sheet['!rows'].push({ hpx })
      }
      if (formatter && typeof formatter === 'function') {
        for (const k in sheet) {
          const item = sheet[k]
          if (k.includes('!')) continue
          else {
            item.v = formatter(k, item, item.v)
          }
        }
      }
      XLSX.writeFile(wb, name + '.xlsx')
      // todo 单元格背景色和字体样式
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
