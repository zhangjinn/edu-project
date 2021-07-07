<template>
  <div class="usedCourseTeacher-wrap">
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
            :data="tableData"
            :stripe="false"
            :row-class-name="rowClassNameMethod"
            :span-method="objectSpanMethod"
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
 * createTime 2020/9/17 9:00
 */
import baseMixin from '@/layout/mixin/baseMixin'
import { queryTeacherConsumeCourseReport } from '@/api/newDaycare/statistics'

export default {
  name: 'UsedCourseTeacher',
  mixins: [baseMixin],
  data() {
    return {
      tabPlanLabel: '老师消课统计',
      searchForm: {
        teacherType: null,
        teacherName: null,
        startDate: null,
        endDate: null
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
        prop: 'teacherType',
        value: '',
        default: '',
        options: [
          { label: '上课老师', value: 'CLASS_TEACHER' },
          { label: '助教老师', value: 'HELP_TEACHER' }
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
          label: '课程类型', prop: 'courseTypeName'
        }, {
          label: '业务类型', prop: 'businessType'
        }, {
          label: '消课课时', prop: 'consumeLesson'
        }, {
          label: '消课课时小计', prop: 'consumeLessonByTeacherType'
        }, {
          label: '消课总课时', prop: 'consumeLessonByTeacher'
        }, {
          label: '消课金额（元）', prop: 'consumeAmount', align: 'right'
        }, {
          label: '消课金额小计（元）', prop: 'consumeAmountByTeacherType', align: 'right'
        }, {
          label: '消课总金额（元）', prop: 'consumeAmountByTeacher', align: 'right'
        }
      ]
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      const result = Object.assign({
        teacherType: null,
        teacherName: null,
        startDate: null,
        endDate: null
      }, this.searchForm)
      queryTeacherConsumeCourseReport(result).then(res => {
        let outerCount = 0
        // let innerCount = 0
        const content = []
        res.data.forEach(it => {
          const order = []
          const sortOrder = []
          it.dataList.forEach((it) => {
            if (sortOrder.includes(it.teacherType)) {
              const i = sortOrder.findIndex(v => v === it.teacherType)
              order[i] += 1
            } else {
              order.push(1)
              sortOrder.push(it.teacherType)
            }
          })
          const arr = order.map(v => v)
          arr.reduce((acc, cur, idx) => {
            const count = acc + cur
            order[idx] = count
            return count
          })
          // 排序
          it.dataList = it.dataList.sort((a, b) => {
            return sortOrder.indexOf(a.teacherType) - sortOrder.indexOf(b.teacherType)
          })
          it.dataList.forEach((v, idx) => {
            const i = sortOrder.findIndex(j => v.teacherType === j)
            if (idx === 0) {
              v.innerStartCount = outerCount
            } else {
              v.innerStartCount = order[i - 1] + outerCount
            }
            v.innerEndCount = order[i] + outerCount
            v.outerStartCount = outerCount
            v.outerEndCount = it.dataList.length + outerCount
            content.push(v)
            return v
          })
          outerCount += it.dataList.length
        })
        this.tableData = content
      })
    },
    rowClassNameMethod({ rowIndex }) {
      if (rowIndex === this.tableData.length - 1) {
        return 'row-color'
      }
    },
    objectSpanMethod({ row, rowIndex, columnIndex }) {
      if (rowIndex === this.tableData.length - 1) {
        if (columnIndex === 0) {
          return {
            rowspan: 1,
            colspan: 4
          }
        } else if (columnIndex === 4) {
          return {
            rowspan: 1,
            colspan: 3
          }
        } else if (columnIndex === 7) {
          return {
            rowspan: 1,
            colspan: 3
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      } else {
        if (columnIndex === 0 || columnIndex === 6 || columnIndex === 9) {
          if (rowIndex === row.outerStartCount) {
            return {
              rowspan: row.outerEndCount - row.outerStartCount,
              colspan: 1
            }
          } else if (rowIndex <= row.outerEndCount) {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        } else if (columnIndex === 1 || columnIndex === 5 || columnIndex === 8) {
          if (rowIndex === row.innerStartCount) {
            return {
              rowspan: row.innerEndCount - row.innerStartCount,
              colspan: 1
            }
          } else if (rowIndex <= row.innerEndCount) {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
      }
    },
    handleSearch() {
      const date = this.getValueByProp('date', this.formData) || {}
      const teacherType = this.getValueByProp('teacherType', this.formData) || null
      const teacherName = this.getValueByProp('teacherName', this.formData) || null
      this.searchForm.startDate = date[0]
      this.searchForm.endDate = date[1]
      this.searchForm.teacherType = teacherType
      this.searchForm.teacherName = teacherName
      this.init()
    },
    handleReset() {
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
.usedCourseTeacher-wrap {
  & /deep/ .row-color {
    @include etm-color()
  }
}
</style>
