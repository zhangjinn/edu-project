<template>
  <div class="salesmanAnalysis-wrap">
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
              />
            </el-tab-pane>
          </etm-tabs>
        </div>
        <div slot="body">
          <etm-table
            ref="xlsxTable"
            :columns="colOption"
            :data="tableData"
            :row-class-name="rowClassNameMethod"
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
          </etm-table>
        </div>
      </etm-layout-split>
    </etm-main-body>
  </div>
</template>

<script>
/**
 * cashFlow create by shanglu
 * createTime 2020/9/16 18:00
 */
import baseMixin from '@/layout/mixin/baseMixin'
import { queryStatisticsFollow } from '@/api/newDaycare/statistics'

export default {
  name: 'SalesmanAnalysis',
  mixins: [baseMixin],
  data () {
    return {
      tabPlanLabel: '跟进人员业绩分析 ',
      searchForm: {
        name: null,
        startTime: null,
        endTime: null
      },
      formData: [{
        label: '录入时间',
        type: 'date',
        value: null,
        prop: 'time',
        props: {
          type: 'daterange',
          startPlaceholder: '年/月',
          endPlaceholder: '年/月'
        }
      }, {
        label: '员工',
        type: 'input',
        value: null,
        prop: 'name',
        props: {
          placeholder: '请输入员工姓名'
        }
      }],
      tableData: [],
      colOption: [
        {
          label: '员工', prop: 'followUpName'
        }, {
          label: '新签约数（个）', prop: 'numberOfNewContracts', sortable: true, sortBy: 'numberOfNewContracts'
        }, {
          label: '新签约金额（元）', prop: 'newContractAmount', align: 'right', sortable: true, sortBy: 'newContractAmount'
        }, {
          label: '续签数（个）', prop: 'numberOfRenewals', sortable: true, sortBy: 'numberOfRenewals'
        }, {
          label: '续约金额（元）', prop: 'renewalAmount', align: 'right', sortable: true, sortBy: 'renewalAmount'
        }, {
          label: '购买课时', prop: 'purchaseHours', sortable: true, sortBy: 'purchaseHours'
        }, {
          label: '赠送课时', prop: 'freeClassHours', sortable: true, sortBy: 'freeClassHours'
        }, {
          label: '退费数（个）', prop: 'numberOfRefunds', sortable: true, sortBy: 'numberOfRefunds'
        }, {
          label: '退费金额（元）', prop: 'refundAmount', align: 'right', sortable: true, sortBy: 'refundAmount'
        }, {
          label: '退费课时', prop: 'refundOfClassHours', sortable: true, sortBy: 'refundOfClassHours'
        }, {
          label: '电话呼出次数', prop: 'numberOfOutgoingCalls', sortable: true, sortBy: 'numberOfOutgoingCalls'
        }, {
          label: '电话呼出时长',
          prop: 'outgoingCallTime',
          formatter (row) {
            if (row.outgoingCallTime && row.outgoingCallTime !== '--') {
              return row.outgoingCallTime + '秒'
            } else {
              return row.outgoingCallTime
            }
          },
          sortable: true,
          sortBy: 'outgoingCallTime'
        }, {
          label: '短信条数', prop: 'numberOfSMS', sortable: true, sortBy: 'numberOfSMS'
        }, {
          label: '总金额（元）', prop: 'totalAmount', align: 'right', sortable: true, sortBy: 'totalAmount'
        }
      ]
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      queryStatisticsFollow(this.searchForm).then(res => {
        this.tableData = res.data
      })
    },
    rowClassNameMethod ({ rowIndex }) {
      if (rowIndex === this.tableData.length - 1) {
        return 'row-color'
      }
    },
    handleSearch () {
      const time = this.getValueByProp('time', this.formData) || {}
      const name = this.getValueByProp('name', this.formData) || null
      this.searchForm.startTime = time[0] || null
      this.searchForm.endTime = time[1] || null
      this.searchForm.name = name
      this.init()
    },
    handleReset () {
      this.searchForm = {
        name: null,
        startTime: null,
        endTime: null
      }
      this.init()
    },
    formatter (row, column, cellValue) {
      return cellValue
    }
  }
}
</script>
<style lang="scss" scoped>
.salesmanAnalysis-wrap {
  ::v-deep .row-color {
    @include etm-color(); }
}
</style>
