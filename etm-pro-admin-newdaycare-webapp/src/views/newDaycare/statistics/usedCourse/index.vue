<template>
  <div class="usedCourse-wrap">
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
            :row-class-name="rowClassNameMethod"
            :span-method="objectSpanMethod"
            :data="tableData"
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
 * createTime 2020/9/17 9:00
 */
import baseMixin from '@/layout/mixin/baseMixin'
import { queryConsumeCourseReport } from '@/api/newDaycare/statistics'
import { getStartDateAndEndDateByMonth } from '@/utils/date'

export default {
  name: 'UsedCourse',
  mixins: [baseMixin],
  data () {
    return {
      tabPlanLabel: '课程消课统计',
      searchForm: {
        type: '',
        startDate: getStartDateAndEndDateByMonth().startDate,
        endDate: getStartDateAndEndDateByMonth().endDate
      },
      formData: [{
        label: '上课日期',
        type: 'date',
        value: '',
        prop: 'date',
        props: {
          type: 'daterange',
          startPlaceholder: '年/月',
          endPlaceholder: '年/月'
        }
      }
      //   {
      //   label: '业务类型',
      //   type: 'select',
      //   prop: 'type',
      //   value: '',
      //   default: '',
      //   options: [
      //     { label: '早教', value: 'TEACH' },
      //     { label: '托育', value: 'CARE' }
      //   ],
      //   props: {
      //     placeholder: '请选择业务类型',
      //     clearable: true,
      //     filterable: true
      //   }
      // }
      ],
      tableData: [],
      colOption: [
        {
          label: '课程名称', prop: 'courseName'
        }, {
          label: '课程类型', prop: 'courseTypeName'
        }, {
          label: '业务类型', prop: 'teachOrCare'
        }, {
          label: '开课节数', prop: 'courseManagementAmount', sortable: true, sortBy: 'courseManagementAmount'
        }, {
          label: '试听学员数', prop: 'expChildNum', sortable: true, sortBy: 'expChildNum'
        }, {
          label: '正式学员数', prop: 'formalChildNum', sortable: true, sortBy: 'formalChildNum'
        }, {
          label: '正式学员实到人次', prop: 'actualAttendFormTimes', sortable: true, sortBy: 'actualAttendFormTimes'
        }, {
          label: '预约试听人次', prop: 'reservationExpTimes', sortable: true, sortBy: 'reservationExpTimes'
        }, {
          label: '试听实到人次', prop: 'actualAttendExpTimes', sortable: true, sortBy: 'actualAttendExpTimes'
        }
      ]
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      const result = Object.assign({
        type: '',
        startDate: '',
        endDate: ''
      }, this.searchForm)
      queryConsumeCourseReport(result).then(res => {
        this.tableData = res.data
      })
    },
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        // console.log(this.tableData.length)
        if (rowIndex === this.tableData.length - 1) {
          return {
            rowspan: 1,
            colspan: 3
          }
        }
      } else if ((columnIndex === 1 || columnIndex === 2) && rowIndex === this.tableData.length - 1) {
        return {
          rowspan: 0,
          colspan: 0
        }
      }
    },
    rowClassNameMethod ({ row, rowIndex }) {
      if (rowIndex === this.tableData.length - 1) {
        return 'row-color'
      }
    },
    handleSearch () {
      const date = this.getValueByProp('date', this.formData) || {}
      const type = this.getValueByProp('type', this.formData) || null
      this.searchForm.startDate = date[0]
      this.searchForm.endDate = date[1]
      this.searchForm.type = type
      this.init()
    },
    handleReset () {
      this.searchForm = {}
      this.init()
    }
  }
}
</script>
<style lang="scss" scoped>
.usedCourse-wrap {
  ::v-deep .row-color {
    @include etm-color();
  }
}
</style>
