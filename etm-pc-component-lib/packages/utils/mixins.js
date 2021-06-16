export default {
  data() {
    return {
      formData: [],
      pageInfo: {
        pageNum: 1,
        pageSize: 10
      }
    }
  },
  methods: {
    getObjectByProp(prop, formData) {
      const data = formData || this.formData
      return data.find(item => {
        return item.prop === prop
      })
    },
    /**
     * @description 快速通过prop获取value, 用于etm-tool-bar组件
     * @param prop
     * @param formData
     * @returns {*|number|bigint|string}
     */
    getValueByProp(prop, formData = this.formData) {
      const obj = formData.find(item => {
        return item.prop === prop
      })
      return obj && obj.value || ''
    },
    resetValueByType(type, formData = this.formData) {
      formData.forEach(item => {
        if (item.type === type) {
          switch (type) {
            case 'input':
              item.value = item.default
              break
            case 'select':
              item.value = item.default
              break
            case 'date':
              item.value = new Date()
              if (item.props.type === 'daterange') {
                item.value = [new Date(), new Date()]
              }
              break
          }
        }
      })
    },
    resetFromData(formData) {
      formData.forEach(item => {
        switch (item.type) {
          case 'input':
            item.value = item.default
            break
          case 'select':
            item.value = item.default
            break
          case 'date':
            item.value = new Date()
            if (item.props.type === 'daterange') {
              item.value = [new Date(), new Date()]
            }
            break
        }
      })
    }
  }
}
