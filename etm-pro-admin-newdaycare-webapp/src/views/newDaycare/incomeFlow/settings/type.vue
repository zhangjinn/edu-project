<template>
  <div class="type-wrap">
    <div class="wrapList">
      <etm-title
        border
        show-toggle
        open-text=""
        close-text=""
        @toggle="toggle($event, 'income')"
      >
        收入科目
      </etm-title>
      <item-template
        v-show="showIncome"
        :data.sync="incomeDragData"
        :add-disable="incomeAddDisable"
        btn-text="添加新科目"
        :no-slot="['color']"
        @add="addItemIncome"
        @delete="deleteItemIncome"
        @focus="handleFocusIncome"
        @blur="updateNewIncome"
      />
    </div>
    <div class="wrapList">
      <etm-title
        border
        show-toggle
        open-text=""
        close-text=""
        @toggle="toggle($event, 'outcome')"
      >
        支出科目
      </etm-title>
      <item-template
        v-show="showOutcome"
        :data.sync="expenditureDragData"
        :add-disable="expenditureAddDisable"
        btn-text="添加新科目"
        :no-slot="['color']"
        @add="addItemExp"
        @delete="deleteItemExp"
        @focus="handleFocusExp"
        @blur="updateNewExp"
      />
    </div>
  </div>
</template>

<script>
/**
 * type create by 油麦菜
 * createTime 2020/9/14 14:10
 */
import itemTemplate from '../components/itemTemplate'
import {
  queryIncomeOrExpenditureType,
  UIncomeAndExpenditureType,
  DelIncomeAndExpenditureType
} from '@/api/newDaycare/incomeFlow'

export default {
  name: 'Type',
  components: {
    itemTemplate
  },
  filters: {},
  mixins: [],
  props: {},
  data () {
    return {
      incomeDragData: [],
      incomeOldText: '',
      expenditureDragData: [],
      expenditureOldText: '',
      incomeAddDisable: false,
      expenditureAddDisable: false,
      showIncome: true,
      showOutcome: true
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
    toggle (t, type) {
      if (type === 'income') {
        this.showIncome = t
      } else {
        this.showOutcome = t
      }
    },
    init () {
      queryIncomeOrExpenditureType({
        type: 'INCOME'
      }).then(res => {
        // const dragData = []
        // const tureFlag = ['新签约', '续约', '订金']
        res.data.forEach(item => {
          // let editable = false
          // if (!tureFlag.includes(item.incomeAndExpenditureTypeName)) {
          //   editable = true
          // }
          this.incomeDragData.push({
            text: item.incomeAndExpenditureTypeName,
            editable: item.del,
            id: item.incomeAndExpenditureTypeId
          })
        })
        // this.dragData = dragData
      })
      queryIncomeOrExpenditureType({
        type: 'EXPENDITURE'
      }).then(res => {
        // const dragData = []
        res.data.forEach(item => {
          // let editable = false
          // if (item.incomeAndExpenditureTypeName !== '退费') {
          //   editable = true
          // }
          this.expenditureDragData.push({
            text: item.incomeAndExpenditureTypeName,
            editable: item.del,
            id: item.incomeAndExpenditureTypeId
          })
        })
        // this.dragData = dragData
      })
    },
    addItemIncome (a) {
      this.incomeDragData.push({
        text: '',
        editable: true
      })
      this.incomeAddDisable = true
    },
    deleteItemIncome (a) {
      // this.dragData.splice(a[0].index, 1)
      if (this.incomeDragData[a[0].index].id) {
        DelIncomeAndExpenditureType({
          incomeAndExpenditureTypeId: this.incomeDragData[a[0].index].id
        }).then(res => {
          if (res.message === '成功') {
            this.incomeDragData.splice(a[0].index, 1)
            this.isIncomeClick()
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          } else {
            this.isIncomeClick()
            this.$message({
              type: 'error',
              message: '删除失败'
            })
          }
        })
      } else {
        this.incomeDragData.splice(a[0].index, 1)
        this.isIncomeClick()
      }
    },
    handleFocusIncome (a) {
      this.incomeOldText = this.incomeDragData[a].text
    },
    updateNewIncome (a) {
      if (this.incomeDragData[a].text.trim() === '') {
        this.$message({
          type: 'info',
          message: '支付方式不能为空'
        })
        this.incomeDragData[a].text = this.incomeOldText
      } else if (this.incomeOldText.trim() !== this.incomeDragData[a].text.trim()) {
        UIncomeAndExpenditureType({
          id: this.incomeDragData[a].id,
          name: this.incomeDragData[a].text,
          type: 'INCOME'
        }).then(res => {
          if (res.message === '成功') {
            this.isIncomeClick()
            this.$message({
              type: 'success',
              message: '添加/修改支付方式成功'
            })
          }
        }).catch(() => {
          this.incomeDragData[a].text = ''
        })
      } else {
        this.isIncomeClick()
      }
    },
    addItemExp (a) {
      this.expenditureDragData.push({
        text: '',
        editable: true
      })
      this.expenditureAddDisable = true
    },
    deleteItemExp (a) {
      // this.dragData.splice(a[0].index, 1)
      if (this.expenditureDragData[a[0].index].id) {
        DelIncomeAndExpenditureType({
          incomeAndExpenditureTypeId: this.expenditureDragData[a[0].index].id
        }).then(res => {
          if (res.message === '成功') {
            this.expenditureDragData.splice(a[0].index, 1)
            this.isExpClick()
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          } else {
            this.isExpClick()
            this.$message({
              type: 'error',
              message: '删除失败'
            })
          }
        })
      } else {
        this.expenditureDragData.splice(a[0].index, 1)
        this.isExpClick()
      }
    },
    handleFocusExp (a) {
      this.expenditureOldText = this.expenditureDragData[a].text
    },
    updateNewExp (a) {
      if (this.expenditureDragData[a].text.trim() === '') {
        this.$message({
          type: 'info',
          message: '支出类型不能为空'
        })
        this.expenditureDragData[a].text = this.expenditureOldText
      } else if (this.expenditureOldText.trim() !== this.expenditureDragData[a].text.trim()) {
        UIncomeAndExpenditureType({
          id: this.expenditureDragData[a].id,
          name: this.expenditureDragData[a].text,
          type: 'EXPENDITURE'
        }).then(res => {
          if (res.message === '成功') {
            this.isExpClick()
            this.$message({
              type: 'success',
              message: '添加/修改支出类型成功'
            })
          }
        }).catch(() => {
          this.expenditureDragData[a].text = ''
        })
      } else {
        this.isExpClick()
      }
    },
    // 添加类型是否可点击
    isIncomeClick () {
      for (let i = 0; i < this.incomeDragData.length; i++) {
        if (this.incomeDragData[i].text === '') {
          this.incomeAddDisable = true
          return ''
        } else {
          this.incomeAddDisable = false
        }
      }
    },
    isExpClick () {
      for (let i = 0; i < this.expenditureDragData.length; i++) {
        if (this.expenditureDragData[i].text === '') {
          this.expenditureAddDisable = true
          return ''
        } else {
          this.expenditureAddDisable = false
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.type-wrap {
  width: 532px;

  .wrapList {
    &:not(:first-child) {
      margin-top: 16px;
    }

    ::v-deep .box {
      &.bdb {
        padding-bottom: 8px;
      }
    }
  }
}
</style>
