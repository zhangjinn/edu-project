<template>
  <div class="attendanceStatistics-wrap">
    <etm-main-body>
      <etm-layout-split>
        <div slot="header">
          <etm-tabs
            ref="tabs"
            v-model="activeName"
          >
            <el-tab-pane
              v-if="hasAuth('newdaycare.attendanceStatisticsTeach.queryBatch', 'tabs', 'activeName')"
              label="早教考勤统计"
              name="teach"
            >
              <etm-tool-bar
                v-show="true"
                v-model="teach"
                @search="handleSearch"
              />
            </el-tab-pane>
            <el-tab-pane
              v-if="hasAuth('newdaycare.attendanceStatisticsCare.queryBatch', 'tabs', 'activeName')"
              label="托育考勤统计"
              name="care"
            >
              <etm-tool-bar
                v-show="true"
                v-model="care"
                @search="handleSearch2"
              />
            </el-tab-pane>
            <el-tab-pane
              v-if="hasAuth('newdaycare.attendanceStatisticsClazzGuard.query', 'tabs', 'activeName')"
              label="幼儿园班级考勤"
              name="clazz"
            >
              <etm-tool-bar
                v-model="clazzFilters"
                @search="confirmQuery"
                @reset="resetQuery"
              >
                日期:
                <el-date-picker
                  v-show="activeName === 'clazz'"
                  v-model="queryTime"
                  type="date"
                  placeholder="选择日期"
                  :clearable="false"
                  :style="{ margin: '0 24px 0 6px'}"
                />
              </etm-tool-bar>
            </el-tab-pane>
            <el-tab-pane
              v-if="hasAuth('newdaycare.attendanceStatisticsGuard.queryBatch', 'tabs', 'activeName')"
              label="幼儿园考勤统计"
              name="child"
            >
              <etm-tool-bar
                v-model="childFilters"
                @search="confirmQuery"
                @reset="resetQuery"
              >
                日期:
                <el-date-picker
                  v-show="activeName === 'child'"
                  v-model="queryTime"
                  type="month"
                  placeholder="选择日期"
                  :clearable="false"
                  :style="{ margin: '0 24px 0 6px'}"
                />
              </etm-tool-bar>
            </el-tab-pane>
          </etm-tabs>
        </div>
        <div slot="body">
          <teach-list
            v-if="activeName==='teach'"
            :teach-search="teachSearch"
          />
          <care-List
            v-if="activeName==='care'"
            :care-search="careSearch"
          />
          <etm-table-tool-bar slot="tool">
            <template v-if="activeName === 'clazz'">
              <el-button
                slot="right"
                plain
                @click.stop="exportToExcel"
              >
                导出Excel
              </el-button>
            </template>
            <template v-if="activeName === 'child'">
              <el-button
                slot="right"
                plain
                @click.stop="exportToExcel"
              >
                导出Excel
              </el-button>
            </template>
          </etm-table-tool-bar>
          <etm-table-page
            v-if="activeName === 'child' || activeName === 'clazz'"
            :data="tableData"
            @currentChange="currentChange"
          >
            <el-table-column
              v-for="column in columns"
              :key="column.prop"
              slot="left"
              v-bind="column"
            >
              <template slot-scope="scope">
                <a
                  v-if="column._link"
                  @click.stop="showDetail(column, scope)"
                >{{ scope.row[column.prop] }}</a>
                <span v-else>{{ scope.row[column.prop] }}</span>
              </template>
            </el-table-column>
          </etm-table-page>
        </div>
      </etm-layout-split>
      <etm-drawer
        :visible.sync="showDrawer"
        type="big"
        @close="showDrawer = false"
      >
        <detail
          :child-id="childId"
          :drawer-page="drawerType"
          @finish="finishDrawer"
          @change="changeType"
          @close="showDrawer = false"
        />
      </etm-drawer>
    </etm-main-body>
  </div>
</template>

<script>
/**
 * cashFlow create by shanglu
 * createTime 2020/9/17 9:00
 */
