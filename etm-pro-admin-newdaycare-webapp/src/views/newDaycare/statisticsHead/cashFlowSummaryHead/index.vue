<template>
  <div class="index-wrap">
    <etm-main-body>
      <etm-layout-split>
        <div slot="header">
          <etm-tabs>
            <el-tab-pane :label="tabPlanLabel">
              <etm-tool-bar
                v-show="true"
                v-model="formData"
                @search="handleSearch"
                @reset="handleReset"
              >
                <el-form-item label="园所：">
                  <etm-area-garden-cascader
                    :clear="clear"
                    @change="getOrganizationId"
                  />
                </el-form-item>
              </etm-tool-bar>
            </el-tab-pane>
          </etm-tabs>
        </div>
        <div slot="body">
          <etm-table
            ref="xlsxTable"
            v-fixedHead
            :columns="colOption"
            :data="tableData"
            :span-method="objectSpanMethod"
          >
            <etm-table-tool-bar slot="tool">
              <div slot="right">
                <el-button
                  plain
                  @click="exportTableToExcel({ref:$refs.xlsxTable.$el, name:tabPlanLabel})"
                >
                  导出Excel
                </el-button>
              </div>
            </etm-table-tool-bar>
            <el-table-column
              slot="left"
              fixed="left"
              label="园所名称"
              width="180"
              prop="enterpriseName"
            >
              <template slot-scope="scoped">
                <div>{{ scoped.row.enterpriseName }}</div>
              </template>
            </el-table-column>
            <el-table-column
              slot="left"
              fixed="left"
              label="流向"
              width="120"
            >
              <template slot-scope="scoped">
                <span>{{ scoped.row.incomeOrExpensesName }}</span>
              </template>
            </el-table-column>
            <el-table-column
              slot="left"
              label="1月"
              width="120"
              align="right"
              sortable
              prop="jan"
              sort-by="jan"
            >
              <template slot-scope="scoped">
                <span>{{ formatMoney(scoped.row.jan) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              slot="left"
              label="2月"
              width="120"
              align="right"
              sortable
              prop="feb"
              sort-by="feb"
            >
              <template slot-scope="scoped">
                <span>{{ formatMoney(scoped.row.feb) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              slot="left"
              label="3月"
              width="120"
              align="right"
              sortable
              prop="mar"
              sort-by="mar"
            >
              <template slot-scope="scoped">
                <span>{{ formatMoney(scoped.row.mar) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              slot="left"
              label="4月"
              width="120"
              align="right"
              sortable
              prop="apr"
              sort-by="apr"
            >
              <template slot-scope="scoped">
                <span>{{ formatMoney(scoped.row.apr) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              slot="left"
              label="5月"
              width="120"
              align="right"
              sortable
              prop="may"
              sort-by="may"
            >
              <template slot-scope="scoped">
                <span>{{ formatMoney(scoped.row.may) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              slot="left"
              label="6月"
              width="120"
              align="right"
              sortable
              prop="jun"
              sort-by="jun"
            >
              <template slot-scope="scoped">
                <span>{{ formatMoney(scoped.row.june) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              slot="left"
              label="7月"
              width="120"
              align="right"
              sortable
              prop="jul"
              sort-by="jul"
            >
              <template slot-scope="scoped">
                <span>{{ formatMoney(scoped.row.july) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              slot="left"
              label="8月"
              width="120"
              align="right"
              sortable
              prop="aug"
              sort-by="aug"
            >
              <template slot-scope="scoped">
                <span>{{ formatMoney(scoped.row.aug) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              slot="left"
              label="9月"
              width="120"
              align="right"
              sortable
              prop="sep"
              sort-by="sep"
            >
              <template slot-scope="scoped">
                <span>{{ formatMoney(scoped.row.sept) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              slot="left"
              label="10月"
              width="120"
              align="right"
              sortable
              prop="oct"
              sort-by="oct"
            >
              <template slot-scope="scoped">
                <span>{{ formatMoney(scoped.row.oct) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              slot="left"
              label="11月"
              width="120"
              align="right"
              sortable
              prop="nov"
              sort-by="nov"
            >
              <template slot-scope="scoped">
                <span>{{ formatMoney(scoped.row.nov) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              slot="left"
              label="12月"
              width="120"
              align="right"
              sortable
              prop="dec"
              sort-by="dec"
            >
              <template slot-scope="scoped">
                <span>{{ formatMoney(scoped.row.dece) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              slot="right"
              fixed="right"
              label="总计"
              width="120"
              align="right"
              sortable
              prop="total"
              sort-by="total"
            >
              <template slot-scope="scoped">
                <span class="main">{{ formatMoney(scoped.row.total) }}</span>
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
 * index create by Administrator
 * createTime 2021/1/28 17:09
 */
import EtmAreaGardenCascader from '@/views/newDaycare/statisticsHead/component/EtmAreaGardenCascader'
import baseMixin from '@/layout/mixin/baseMixin'
import { queryCashFlowStatistics } from '@/api/newDaycare/statisticsHead'

export default {
  name: 'Index',
  components: { EtmAreaGardenCascader },
  filters: {},
  mixins: [baseMixin],
  props: {},
  data () {
    return {
      tabPlanLabel: '现金流量表',
      searchForm: {
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
            disabledDate (time) {
              return time.getTime() > new Date().getTime()
            }
          }
        }
      }],
      tableData: [],
      colOption: [],
      clear: false
    }
  },
  computed: {},
  watch: {},
  created () {
  },
  mounted () {
  },
  methods: {
    getOrganizationId (value) {
      this.searchForm.currentEnterpriseId = value.value[1]
      if (value.type === 'load') {
        this.init()
      }
    },
    init () {
      queryCashFlowStatistics(this.searchForm).then(res => {
        const data = res.data
        const tableData = []
        data.forEach(item => {
          for (let i = 0; i < item.monthlyStatisticsAmountVOList.length; i++) {
            if (item.monthlyStatisticsAmountVOList[i].incomeOrExpensesType === 'INCOME') {
              const itemData = {
                enterpriseName: item.enterpriseName,
                incomeOrExpensesName: '现金流入'
              }
              for (const n in item.monthlyStatisticsAmountVOList[i]) {
                itemData[n] = item.monthlyStatisticsAmountVOList[i][n]
              }
              tableData.push(itemData)
            } else if (item.monthlyStatisticsAmountVOList[i].incomeOrExpensesType === 'EXPENDITURE') {
              const itemData = {
                enterpriseName: item.enterpriseName,
                incomeOrExpensesName: '现金流出'
              }
              for (const n in item.monthlyStatisticsAmountVOList[i]) {
                itemData[n] = item.monthlyStatisticsAmountVOList[i][n]
              }
              tableData.push(itemData)
            }
          }
        })
        this.tableData = tableData
      })
    },
    handleSearch () {
      let year = this.formData[0].value || ''
      if (typeof year === 'string') {
        year = this.formData[0].value.slice(0, 4)
      } else if (typeof year === 'object') {
        year = this.formData[0].value.getFullYear()
      }
      this.searchForm.year = year
      this.init()
    },
    handleReset () {
      this.searchForm = {
        year: new Date().getFullYear()
      }
      this.clear = !this.clear
    },
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) { // 表格合并
      if (column.property === 'enterpriseName') {
        if (rowIndex % 2 === 0) {
          return {
            rowspan: 2,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    formatter (row, column, cellValue, index) {
      return cellValue
    },
    formatMoney (money) {
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
.index-wrap {
  .main {
    @include etm-color();
  }
}
</style>
