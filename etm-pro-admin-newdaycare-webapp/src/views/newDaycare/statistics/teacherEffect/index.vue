<template>
  <div class="teacherEffect-wrap">
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
            :span-method="objectSpanMethod"
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
 * createTime 2020/9/17 9:00
 */
import baseMixin from '@/layout/mixin/baseMixin'
import { getStartDateAndEndDateByMonth } from '@/utils/date'
import { queryTeacherEffectReport } from '@/api/newDaycare/statistics'

export default {
  name: 'TeacherEffect',
  mixins: [baseMixin],
  data () {
    return {
      tabPlanLabel: '老师人效分析',
      searchForm: {
        type: null,
        teacherName: null,
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
      }, {
        label: '老师类型',
        type: 'select',
        prop: 'type',
        value: '',
        default: '',
        options: [
          { label: '早教', value: 'TEACH' },
          { label: '托育', value: 'CARE' }
        ],
        props: {
          placeholder: '请选择老师类型',
          clearable: true,
          filterable: true
        }
      }, {
        label: '老师姓名',
        type: 'input',
        value: '',
        prop: 'teacherName',
        props: {
          placeholder: '请输入老师姓名'
        }
      }],
      tableData: [],
      colOption: [
        {
          label: '老师姓名', prop: 'teacherName'
        }, {
          label: '老师类型', prop: 'teacherType'
        }, {
          label: '排课节数', prop: 'courseManagementAmount', sortable: true, sortBy: 'courseManagementAmount'
        }, {
          label: '学员约课次数', prop: 'formalChildAppointmentTimes', sortable: true, sortBy: 'formalChildAppointmentTimes'
        }, {
          label: '学员约课课时', prop: 'formalChildAppointmentLesson', sortable: true, sortBy: 'formalChildAppointmentLesson'
        }, {
          label: '学员签到次数', prop: 'formalChildAttendTimes', sortable: true, sortBy: 'formalChildAttendTimes'
        }, {
          label: '学员消课课时', prop: 'formalChildConsumeCourseLesson', sortable: true, sortBy: 'formalChildConsumeCourseLesson'
        }, {
          label: '试听约课次数', prop: 'expChildAppointmentTimes', sortable: true, sortBy: 'expChildAppointmentTimes'
        }, {
          label: '试听签到次数', prop: 'expChildAttendTimes', sortable: true, sortBy: 'expChildAttendTimes'
        }, {
          label: '试听签单数', prop: 'expChildContractNum', sortable: true, sortBy: 'expChildContractNum'
        }, {
          label: '签单率',
          prop: 'expChildSignRate',
          formatter: (row, column, val, index) => {
            if (index === this.tableData.length - 1 && !row.expChildSignRate) {
              return '--'
            } else {
              return row.expChildSignRate + '%'
            }
          },
          sortable: true,
          sortBy: 'expChildSignRate'
        }, {
          label: '请假人次', prop: 'childLeaveNum', sortable: true, sortBy: 'childLeaveNum'
        }
      ],
      spanCount: []
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      const result = Object.assign({
        type: null,
        teacherName: null,
        startDate: null,
        endDate: null
      }, this.searchForm)
      queryTeacherEffectReport(result).then(res => {
        let count = 0
        const content = []
        res.data.forEach(it => {
          it.dataList.forEach(v => {
            v.startCount = count
            v.endCount = it.dataList.length + count
            content.push(v)
          })
          count += it.dataList.length
        })
        this.tableData = content
        // console.log(this.tableData)
      })
    },
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex === this.tableData.length - 1) {
          return {
            rowspan: 1,
            colspan: 2
          }
        } else if (rowIndex === row.startCount) {
          return {
            rowspan: row.endCount - row.startCount,
            colspan: 1
          }
        } else if (rowIndex <= row.endCount) {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      } else if (columnIndex === 1 && rowIndex === this.tableData.length - 1) {
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
      const teacherName = this.getValueByProp('teacherName', this.formData) || null
      this.searchForm.startDate = date[0]
      this.searchForm.endDate = date[1]
      this.searchForm.type = type
      this.searchForm.teacherName = teacherName
      this.init()
    },
    handleReset () {
      this.searchForm = {
        type: null,
        teacherName: null,
        startDate: null,
        endDate: null
      }
      this.init()
    }
  }
}
</script>
<style lang="scss" scoped>
.teacherEffect-wrap {
  ::v-deep .row-color {
    @include etm-color();
  }
}
</style>
