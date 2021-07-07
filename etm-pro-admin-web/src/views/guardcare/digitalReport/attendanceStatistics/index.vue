<template>
  <div class="attendanceStatistics">
    <etm-layout-split>
      <div slot="header">
        <etm-tabs ref="tabs" v-model="tabs">
          <template v-for="tab in tabsList">
            <el-tab-pane
              v-if="hasAuth(tab.authId, 'tabs', 'tabs')"
              :key="tab.name"
              :label="tab.label"
              :name="tab.name"
            >
              <etm-tool-bar v-model="tab.filters" @search="confirmQuery" @reset="resetQuery">
                <el-form-item label="日期:">
                  <el-date-picker
                    v-show="tabs === 'clazz'"
                    v-model="queryTime"
                    type="date"
                    placeholder="选择日期"
                    :clearable="false"
                  />
                  <el-date-picker
                    v-show="tabs === 'child'"
                    v-model="queryTime"
                    type="month"
                    placeholder="选择日期"
                    :clearable="false"
                  />
                </el-form-item>
              </etm-tool-bar>
            </el-tab-pane>
          </template>

        </etm-tabs>
      </div>
      <div slot="body">
        <etm-table-tool-bar slot="tool">
          <template v-if="tabs === 'clazz'">
            <div slot="right">
              <el-button
                v-if="hasAuthOfBool('guardcare.attendanceStatisticsClazz.excelExport')"
                plain
                @click.stop="exportToExcel"
              >导出Excel
              </el-button>
            </div>
          </template>
          <template v-if="tabs === 'child'">
            <div slot="right">
              <el-button
                v-if="hasAuthOfBool('guardcare.attendanceStatisticsChild.excelExport')"
                plain
                @click.stop="exportToExcel"
              >导出Excel
              </el-button>
            </div>
          </template>
        </etm-table-tool-bar>
        <etm-table-page
          :data="tableData"
          @currentChange="currentChange"
        >
          <el-table-column
            v-for="column in columns"
            :key="column.prop"
            slot="left"
            :label="column.label"
            :prop="column.prop"
          >
            <template slot-scope="scope">
              <a v-if="column._link" @click.stop="showDetail(column, scope)">{{ scope.row[column.prop] }}</a>
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
        :drawer-type="drawerType"
        @finish="finishDrawer"
        @change="changeType"
        @close="showDrawer = false"
      />
    </etm-drawer>
  </div>
</template>
<script>
const columnsList = {
  clazz: [
    { label: '年级', prop: 'gradeName' },
    { label: '班级', prop: 'clazzName' },
    { label: '应出勤人数', prop: 'shouldArriveNumber' },
    { label: '实际出勤人数', prop: 'arrivedNumber' },
    { label: '请假人数', prop: 'requestForLeaveNumber' },
    { label: '缺勤人数', prop: 'absenceNumber' },
    { label: '出勤率', prop: 'rateOfAttendance' }
  ],
  child: [
    { label: '幼儿姓名', prop: 'childName', _link: true },
    { label: '应出勤天数', prop: 'shouldArriveNumber' },
    { label: '实际出勤天数', prop: 'arrivedNumber' },
    { label: '请假天数', prop: 'requestForLeaveNumber' },
    { label: '缺勤天数', prop: 'absenceNumber' },
    { label: '出勤率', prop: 'rateOfAttendance' }
  ]
}
import baseMixin from '@/layout/mixin/baseMixin'
import {
  queryClazzAttendanceStatisticsList,
  queryChildAttendanceStatisticsList,
  queryClazzList,
  queryGradeList,
  exportClazzAttendanceStatisticsToExcel,
  exportChildAttendanceStatisticsToExcel
} from '@/api/guardcare/digitalReport/attendanceStatistics.js'
import transferDate from '@/utils/date'
import { downloadFileForUrl } from '@/utils/file'
import detail from '../../../guardcare/childManage/childMessage/component/detail'
export default {
  components: {
    detail
  },
  mixins: [baseMixin],
  data() {
    const _self = this
    return {
      tabs: 'clazz',
      tabsList: [
        {
          label: '班级考勤',
          name: 'clazz',
          authId: 'guardcare.attendanceStatisticsClazz.queryBatch',
          filters: [
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
          ]
        },
        {
          label: '幼儿考勤',
          name: 'child',
          authId: 'guardcare.attendanceStatisticsChild.queryBatch',
          filters: [
            {
              type: 'input',
              label: '幼儿姓名',
              props: {
                placeholder: '请输入幼儿姓名'
              },
              value: ''
            }
          ]
        }
      ],
      tableData: {
        content: [{}]
      },
      pageInfo: {
        pageNum: 1,
        pageSize: 10
      },
      queryObj: {},
      queryTime: '',
      showDrawer: false,
      childId: undefined,
      drawerType: '',
      canExport: true
    }
  },
  computed: {
    columns() {
      return columnsList[this.tabs]
    },
    gradeObj() {
      return this.tabsList[0].filters[0]
    },
    clazzObj() {
      return this.tabsList[0].filters[1]
    },
    childNameObj() {
      return this.tabsList[1].filters[0]
    }
  },
  watch: {
    tabs: {
      handler() {
        this.resetQuery()
      },
      immediate: true
    }
  },
  created() {
    this.getGradeList()
  },
  methods: {
    getGradeList() {
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
    getClazzList(id) {
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
    gradeChange(id) {
      this.getClazzList(id)
    },
    confirmQuery() {
      if (this.tabs === 'clazz') {
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
      if (this.tabs === 'child') {
        if (this.queryTime) {
          this.queryObj.date = transferDate(this.queryTime).time
        }
        if (this.childNameObj.value) {
          this.queryObj.childName = this.childNameObj.value
        }
      }
      this.refreshTableData()
    },
    resetQuery() {
      if (this.tabs === 'clazz') {
        this.clazzObj.options = []
        this.clazzObj.value = ''
        this.gradeObj.value = ''
        this.queryTime = new Date()
        this.queryObj = {
          date: transferDate().time
        }
      }
      if (this.tabs === 'child') {
        this.childNameObj.value = ''
        this.queryTime = new Date()
        this.queryObj = {
          date: transferDate().time
        }
      }
      this.refreshTableData()
    },
    exportToExcel() {
      if (!this.canExport) return
      this.canExport = false
      let p
      let options = {
        paged: false
      }
      options = Object.assign({}, options, this.queryObj)
      if (this.tabs === 'clazz') {
        p = exportClazzAttendanceStatisticsToExcel(options)
      }
      if (this.tabs === 'child') {
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
    currentChange(pageNum, pageSize) {
      this.pageInfo = {
        pageNum, pageSize
      }
      this.refreshTableData()
    },
    refreshTableData() {
      let options = {
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize
      }
      let p
      options = Object.assign({}, options, this.queryObj)
      if (this.tabs === 'clazz') {
        p = queryClazzAttendanceStatisticsList(options)
      }
      if (this.tabs === 'child') {
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
    showDetail(column, scope) {
      this.showDrawer = true
      this.childId = scope.row.childId
      this.drawerType = 'detail'
    },
    finishDrawer() {
      this.refreshTableData()
    },
    changeType(type) {
      this.drawerType = type
    }
  }
}
</script>

<style scoped lang="scss">
.attendanceStatistics {
  margin-top: 16px;
}
</style>
