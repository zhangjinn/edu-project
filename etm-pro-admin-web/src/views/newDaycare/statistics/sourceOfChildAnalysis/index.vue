<template>
  <div class="sourceOfChildAnalysis-wrap">
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
            :span-method="objectSpanMethod"
            :data="tableData"
            :row-class-name="rowClassNameMethod"
          >
            <etm-table-tool-bar slot="tool">
              <div slot="right">
                <el-button plain @click="exportTableToExcel({ref:$refs.xlsxTable.$el, name:tabPlanLabel})">导出Excel
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
 * createTime 2020/9/16 16:00
 */
import baseMixin from '@/layout/mixin/baseMixin'
import { queryStatisticsChildSource } from '@/api/newDaycare/statistics'

export default {
  name: 'SourceOfChildAnalysis',
  mixins: [baseMixin],
  data() {
    return {
      tabPlanLabel: '学员来源分析',
      searchForm: {
        startTime: null,
        endTime: null
      },
      formData: [{
        label: '录入时间',
        type: 'date',
        value: '',
        prop: 'time',
        props: {
          type: 'daterange',
          startPlaceholder: '年/月',
          endPlaceholder: '年/月'
        }
      }],
      tableData: [],
      colOption: [
        {
          label: '来源类型', align: 'center', prop: 'sourceTypeName', formatter: (row, column, val) => {
            if (!val) {
              return '空'
            } else {
              return val
            }
          }
        },
        {
          label: '学员来源', prop: 'childSourceNmae', formatter: (row, column, val) => {
            if (!val) {
              return '空'
            } else {
              return val
            }
          }
        }, {
          label: '学员总数（人）', prop: 'childTotal'
        }, {
          label: '跟进学员数（人）', prop: 'childFollowUp'
        }, {
          label: '跟进率', prop: 'childFollowUpRate', formatter: (row, column, val, index) => {
            if (index === this.tableData.length - 1 && !row.childFollowUpRate) {
              return '--'
            } else {
              return row.childFollowUpRate + '%'
            }
          }
        }, {
          label: '到访学员数（人）', prop: 'childVisit'
        }, {
          label: '到访率', prop: 'childVisitRate', formatter: (row, column, val, index) => {
            if (index === this.tableData.length - 1 && !row.childVisitRate) {
              return '--'
            } else {
              return row.childVisitRate + '%'
            }
          }
        }, {
          label: '试听学员数（人）', prop: 'auditionChild'
        }, {
          label: '试听率', prop: 'auditionRate', formatter: (row, column, val, index) => {
            if (index === this.tableData.length - 1 && !row.auditionRate) {
              return '--'
            } else {
              return row.auditionRate + '%'
            }
          }
        }, {
          label: '签约学员数（人）', prop: 'signedChild'
        }, {
          label: '签约率', prop: 'childSigningRate', formatter: (row, column, val, index) => {
            if (index === this.tableData.length - 1 && !row.childSigningRate) {
              return '--'
            } else {
              return row.childSigningRate + '%'
            }
          }
        }, {
          label: '签约单数', prop: 'signedOdd'
        }
      ]
    }
  },
  created() {
    this.init()
  },
  methods: {
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return {
          rowspan: row.row,
          colspan: row.col
        }
      } else if (columnIndex === 1 && row.col === 2) {
        return {
          rowspan: 0,
          colspan: 0
        }
      }
    },
    init() {
      queryStatisticsChildSource(this.searchForm).then(res => {
        const result = []
        res.data.forEach((cur, key) => {
          const data = cur.childSourceVOList || []
          data.forEach((c, k) => {
            c.sourceTypeName = cur.sourceTypeName
            c.sourceId = cur.sourceId

            if (res.data.length !== (key + 1)) {
              c.row = k === 0 ? data.length : 0
              c.col = k === 0 ? 1 : 0
            } else {
              c.row = 1
              c.col = 2
            }
            result.push(c)
          })
        })

        this.tableData = result
      })
    },
    rowClassNameMethod({ row, rowIndex }) {
      if (rowIndex === this.tableData.length - 1) {
        return 'row-color'
      }
    },
    handleSearch() {
      const time = this.getValueByProp('time', this.formData) || {}
      this.searchForm.startTime = time[0]
      this.searchForm.endTime = time[1]
      this.init()
    },
    handleReset() {
      this.searchForm = {
        startTime: null,
        endTime: null
      }
      this.init()
    }
  }
}
</script>
<style lang="scss" scoped>
.sourceOfChildAnalysis-wrap {
  & /deep/ .row-color {
    @include etm-color()
  }
}
</style>
