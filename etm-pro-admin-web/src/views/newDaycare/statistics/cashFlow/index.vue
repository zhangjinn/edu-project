<template>
  <div class="cashFlow-wrap">
    <etm-main-body>
      <etm-layout-split>
        <div slot="header">
          <etm-tabs>
            <el-tab-pane :label="tabPlanLabel">
              <etm-tool-bar v-show="true" v-model="formData" @search="handleSearch" @reset="handleReset" />
            </el-tab-pane>
          </etm-tabs>
        </div>
        <div slot="body">
          <etm-table
            ref="xlsxTable"
            :columns="colOption"
            :data="tableData.content"
            :span-method="objectSpanMethod"
          >
            <etm-table-tool-bar slot="tool">
              <div slot="right">
                <el-button plain @click="exportTableToExcel({ref:$refs.xlsxTable.$el, name:tabPlanLabel})">导出Excel
                </el-button>
              </div>
            </etm-table-tool-bar>
            <el-table-column slot="left" fixed="left" label="流向" width="48" prop="cashFlowType">
              <template slot-scope="scoped">
                <div class="textCenter">{{ scoped.row.flow }}</div>
              </template>
            </el-table-column>
            <el-table-column slot="left" fixed="left" label="类型" width="120">
              <template slot-scope="scoped">
                <div :class="getClass(scoped.$index) ? 'textCenter main' : ''">
                  {{ scoped.row.type === true ? '系统生成' : scoped.row.type === false ? '记一笔' : scoped.row.type }}
                </div>
              </template>
            </el-table-column>
            <el-table-column slot="left" fixed="left" label="项目" width="150">
              <template slot-scope="scoped">
                <span :class="getClass(scoped.$index) ? 'main' : ''">{{ scoped.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column slot="left" label="1月" width="120" align="right">
              <template slot-scope="scoped">
                <span :class="getClass(scoped.$index) ? 'main' : ''">{{ formatMoney(scoped.row.jan) }}</span>
              </template>
            </el-table-column>
            <el-table-column slot="left" label="2月" width="120" align="right">
              <template slot-scope="scoped">
                <span :class="getClass(scoped.$index) ? 'main' : ''">{{ formatMoney(scoped.row.feb) }}</span>
              </template>
            </el-table-column>
            <el-table-column slot="left" label="3月" width="120" align="right">
              <template slot-scope="scoped">
                <span :class="getClass(scoped.$index) ? 'main' : ''">{{ formatMoney(scoped.row.mar) }}</span>
              </template>
            </el-table-column>
            <el-table-column slot="left" label="4月" width="120" align="right">
              <template slot-scope="scoped">
                <span :class="getClass(scoped.$index) ? 'main' : ''">{{ formatMoney(scoped.row.apr) }}</span>
              </template>
            </el-table-column>
            <el-table-column slot="left" label="5月" width="120" align="right">
              <template slot-scope="scoped">
                <span :class="getClass(scoped.$index) ? 'main' : ''">{{ formatMoney(scoped.row.may) }}</span>
              </template>
            </el-table-column>
            <el-table-column slot="left" label="6月" width="120" align="right">
              <template slot-scope="scoped">
                <span :class="getClass(scoped.$index) ? 'main' : ''">{{ formatMoney(scoped.row.june) }}</span>
              </template>
            </el-table-column>
            <el-table-column slot="left" label="7月" width="120" align="right">
              <template slot-scope="scoped">
                <span :class="getClass(scoped.$index) ? 'main' : ''">{{ formatMoney(scoped.row.july) }}</span>
              </template>
            </el-table-column>
            <el-table-column slot="left" label="8月" width="120" align="right">
              <template slot-scope="scoped">
                <span :class="getClass(scoped.$index) ? 'main' : ''">{{ formatMoney(scoped.row.aug) }}</span>
              </template>
            </el-table-column>
            <el-table-column slot="left" label="9月" width="120" align="right">
              <template slot-scope="scoped">
                <span :class="getClass(scoped.$index) ? 'main' : ''">{{ formatMoney(scoped.row.sept) }}</span>
              </template>
            </el-table-column>
            <el-table-column slot="left" label="10月" width="120" align="right">
              <template slot-scope="scoped">
                <span :class="getClass(scoped.$index) ? 'main' : ''">{{ formatMoney(scoped.row.oct) }}</span>
              </template>
            </el-table-column>
            <el-table-column slot="left" label="11月" width="120" align="right">
              <template slot-scope="scoped">
                <span :class="getClass(scoped.$index) ? 'main' : ''">{{ formatMoney(scoped.row.nov) }}</span>
              </template>
            </el-table-column>
            <el-table-column slot="left" label="12月" width="120" align="right">
              <template slot-scope="scoped">
                <span :class="getClass(scoped.$index) ? 'main' : ''">{{ formatMoney(scoped.row.dece) }}</span>
              </template>
            </el-table-column>
            <el-table-column slot="right" fixed="right" label="总计" width="120" align="right">
              <template slot-scope="scoped">
                <span :class="getClass(scoped.$index) ? 'main' : ''">{{ formatMoney(scoped.row.total) }}</span>
              </template>
            </el-table-column>
          </etm-table>
        </div>
      </etm-layout-split>
    </etm-main-body>
  </div>
</template>

<script>
/**
 * cashFlow create by shanglu
 * createTime 2020/9/16 10:36
 */
import baseMixin from '@/layout/mixin/baseMixin'
import { queryStatisticsCashFlow } from '@/api/newDaycare/statistics'

export default {
  name: 'CashFlow',
  mixins: [baseMixin],
  data() {
    return {
      tabPlanLabel: '现金流量表',
      searchForm: {
        // year: ''
        year: new Date().getFullYear()
      },
      formData: [{
        label: '年份',
        type: 'date',
        prop: 'year',
        value: new Date(),
        default: new Date(),
        props: {
          type: 'year',
          placeholder: '请选择年份',
          clearable: false,
          'picker-options': {
            disabledDate(time) {
              return time.getTime() > new Date().getTime()
            }
          }
          // 'value-format': 'yyyy' ?不起作用
        }
      }],
      tableData: {
        incomeNum: 0,
        expenditrueNum: 0,
        content: []
      },
      colOption: [],
      rowNum: []
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      queryStatisticsCashFlow(this.searchForm).then(res => {
        const INCOME = res.data.find(v => v.flowDirection === 'INCOME').monthlyStatisticsAmountVOList
        const EXPENDITURE = res.data.find(v => v.flowDirection === 'EXPENDITURE').monthlyStatisticsAmountVOList
        const NET_CASH_FLOW = res.data.find(v => v.flowDirection === 'NET_CASH_FLOW').monthlyStatisticsAmountVOList
        this.tableData = {
          content: [],
          incomeNum: Number(INCOME.length),
          expenditrueNum: Number(EXPENDITURE.length)
        }
        this.rowNum = []
        INCOME.forEach(v => {
          v.flow = '现金流入(元)'
          if (v.type === null) {
            v.type = '流入小计（元）'
          }
          this.tableData.content.push(v)
        })
        this.rowNum.push(INCOME.length)
        EXPENDITURE.forEach(v => {
          v.flow = '现金流出(元)'
          if (v.type === null) {
            v.type = '流出小计（元）'
          }
          this.tableData.content.push(v)
        })
        this.rowNum.push(EXPENDITURE.length)
        NET_CASH_FLOW.forEach(v => {
          v.flow = v.name
          v.type = v.name
          this.tableData.content.push(v)
        })
        this.rowNum.push(NET_CASH_FLOW.length)
      })
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) { // 表格合并
      if (column.property === 'cashFlowType' && rowIndex !== (this.tableData.incomeNum + this.tableData.expenditrueNum)) {
        let num = 0
        let flag = false
        for (let i = 0; i < this.rowNum.length; i++) {
          if (rowIndex === this.addNum(i - 1)) {
            num = i
            flag = true
          }
        }
        if (flag) {
          return {
            rowspan: this.rowNum[num],
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      } else if (rowIndex === (this.tableData.incomeNum - 1) || rowIndex === (this.tableData.incomeNum + this.tableData.expenditrueNum - 1)) {
        if (columnIndex === 1) {
          return {
            rowspan: 1,
            colspan: 2
          }
        } else if (columnIndex === 2) {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      } else if (rowIndex === (this.tableData.incomeNum + this.tableData.expenditrueNum)) {
        if (columnIndex === 1) {
          return {
            rowspan: 1,
            colspan: 3
          }
        } else if (columnIndex < 3) {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    addNum(index) { // 数组前index+1项之和
      if (index < 0) return 0
      let num = 0
      this.rowNum.forEach((item, ind) => {
        if (ind <= index) {
          num += item
        }
      })
      return num
    },
    getClass(index) {
      if (index === (this.tableData.incomeNum - 1) || index === (this.tableData.incomeNum + this.tableData.expenditrueNum - 1) ||
        index === (this.tableData.incomeNum + this.tableData.expenditrueNum)) {
        return true
      } else {
        return false
      }
    },
    handleSearch() {
      let year = this.formData[0].value || ''
      if (typeof year === 'string') {
        year = this.formData[0].value.slice(0, 4)
      } else if (typeof year === 'object') {
        year = this.formData[0].value.getFullYear()
      }
      this.searchForm.year = year
      this.init()
    },
    handleReset() {
      this.searchForm = {
        year: new Date().getFullYear()
      }
      this.init()
    },
    formatter(row, column, cellValue, index) {
      return cellValue
    },
    formatMoney(money) {
      if (!isNaN(money)) {
        return money.toFixed(2)
      } else {
        return money
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.cashFlow-wrap {
  .textCenter {
    text-align: center;
  }

  .main {
    @include c_main_color();
  }

  ::v-deep thead {
    th:first-child {
      .cell {
        padding: 0 !important;
        text-align: center;
      }
    }
  }
}
</style>
