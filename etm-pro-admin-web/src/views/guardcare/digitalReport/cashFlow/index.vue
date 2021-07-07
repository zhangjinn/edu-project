<template>
  <div class="index-wrap">
    <etm-main-body>
      <etm-layout-split>
        <div slot="header">
          <etm-tabs v-model="activeName">
            <el-tab-pane label="现金流量表" name="cash">
              <etm-tool-bar v-model="searchForm" @search="handleSearch" @reset="reset" />
            </el-tab-pane>
          </etm-tabs>
        </div>
        <div slot="body">
          <etm-table
            :data="tableData"
            :columns="column"
            :stripe="false"
            :span-method="objectSpanMethod"
          >
            <etm-table-tool-bar slot="tool">
              <div slot="right">
                <el-button v-has="{authId: 'guardcare.cashFlow.excelExport'}" plain @click="exportExcel">
                  导出Excel
                </el-button>
              </div>
            </etm-table-tool-bar>
            <el-table-column slot="left" fixed="left" label="流向" width="48" prop="cashFlowType">
              <template slot-scope="scoped">
                <div class="textCenter">{{ scoped.row.cashFlowType }}</div>
              </template>
            </el-table-column>
            <el-table-column slot="left" fixed="left" label="类型" width="120">
              <template slot-scope="scoped">
                <div :class="getClass(scoped.$index) ? 'textCenter main' : ''">{{ scoped.row.type }}</div>
              </template>
            </el-table-column>
            <el-table-column slot="left" fixed="left" label="项目" width="150">
              <template slot-scope="scoped">
                <span :class="getClass(scoped.$index) ? 'main' : ''">{{ scoped.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column slot="left" label="1月" width="120" align="right">
              <template slot-scope="scoped">
                <span :class="getClass(scoped.$index) ? 'main' : ''">{{ scoped.row.month1 }}</span>
              </template>
            </el-table-column>
            <el-table-column slot="left" label="2月" width="120" align="right">
              <template slot-scope="scoped">
                <span :class="getClass(scoped.$index) ? 'main' : ''">{{ scoped.row.month2 }}</span>
              </template>
            </el-table-column>
            <el-table-column slot="left" label="3月" width="120" align="right">
              <template slot-scope="scoped">
                <span :class="getClass(scoped.$index) ? 'main' : ''">{{ scoped.row.month3 }}</span>
              </template>
            </el-table-column>
            <el-table-column slot="left" label="4月" width="120" align="right">
              <template slot-scope="scoped">
                <span :class="getClass(scoped.$index) ? 'main' : ''">{{ scoped.row.month4 }}</span>
              </template>
            </el-table-column>
            <el-table-column slot="left" label="5月" width="120" align="right">
              <template slot-scope="scoped">
                <span :class="getClass(scoped.$index) ? 'main' : ''">{{ scoped.row.month5 }}</span>
              </template>
            </el-table-column>
            <el-table-column slot="left" label="6月" width="120" align="right">
              <template slot-scope="scoped">
                <span :class="getClass(scoped.$index) ? 'main' : ''">{{ scoped.row.month6 }}</span>
              </template>
            </el-table-column>
            <el-table-column slot="left" label="7月" width="120" align="right">
              <template slot-scope="scoped">
                <span :class="getClass(scoped.$index) ? 'main' : ''">{{ scoped.row.month7 }}</span>
              </template>
            </el-table-column>
            <el-table-column slot="left" label="8月" width="120" align="right">
              <template slot-scope="scoped">
                <span :class="getClass(scoped.$index) ? 'main' : ''">{{ scoped.row.month8 }}</span>
              </template>
            </el-table-column>
            <el-table-column slot="left" label="9月" width="120" align="right">
              <template slot-scope="scoped">
                <span :class="getClass(scoped.$index) ? 'main' : ''">{{ scoped.row.month9 }}</span>
              </template>
            </el-table-column>
            <el-table-column slot="left" label="10月" width="120" align="right">
              <template slot-scope="scoped">
                <span :class="getClass(scoped.$index) ? 'main' : ''">{{ scoped.row.month10 }}</span>
              </template>
            </el-table-column>
            <el-table-column slot="left" label="11月" width="120" align="right">
              <template slot-scope="scoped">
                <span :class="getClass(scoped.$index) ? 'main' : ''">{{ scoped.row.month11 }}</span>
              </template>
            </el-table-column>
            <el-table-column slot="left" label="12月" width="120" align="right">
              <template slot-scope="scoped">
                <span :class="getClass(scoped.$index) ? 'main' : ''">{{ scoped.row.month12 }}</span>
              </template>
            </el-table-column>
            <el-table-column slot="right" fixed="right" label="总计" width="120" align="right">
              <template slot-scope="scoped">
                <span :class="getClass(scoped.$index) ? 'main' : ''">{{ scoped.row.sum }}</span>
              </template>
            </el-table-column>
          </etm-table>
        </div>
      </etm-layout-split>
    </etm-main-body>
  </div>

</template>

<script>/**
 * index create by Administrator
 * createTime 2020/9/9 9:23
 */

import { exportCashExcel, getFinanceCash } from '@/api/guardcare/digitalReport/cashFlow'
import { parseTime } from '@/utils'
import { downloadFileForUrl } from '@/utils/file'

export default {
  name: 'Index',
  components: {},
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      activeName: 'cash',
      searchForm: [
        {
          label: '年份',
          type: 'date',
          prop: 'date',
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
          }
        }
      ],
      currentYear: new Date(),
      tableData: [],
      column: [],
      rowNum: [],
      incomeNum: 0,
      outcomeNum: 0
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    this.getList()
  },
  methods: {
    handleSearch(value) {
      this.currentYear = value[0].value
      this.getList()
    },
    reset() {
      this.currentYear = new Date()
      this.getList()
    },
    getList() {
      const param = {
        year: parseTime(this.currentYear, '{y}')
      }
      getFinanceCash(param).then(res => {
        const data = res.data
        this.tableData = []
        this.rowNum = []
        this.incomeNum = 0
        this.costNum = 0
        if (data.incomeCashList) {
          this.rowNum.push(data.incomeCashList.length + 1)
          this.incomeNum = data.incomeCashList.length
          data.incomeCashList.forEach(item => {
            const list = JSON.parse(JSON.stringify(item))
            list.cashFlowType = '现金流入(元)'
            this.tableData.push(list)
          })
        }
        if (data.sumIncomeCash) {
          const sumIncomeCash = {
            cashFlowType: '现金流入(元)',
            type: '流入小计(元)',
            name: '流入小计(元)'
          }
          for (const i in data.sumIncomeCash) {
            sumIncomeCash[i] = data.sumIncomeCash[i]
          }
          this.tableData.push(sumIncomeCash)
        }
        if (data.outcomeCashList) {
          this.rowNum.push(data.outcomeCashList.length + 1)
          this.outcomeNum = data.outcomeCashList.length
          data.outcomeCashList.forEach(item => {
            const list = JSON.parse(JSON.stringify(item))
            list.cashFlowType = '现金流出(元)'
            this.tableData.push(list)
          })
        }
        if (data.sumOutComeCash) {
          const sumOutComeCash = {
            cashFlowType: '现金流出(元)',
            type: '流出小计(元)',
            name: '流出小计(元)'
          }
          for (const i in data.sumOutComeCash) {
            sumOutComeCash[i] = data.sumOutComeCash[i]
          }
          this.tableData.push(sumOutComeCash)
        }
        if (data.sumAllCash) {
          this.rowNum.push(1)
          const sumAllCash = {
            cashFlowType: '净现金流(元)',
            type: '净现金流(元)',
            name: '净现金流(元)'
          }
          for (const i in data.sumAllCash) {
            sumAllCash[i] = data.sumAllCash[i]
          }
          this.tableData.push(sumAllCash)
        }
      })
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) { // 表格合并
      if (column.property === 'cashFlowType' && rowIndex !== (this.incomeNum + this.outcomeNum + 2)) {
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
      } else if (rowIndex === this.incomeNum || rowIndex === (this.incomeNum + this.outcomeNum + 1)) {
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
      } else if (rowIndex === (this.incomeNum + this.outcomeNum + 2)) {
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
      if (index === this.incomeNum || index === (this.incomeNum + this.outcomeNum + 1) ||
        index === (this.incomeNum + this.outcomeNum + 2)) {
        return true
      } else {
        return false
      }
    },
    exportExcel() {
      const param = {
        year: parseTime(this.currentYear, '{y}')
      }
      exportCashExcel(param).then(res => {
        downloadFileForUrl(res)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.index-wrap {
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
