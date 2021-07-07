import { parseTime } from '@/utils'
// import XLSX from 'xlsx'

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
    }
  }

}