import baseMixin from '@/layout/mixin/baseMixin'
import { parseTime } from '@/utils'
// import { queryStatisticsAttendanceReport } from '@/api/daycare/statistics'
import teachList from '@/views/newDaycare/statistics/attendanceStatistics/teachList'
import careList from '@/views/newDaycare/statistics/attendanceStatistics/careList'
import {
  queryClazzAttendanceStatisticsList,
  queryChildAttendanceStatisticsList,
  queryClazzList,
  queryGradeList,
  exportClazzAttendanceStatisticsToExcel,
  exportChildAttendanceStatisticsToExcel
} from '@/api/newDaycare/statistics'
import transferDate from '@/utils/date'
import { downloadFileForUrl } from '@/utils/file'
import detail from '@/views/newDaycare/childManageGuard/component/childDetail'

const columnsList = {
  clazz: [
    { label: '年级', prop: 'gradeName' },
    { label: '班级', prop: 'clazzName' },
    { label: '应出勤人数', prop: 'shouldArriveNumber', sortable: true, sortBy: 'shouldArriveNumber' },
    { label: '实际出勤人数', prop: 'arrivedNumber', sortable: true, sortBy: 'arrivedNumber' },
    { label: '请假人数', prop: 'requestForLeaveNumber', sortable: true, sortBy: 'requestForLeaveNumber' },
    { label: '缺勤人数', prop: 'absenceNumber', sortable: true, sortBy: 'absenceNumber' },
    { label: '出勤率', prop: 'rateOfAttendance', sortable: true, sortBy: 'rateOfAttendance' }
  ],
  child: [
    { label: '幼儿姓名', prop: 'childName', _link: true },
    { label: '应出勤天数', prop: 'shouldArriveNumber', sortable: true, sortBy: 'shouldArriveNumber' },
    { label: '实际出勤天数', prop: 'arrivedNumber', sortable: true, sortBy: 'arrivedNumber' },
    { label: '请假天数', prop: 'requestForLeaveNumber', sortable: true, sortBy: 'requestForLeave' },
    { label: '缺勤天数', prop: 'absenceNumber', sortable: true, sortBy: 'absenceNumber' },
    { label: '出勤率', prop: 'rateOfAttendance', sortable: true, sortBy: 'rateOfAttendance' }
  ]
}

