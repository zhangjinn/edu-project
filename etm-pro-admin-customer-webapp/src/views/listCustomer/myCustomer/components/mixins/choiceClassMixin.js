
export const choiceClassMixin = {
  components: {

  },
  data () {
    return {
      cacheTemplate: {
        PRODUCT: []
      }
    }
  },
  methods: {
    selectEvent (name, typeName) {
      this.showPop = true

      this.$nextTick(() => {
        this.$refs.pop.getData()
      })
    },
    cancelCache () {
      this.cacheTemplate = {
        PRODUCT: []
      }
    },
    // 子弹窗确认事件
    popConfirm () {
      const selection = this.$refs.pop.getSelectionData()
      // const _list = []
      // const list = []
      const _cache = []
      let isExist = false
      // 数据去重

      if (!selection.list) {
        return false
      }

      selection.list.forEach(cur => {
        if (!this.cacheTemplate.PRODUCT.includes(cur.id)) {
          _cache.push(cur)
        } else {
          isExist = '产品'
        }
      })

      // 做数据兼容
      const _result = _cache.map(cur => {
        this.cacheTemplate.PRODUCT.push(cur.id)
        return {
          id: cur.id,
          name: cur.productName,
          modify: cur.unitPrice,
          netReceipts: cur.unitPrice,
          receivable: cur.unitPrice,
          purchase: 1,
          give: 0,
          img: cur.cover || '',
          receivableNotes: cur.unitPrice,
          netReceiptsNotes: cur.unitPrice,
          cacSetMealEnum: 'PRODUCT'
          // childList: null
        }
      })

      if (isExist) {
        this.$message({
          type: 'warning',
          message: '已存在部分' + isExist
        })
      }
      if (this.popConfirmHandle) {
        this.popConfirmHandle(_result)
      }

      this.showPop = false
    }
  }
}
