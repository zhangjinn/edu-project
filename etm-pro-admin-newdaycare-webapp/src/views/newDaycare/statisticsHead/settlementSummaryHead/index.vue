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
                <el-form-item label="结算科目：">
                  <el-input
                    v-model="searchForm.settlementItem"
                    placeholder="请输入结算科目"
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
                <!--                <el-button plain @click="exportTableToExcel({ref:$refs.xlsxTable.$el, name:tabPlanLabel})">导出Excel</el-button>-->
                <el-button
                  plain
                  @click="exportExcel"
                >
                  导出Excel
                </el-button>
              </div>
            </etm-table-tool-bar>
            <el-table-column
              slot="left"
              label="园所名称"
              width="210"
            >
              <template slot-scope="scoped">
                <div :class="getClass(scoped.$index) ? 'main textCenter' : ''">
                  {{ scoped.row.organizationName }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              slot="left"
              label="结算科目"
              width="150"
            >
              <template slot-scope="scoped">
                <div :class="getClass(scoped.$index) ? 'main textCenter' : ''">
                  {{ scoped.row.settlementItem }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              slot="left"
              label="结算规则"
              width="360"
            >
              <template slot-scope="scoped">
                <div
                  :class="getClass(scoped.$index) ? 'main textCenter' : ''"
                  v-html="scoped.row.settlementRule"
                />
              </template>
            </el-table-column>
            <el-table-column
              slot="left"
              label="应退总金额（元）"
              align="right"
              prop="toBeSettledAmount"
              sortable
              sort-by="toBeSettledAmount"
            >
              <template slot-scope="scoped">
                <div :class="getClass(scoped.$index) ? 'main' : ''">
                  {{
                    formatMoney(scoped.row.toBeSettledAmount)
                  }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              slot="left"
              label="结算可退总金额（元）"
              align="right"
              prop="actualSettlementAmount"
              sortable
              sort-by="actualSettlementAmount"
            >
              <template slot-scope="scoped">
                <div :class="getClass(scoped.$index) ? 'main' : ''">
                  {{
                    formatMoney(scoped.row.actualSettlementAmount)
                  }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              slot="left"
              label="应消总金额（元）"
              align="right"
              prop="amountPayable"
              sortable
              sort-by="amountPayable"
            >
              <template slot-scope="scoped">
                <div :class="getClass(scoped.$index) ? 'main' : ''">
                  {{ formatMoney(scoped.row.amountPayable) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              slot="right"
              label="实消总金额（元）"
              align="right"
              prop="actualConsumptionAmount"
              sortable
              sort-by="actualConsumptionAmount"
            >
              <template slot-scope="scoped">
                <div :class="getClass(scoped.$index) ? 'main' : ''">
                  {{
                    formatMoney(scoped.row.actualConsumptionAmount)
                  }}
                </div>
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
 * createTime 2021/1/29 11:32
 */
import EtmAreaGardenCascader from '@/views/newDaycare/statisticsHead/component/EtmAreaGardenCascader'
import baseMixin from '@/layout/mixin/baseMixin'
import { parseTime } from '@/utils'
import { querySettlementSummary, querySettlementSummaryExport } from '@/api/newDaycare/statisticsHead'
import { downloadFileForUrl } from '@/utils/file'

export default {
  name: 'Index',
  components: { EtmAreaGardenCascader },
  filters: {},
  mixins: [baseMixin],
  props: {},
  data () {
    return {
      tabPlanLabel: '园所结算统计',
      searchForm: {
        month: parseTime(new Date(), '{y}-{m}-{d}')
      },
      formData: [{
        label: '结算月份',
        type: 'date',
        prop: 'month',
        value: new Date(),
        default: new Date(),
        props: {
          type: 'month',
          placeholder: '请选择月份',
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
    handleSearch (value) {
      value.forEach(item => {
        if (item.prop === 'month') {
          this.searchForm.month = parseTime(item.value, '{y}-{m}-{d}')
        }
      })
      this.init()
    },
    handleReset () {
      this.searchForm = {
        month: parseTime(new Date(), '{y}-{m}-{d}')
      }
      this.clear = !this.clear
    },
    getOrganizationId (value) {
      if (value.value[0]) {
        this.searchForm.areaName = value.value[0]
        if (value.value[1]) {
          this.searchForm.enterpriseId = value.value[1]
        }
      } else {
        this.searchForm.areaName = null
        this.searchForm.enterpriseId = null
      }
      if (value.type === 'load') {
        this.init()
      }
    },
    init () {
      const param = {
        date: this.searchForm.month
      }
      if (this.searchForm.settlementItem) {
        param.settlementItem = this.searchForm.settlementItem
      }
      if (this.searchForm.areaName) {
        param.areaName = this.searchForm.areaName
      }
      if (this.searchForm.enterpriseId) {
        param.enterpriseId = this.searchForm.enterpriseId
      }
      querySettlementSummary(param).then(res => {
        const data = res.data
        const tableData = []
        data.forEach((item, index) => {
          if (index === (data.length - 1)) {
            item.organizationName = '合计'
            item.settlementItem = '合计'
            item.settlementRule = '合计'
          }
          tableData.push(item)
        })
        this.tableData = tableData
      })
    },
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) { // 表格合并
      if (rowIndex === (this.tableData.length - 1)) {
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
    formatMoney (money) {
      if (!isNaN(money)) {
        return money.toFixed(2)
      } else {
        return money
      }
    },
    getClass (index) {
      if (index === (this.tableData.length - 1)) {
        return true
      } else {
        return false
      }
    },
    exportExcel () {
      const param = {
        date: this.searchForm.month
      }
      if (this.searchForm.settlementItem) {
        param.settlementItem = this.searchForm.settlementItem
      }
      if (this.searchForm.areaName) {
        param.areaName = this.searchForm.areaName
      }
      if (this.searchForm.enterpriseId) {
        param.enterpriseId = this.searchForm.enterpriseId
      }
      querySettlementSummaryExport(param).then(res => {
        downloadFileForUrl(res)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.index-wrap {
  .main {
    @include etm-color();
  }

  .textCenter {
    text-align: center;
  }
}
</style>