export default {
  name: 'AttendanceStatistics',
  components: { teachList, careList, detail },
  mixins: [baseMixin],
  data () {
    const _self = this
    return {
      tabPlanLabel: '考勤统计',
      activeName: 'teach',
      care: [
        {
          label: '统计日期',
          type: 'date',
          value: '',
          prop: 'time',
          default: parseTime(new Date(), '{y}-{m}'),
          props: {
            type: 'month',
            placeholder: '年/月',
            clearable: false
          }
        },
        {
          label: '学员姓名',
          type: 'input',
          prop: 'childName',
          value: '',
          props: {
            placeholder: '请输入学员姓名'
          }
        }
      ],
      teach: [
        {
          label: '上课日期',
          type: 'date',
          value: '',
          prop: 'time',
          default: [parseTime(new Date(), '{y}-{m}-01'), parseTime(new Date(), '{y}-{m}-{d}')],
          props: {
            type: 'daterange',
            startPlaceholder: '年/月',
            endPlaceholder: '年/月'
          }
        },
        {
          label: '学员姓名',
          type: 'input',
          prop: 'childName',
          value: '',
          props: {
            placeholder: '请输入学员姓名'
          }
        }
      ],
      clazzFilters: [
        {
          type: 'select',
          label: '年级',
          options: [],
          props: {
            placeholder: '全部年级'
          },
          events: {
            change: _self.gradeChange
          },
          value: ''
        },
        {
          type: 'select',
          label: '班级',
          options: [],
          props: {
            placeholder: '全部班级'
          },
          value: ''
        }
      ],
      childFilters: [
        {
          type: 'input',
          label: '幼儿姓名',
          props: {
            placeholder: '请输入幼儿姓名'
          },
          value: ''
        }
      ],
      teachSearch: {},
      careSearch: {},
      queryObj: {},
      queryTime: '',
      canExport: true,
      tableData: {
        content: [{}]
      },
      pageInfo: {
        pageNum: 1,
        pageSize: 10
      },
      showDrawer: false,
      childId: undefined,
      drawerType: ''
    }
  },
  computed: {
    columns () {
      return columnsList[this.activeName]
    },
    gradeObj () {
      return this.clazzFilters[0]
    },
    clazzObj () {
      return this.clazzFilters[1]
    },
    childNameObj () {
      return this.childFilters[0]
    }
  },
  watch: {
    activeName: {
      handler () {
        this.resetQuery()
      },
      immediate: true
    }
  },
  created () {
    this.getGradeList()
  },
  methods: {
    handleSearch () {
      const itemSearch = {}
      itemSearch.childName = this.getObjectByProp('childName', this.teach).value
      itemSearch.time = this.getObjectByProp('time', this.teach).value
      this.$set(this, 'teachSearch', itemSearch)
    },
    handleSearch2 () {
      const itemSearch = {}
      itemSearch.childName = this.getObjectByProp('childName', this.care).value
      itemSearch.time = this.getObjectByProp('time', this.care).value
      this.$set(this, 'careSearch', itemSearch)
    },
    getGradeList () {
      queryGradeList().then(res => {
        this.gradeObj.options = []
        Array.isArray(res.data) && res.data.forEach(v => {
          this.gradeObj.options.push({
            label: v.name,
            value: v.id
          })
        })
      }).catch(err => {
        console.error(err)
      })
    },
    getClazzList (id) {
      queryClazzList(id).then(res => {
        this.clazzObj.options = []
        this.clazzObj.value = ''
        Array.isArray(res.data) && res.data.forEach(v => {
          this.clazzObj.options.push({
            label: v.name,
            value: v.id
          })
        })
      }).catch(err => {
        console.error(err)
      })
    },
    gradeChange (id) {
      this.getClazzList(id)
    },
    confirmQuery () {
      if (this.activeName === 'clazz') {
        if (!this.clazzObj.value && this.gradeObj.value) {
          return this.$message.warning('请选择所在班级')
        } else {
          if (this.queryTime) this.queryObj.date = transferDate(this.queryTime).time
          if (this.clazzObj.value && this.gradeObj.value) {
            this.queryObj.gradeId = this.gradeObj.value
            this.queryObj.clazzId = this.clazzObj.value
          }
        }
      }
      if (this.activeName === 'child') {
        if (this.queryTime) {
          this.queryObj.date = transferDate(this.queryTime).time
        }
        if (this.childNameObj.value) {
          this.queryObj.childName = this.childNameObj.value
        }
      }
      this.refreshTableData()
    },
    resetQuery () {
      if (this.activeName === 'clazz') {
        this.clazzObj.options = []
        this.clazzObj.value = ''
        this.gradeObj.value = ''
        this.queryTime = new Date()
        this.queryObj = {
          date: transferDate().time
        }
      }
      if (this.activeName === 'child') {
        this.childNameObj.value = ''
        this.queryTime = new Date()
        this.queryObj = {
          date: transferDate().time
        }
      }
      this.refreshTableData()
    },
    exportToExcel () {
      if (!this.canExport) return
      this.canExport = false
      let p
      let options = {
        paged: false
      }
      options = Object.assign({}, options, this.queryObj)
      if (this.activeName === 'clazz') {
        p = exportClazzAttendanceStatisticsToExcel(options)
      }
      if (this.activeName === 'child') {
        p = exportChildAttendanceStatisticsToExcel(options)
      }
      p.then(res => {
        downloadFileForUrl(res)
        this.canExport = true
      }).catch(err => {
        console.error(err)
        this.canExport = true
      })
    },
    currentChange (pageNum, pageSize) {
      this.pageInfo = {
        pageNum, pageSize
      }
      this.refreshTableData()
    },
    refreshTableData () {
      if (this.activeName === 'teach' || this.activeName === 'care') return
      let options = {
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize
      }
      let p
      options = Object.assign({}, options, this.queryObj)
      if (this.activeName === 'clazz') {
        p = queryClazzAttendanceStatisticsList(options)
      }
      if (this.activeName === 'child') {
        p = queryChildAttendanceStatisticsList(options)
      }
      p.then(res => {
        const { data } = res
        Array.isArray(data.content) && data.content.forEach(v => {
          v.rateOfAttendance = v.rateOfAttendance ? v.rateOfAttendance + '%' : '0%'
        })
        this.tableData = data
      }).catch(err => {
        console.error(err)
      })
    },
    showDetail (column, scope) {
      this.showDrawer = true
      this.childId = scope.row.childId
      this.drawerType = 'detail'
    },
    finishDrawer () {
      this.refreshTableData()
    },
    changeType (type) {
      this.drawerType = type
    }
  }
}
</script>
<style lang="scss" scoped>
.attendanceStatistics-wrap {
  ::v-deep .el-table {
    .cell.el-tooltip {
      white-space: pre-line;
    }
  }
}
</style>
