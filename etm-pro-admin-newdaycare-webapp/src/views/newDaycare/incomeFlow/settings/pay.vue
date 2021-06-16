<template>
  <div class="pay-wrap">
    <item-template
      :data.sync="dragData"
      btn-text="添加新类型"
      :no-slot="['color']"
      :add-disable="addDisable"
      @add="addItem"
      @delete="deleteItem"
      @focus="handleFocus"
      @blur="updateNew"
    />
  </div>
</template>

<script>
/**
 * pay create by 油麦菜
 * createTime 2020/9/14 14:12
 */
import itemTemplate from '../components/itemTemplate'
import { financePayType, UFinancePayType, DelFinancePayType } from '@/api/newDaycare/incomeFlow'
export default {
  name: 'Pay',
  components: {
    itemTemplate
  },
  filters: {},
  mixins: [],
  props: {},
  data () {
    return {
      dragData: [],
      oldText: '',
      addDisable: false
    }
  },
  computed: {},
  watch: {},
  created () {
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      financePayType().then(res => {
        // const dragData = []
        res.data.forEach(item => {
          this.dragData.push({
            text: item.financePayTypeName,
            editable: true,
            id: item.financePayTypeId
          })
        })
        // this.dragData = dragData
      })
    },
    addItem (a) {
      this.dragData.push({
        text: '',
        editable: true
      })
      this.addDisable = true
    },
    deleteItem (a) {
      // this.dragData.splice(a[0].index, 1)
      if (this.dragData[a[0].index].id) {
        DelFinancePayType({
          financePayTypeId: this.dragData[a[0].index].id
        }).then(res => {
          if (res.message === '成功') {
            this.dragData.splice(a[0].index, 1)
            this.isClick()
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          } else {
            this.isClick()
            this.$message({
              type: 'error',
              message: '删除失败'
            })
          }
        })
      } else {
        this.dragData.splice(a[0].index, 1)
        this.isClick()
      }
    },
    handleFocus (a) {
      this.oldText = this.dragData[a].text
    },
    updateNew (a) {
      if (this.dragData[a].text.trim() === '') {
        this.$message({
          type: 'info',
          message: '支付方式不能为空'
        })
        this.dragData[a].text = this.oldText
      } else if (this.oldText.trim() !== this.dragData[a].text.trim()) {
        UFinancePayType({
          financePayTypeId: this.dragData[a].id,
          financePayTypeName: this.dragData[a].text
        }).then(res => {
          if (res.message === '成功') {
            this.isClick()
            this.$message({
              type: 'success',
              message: '添加/修改支付方式成功'
            })
          }
        }).catch(() => {
          this.dragData[a].text = ''
        })
      } else {
        this.isClick()
      }
    },
    // 添加类型是否可点击
    isClick () {
      for (let i = 0; i < this.dragData.length; i++) {
        if (this.dragData[i].text === '') {
          this.addDisable = true
          return ''
        } else {
          this.addDisable = false
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
