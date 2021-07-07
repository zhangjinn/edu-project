<template>
  <div class="incomeCostType-wrap">
    <div class="wrapList">
      <etm-title
        border
        show-toggle
        open-text=""
        close-text=""
        @toggle="toggle($event, 'income')"
      >收入项目
      </etm-title>
      <div class="itemBox">
        <item-template
          v-show="showIncome"
          :data.sync="incomeData"
          btn-text="添加新类型"
          :no-slot="['color']"
          @change="handleChange('INCOME')"
          @add="addItem('INCOME')"
          @delete="deleteItem($event, 'INCOME')"
          @focus="handleFocus($event, 'INCOME')"
          @blur="updateNew($event, 'INCOME')"
        />
      </div>
    </div>
    <div class="wrapList">

      <etm-title
        border
        show-toggle
        open-text=""
        close-text=""
        @toggle="toggle($event, 'outcome')"
      >支出项目
      </etm-title>
      <div class="itemBox">
        <item-template
          v-show="showOutcome"
          :data.sync="outcomeData"
          btn-text="添加新类型"
          :no-slot="['color']"
          @change="handleChange('OUTCOME')"
          @add="addItem('OUTCOME')"
          @delete="deleteItem($event, 'OUTCOME')"
          @focus="handleFocus($event, 'OUTCOME')"
          @blur="updateNew($event, 'OUTCOME')"
        />
      </div>
    </div>
  </div>

</template>

<script>
/**
 * incomeCostType create by Administrator
 * createTime 2020/9/8 15:12
 */
import itemTemplate from '@/views/newDaycare/childManage/components/itemTemplate'
import {
  addStatementItem,
  deleteStatementItem,
  getStatementItemList,
  renewStatementItem,
  renewStatementItemSort
} from '@/api/guardcare/financeManage/incomeCostSetting'

export default {
  name: 'IncomeCostType',
  components: {
    itemTemplate
  },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      incomeData: [],
      outcomeData: [],
      oldText: '',
      showIncome: true,
      showOutcome: true
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getData()
  },
  mounted() {
  },
  methods: {
    toggle(t, type) {
      if (type === 'income') {
        this.showIncome = t
      } else {
        this.showOutcome = t
      }
    },
    getData() {
      this.getIncomeItem()
      this.getOutcomeItem()
    },
    getIncomeItem() {
      const param = {
        type: 'INCOME'
      }
      if (this.incomeData.length) {
        this.incomeData = []
      }
      getStatementItemList(param).then(res => {
        res.data.forEach(v => {
          this.incomeData.push({
            text: v.statementTypeName,
            id: v.statementTypeId
          })
        })
      })
    },
    getOutcomeItem() {
      const param = {
        type: 'OUTCOME'
      }
      if (this.outcomeData.length) {
        this.outcomeData = []
      }
      getStatementItemList(param).then(res => {
        res.data.forEach(v => {
          this.outcomeData.push({
            text: v.statementTypeName,
            id: v.statementTypeId
          })
        })
      })
    },
    handleChange(type) {
      const param = {
        ids: []
      }
      if (type === 'INCOME') {
        this.incomeData.forEach(v => {
          param.ids.push(v.id)
        })
      } else {
        this.outcomeData.forEach(v => {
          param.ids.push(v.id)
        })
      }
      renewStatementItemSort(param).then(() => {
        this.$message.success('排序修改成功')
      })
    },
    addItem(type) {
      if (type === 'INCOME') {
        const data = this.incomeData
        if (data[data.length - 1] && !data[data.length - 1].text) return this.$message.warning('请先填写前一项的内容')
        this.incomeData.push({
          text: ''
        })
      } else {
        const data = this.outcomeData
        if (data[data.length - 1] && !data[data.length - 1].text) return this.$message.warning('请先填写前一项的内容')
        this.outcomeData.push({
          text: ''
        })
      }
    },
    deleteItem(e, type) {
      if (type === 'INCOME') {
        if (this.incomeData[e[0].index].id) {
          deleteStatementItem(this.incomeData[e[0].index].id).then(() => {
            this.$message.success('删除成功')
          })
        }
        this.incomeData.splice(e[0].index, 1)
      } else {
        if (this.outcomeData[e[0].index].id) {
          deleteStatementItem(this.outcomeData[e[0].index].id).then(() => {
            this.$message.success('删除成功')
          })
        }
        this.outcomeData.splice(e[0].index, 1)
      }
    },
    handleFocus(index, type) {
      if (type === 'INCOME') {
        this.oldText = this.incomeData[index].text
      } else {
        this.oldText = this.outcomeData[index].text
      }
    },
    updateNew(index, type) {
      let target
      if (type === 'INCOME') {
        target = this.incomeData[index]
      } else {
        target = this.outcomeData[index]
      }
      if (target.text === this.oldText) {
        return
      } else {
        const param = {
          type: type,
          statementTypeName: target.text
        }
        if (target.id) {
          renewStatementItem(target.id, param).then(() => {
            this.$message.success('修改成功')
          })
        } else {
          addStatementItem(param).then(() => {
            this.$message.success('新增成功')
          })
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.incomeCostType-wrap {
  width: 564px;

  .wrapList {
    & + .wrapList {
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
