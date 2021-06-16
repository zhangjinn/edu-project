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
                    :has-default="true"
                    @change="getOrganizationId"
                  />
                </el-form-item>
                <el-form-item label="幼儿姓名：">
                  <el-input
                    v-model="searchForm.childName"
                    placeholder="请输入幼儿姓名"
                  />
                </el-form-item>
                <el-form-item label="状态：">
                  <el-select v-model="searchForm.status">
                    <el-option
                      label="在园"
                      value="IN"
                    />
                    <el-option
                      label="退园"
                      value="OUT"
                    />
                  </el-select>
                </el-form-item>
              </etm-tool-bar>
            </el-tab-pane>
          </etm-tabs>
        </div>
        <div slot="body">
          <etm-table
            ref="xlsxTable"
            v-fixedHead
            :stripe="false"
            :columns="colOption"
            :data="tableData"
            :span-method="objectSpanMethod"
            :cell-class-name="cellClassNameMethod"
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
              label="幼儿姓名"
              prop="childName"
              width="120"
            >
              <template slot-scope="scoped">
                <div :class="getClass(scoped.$index) ? 'main textCenter' : ''">
                  {{ scoped.row.childName }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              slot="left"
              label="所在园所"
              prop="organizationName"
              width="120"
            >
              <template slot-scope="scoped">
                <div :class="getClass(scoped.$index) ? 'main textCenter' : ''">
                  {{ scoped.row.organizationName }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              slot="left"
              label="班级"
              prop="clazzName"
              width="120"
            >
              <template slot-scope="scoped">
                <div :class="getClass(scoped.$index) ? 'main textCenter' : ''">
                  {{ scoped.row.clazzName }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              slot="left"
              label="状态"
              prop="status"
              width="120"
            >
              <template slot-scope="scoped">
                <div :class="getClass(scoped.$index) ? 'main textCenter' : ''">
                  <etm-status :type="scoped.row.status==='IN' ? 'active' : 'inactive'">
                    {{ transferStatus(scoped.row.status) }}
                  </etm-status>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              slot="left"
              label="应出勤（天）"
              prop="shouldArriveDays"
              width="120"
              sortable
              sort-by="shouldArriveDays"
            >
              <template slot-scope="scoped">
                <div :class="getClass(scoped.$index) ? 'main textCenter' : ''">
                  {{ scoped.row.shouldArriveDays }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              slot="left"
              label="已出勤（天）"
              prop="arrivedDays"
              width="120"
              sortable
              sort-by="arrivedDays"
            >
              <template slot-scope="scoped">
                <div :class="getClass(scoped.$index) ? 'main textCenter' : ''">
                  {{ scoped.row.arrivedDays }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              slot="left"
              label="缺勤（天）"
              prop="absenceDays"
              width="120"
              sortable
              sort-by="absenceDays"
            >
              <template slot-scope="scoped">
                <div :class="getClass(scoped.$index) ? 'main textCenter' : ''">
                  {{ scoped.row.absenceDays }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              slot="left"
              label="请假（天）"
              prop="requestForLeaveDays"
              width="120"
              sortable
              sort-by="requestForLeaveDays"
            >
              <template slot-scope="scoped">
                <div :class="getClass(scoped.$index) ? 'main textCenter' : ''">
                  {{
                    scoped.row.requestForLeaveDays
                  }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              slot="left"
              label="结算科目"
              prop="settlementItem"
              width="120"
            >
              <template slot-scope="scoped">
                <div :class="getClass(scoped.$index) ? 'main textCenter' : ''">
                  {{ scoped.row.settlementItem }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              slot="left"
              label="预收金额（元）"
              prop="balance"
              align="right"
              width="150"
              sortable
              sort-by="balance"
            >
              <template slot-scope="scoped">
                <div :class="getClass(scoped.$index) ? 'main' : ''">
                  {{ formatMoney(scoped.row.balance) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              slot="left"
              label="结算规则"
              prop="settlementRule"
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
              label="应退金额（元）"
              prop="toBeSettledAmount"
              align="right"
              width="150"
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
              label="结算可退金额（元）"
              prop="actualSettlementAmount"
              align="right"
              width="180"
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
              label="应消金额（元）"
              prop="amountPayable"
              align="right"
              width="150"
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
              label="实消金额（元）"
              prop="actualConsumptionAmount"
              align="right"
              width="150"
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
 * createTime 2021/1/29 10:59
 */
import EtmAreaGardenCascader from '@/views/newDaycare/statisticsHead/component/EtmAreaGardenCascader'
import baseMixin from '@/layout/mixin/baseMixin'
import { parseTime } from '@/utils'
import {
  querySettlementStatistics,
  querySettlementStatisticsExport
} from '@/api/newDaycare/statisticsHead'
import { downloadFileForUrl } from '@/utils/file'

export default {
  name: 'Index',
  components: { EtmAreaGardenCascader },
  filters: {},
  mixins: [baseMixin],
  props: {},
  data () {
    return {
      tabPlanLabel: '幼儿结算明细',
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
      rowNum: [],
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
    cellClassNameMethod ({ row, columnIndex }) {
      if (columnIndex === 3) { // 状态栏
        if (row.statusText === '在园') {
          return 'enabled'
        }
        if (row.statusText === '离园') {
          return 'disabled'
        }
      }
    },
    getOrganizationId (value) {
      this.searchForm.enterpriseId = value.value[1]
      if (value.type === 'load') {
        this.init()
      }
    },
    init () {
      const param = {
        date: this.searchForm.month,
        enterpriseId: this.searchForm.enterpriseId
      }
      if (this.searchForm.childName) {
        param.childName = this.searchForm.childName
      }
      if (this.searchForm.status) {
        param.status = this.searchForm.status
      }
      querySettlementStatistics(param).then(res => {
        const data = res.data
        const tableData = []
        this.rowNum = []
        data.forEach((item, index) => {
          if (item.data.length) {
            this.rowNum.push(item.data.length)
            item.data.forEach(child => {
              const itemData = JSON.parse(JSON.stringify(item))
              for (const i in child) {
                itemData[i] = child[i]
              }
              if (index === (data.length - 1)) {
                itemData.childName = '汇总'
                itemData.shouldArriveDays = '汇总'
                itemData.arrivedDays = '汇总'
                itemData.absenceDays = '汇总'
                itemData.requestForLeaveDays = '汇总'
                itemData.clazzName = '汇总'
                itemData.organizationName = '汇总'
                itemData.status = '汇总'
                item.settlementItem = '汇总'
              }
              tableData.push(itemData)
            })
          } else {
            this.rowNum.push(1)
            const itemData = JSON.parse(JSON.stringify(item))
            itemData.settlementItem = null
            itemData.balance = null
            itemData.settlementRule = null
            itemData.toBeSettledAmount = null
            itemData.actualSettlementAmount = null
            itemData.amountPayable = null
            itemData.actualConsumptionAmount = null
            tableData.push(itemData)
          }
        })
        this.tableData = tableData
      })
    },
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) { // 表格合并
      if (rowIndex === (this.tableData.length - 1)) {
        if (columnIndex === 1) {
          return {
            rowspan: 1,
            colspan: 9
          }
        } else if (columnIndex < 9) {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      } else if (this.judgeColumnType(column.property)) {
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
      }
    },
    judgeColumnType (type) { // 判断行是否合并
      if (type === 'childName' || type === 'organizationName' || type === 'clazzName' || type === 'status' ||
        type === 'shouldArriveDays' || type === 'arrivedDays' || type === 'absenceDays' || type === 'requestForLeaveDays') {
        return true
      } else {
        return false
      }
    },
    addNum (index) { // 数组前index+1项之和
      if (index < 0) return 0
      let num = 0
      this.rowNum.forEach((item, ind) => {
        if (ind <= index) {
          num += item
        }
      })
      return num
    },
    formatMoney (money) {
      if (!isNaN(money)) {
        return money.toFixed(2)
      } else {
        return money
      }
    },
    transferStatus (status) {
      // PENDING_REVIEW :待入园 IN :在园 OUT :离园 DELETED :已删除
      switch (status) {
        case 'PENDING_REVIEW':
          return '待入园'
        case 'IN':
          return '在园'
        case 'OUT':
          return '离园'
        case 'DELETED':
          return '已删除'
        default:
          return status
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
        date: this.searchForm.month,
        enterpriseId: this.searchForm.enterpriseId
      }
      if (this.searchForm.childName) {
        param.childName = this.searchForm.childName
      }
      if (this.searchForm.status) {
        param.status = this.searchForm.status
      }
      querySettlementStatisticsExport(param).then(res => {
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

  ::v-deep .el-table {
    .enabled {
      @include etm-color();
    }

    .disabled {
      color: #999;
    }
  }
}
</style>
