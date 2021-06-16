<template>
  <div class="teachList-wrap">
    <etm-table
      id="xlsxTable"
      v-fixedHead
      :columns="colOption"
      :data="tableData"
    >
      <etm-table-tool-bar slot="tool">
        <div slot="right">
          <el-button
            plain
            @click="exportTableToExcel({id: 'xlsxTable', name:'早教考勤统计'})"
          >
            导出Excel
          </el-button>
        </div>
      </etm-table-tool-bar>
    </etm-table>
  </div>
</template>

<script>
/**
 * teachList create by Administrator
 * createTime 2020/12/11 14:00
 */
import baseMixin from '@/layout/mixin/baseMixin'
// import { parseTime } from '@/utils'
import { queryStatisticsAttendanceReport } from '@/api/newDaycare/statistics'
import { parseTime } from '@/utils'

export default {
  name: 'TeachList',
  components: {},
  filters: {},
  mixins: [baseMixin],
  props: {
    teachSearch: {
      type: Object,
      default: () => {
      }
    }
  },
  data () {
    return {
      colOption: [
        {
          label: '学员姓名',
          prop: 'childName',
          formatter: (row, column, cellValue) => {
            if (!cellValue) {
              return '空'
            } else {
              return cellValue
            }
          }
        }, {
          label: '应到次数', prop: 'shouldNum', sortable: true, sortBy: 'shouldNum'
        }, {
          label: '实到次数', prop: 'actuallyNum', sortable: true, sortBy: 'actuallyNum'
        }, {
          label: '消课课程小计',
          prop: 'totalTimeItemList',
          formatter: (row, column, cellValue) => {
            if (!cellValue) {
              return '空'
            } else {
              let v = ''
              row.totalTimeItemList.forEach(it => {
                if (it.courseName && it.lesson) {
                  v += it.courseName + '：' + it.lesson + '\n'
                }
              })
              return v
            }
          },
          sortable: true,
          sortBy: 'totalTimeItemList'
        }, {
          label: '消课总课时', prop: 'totalTime', sortable: true, sortBy: 'totalTime'
        }, {
          label: '请假次数', prop: 'askNum', sortable: true, sortBy: 'askNum'
        }, {
          label: '缺勤次数', prop: 'absentNum', sortable: true, sortBy: 'absentNum'
        }, {
          label: '出勤率',
          prop: 'probability',
          formatter: (row, column, val, index) => {
            return row.probability + '%'
          },
          sortable: true,
          sortBy: 'probability'
        }
      ],
      tableData: []
    }
  },
  computed: {},
  watch: {
    teachSearch: {
      handler () {
        this.pageInfo.pageNum = 1
        this.init()
        // console.log(this.teachSearch)
      },
      deep: true
    }
  },
  created () {
    // console.log(this.teachSearch)
    this.init()
  },
  mounted () {
  },
  methods: {
    init () {
      queryStatisticsAttendanceReport({
        childName: this.teachSearch.childName || null,
        startDate: (this.teachSearch.time && this.teachSearch.time[0]) || parseTime(new Date(), '{y}-{m}-01'),
        endDate: (this.teachSearch.time && this.teachSearch.time[1]) || parseTime(new Date(), '{y}-{m}-{d}')
      }).then(res => {
        // console.log(res.data)
        this.tableData = res.data
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
