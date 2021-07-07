<template>
  <div class="attendance-wrap">
    <etm-main-body>
      <etm-layout-split>
        <div slot="header">
          <etm-tabs ref="tabs" v-model="activeName">
            <el-tab-pane label="园所考勤统计" name="garden">
              <etm-tool-bar v-model="gardenFilter" @search="handleSearch" @reset="handleReset">
                <div class="select-garden">
                  <span>园所:</span>
                  <el-cascader
                    v-model="queryGarden"
                    :options="options"
                    @change="handleGardenChange"
                  />
                </div>
              </etm-tool-bar>
            </el-tab-pane>
            <el-tab-pane label="园所班级考勤" name="clazz">
              <etm-tool-bar v-model="clazzFilter" @search="handleSearch" @reset="handleReset">
                <div class="select-garden">
                  <span>园所:</span>
                  <el-cascader
                    v-model="queryGarden"
                    :options="options"
                    @change="handleGardenChange"
                  />
                </div>
              </etm-tool-bar>
            </el-tab-pane>
            <el-tab-pane label="幼儿考勤统计" name="child">
              <etm-tool-bar v-model="childFilter" @search="handleSearch" @reset="handleReset">
                <div class="select-garden">
                  <span>园所:</span>
                  <el-cascader
                    v-model="queryGarden"
                    :options="options"
                    @change="handleGardenChange"
                  />
                </div>
              </etm-tool-bar>
            </el-tab-pane>
          </etm-tabs>
        </div>
        <div slot="body">
          <etm-table-tool-bar slot="tool">
            <el-button
              slot="right"
              plain
              @click="exportToExcel"
            >导出Excel
            </el-button>
          </etm-table-tool-bar>
          <etm-table
            :data="tableData"
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
          </etm-table>
        </div>
      </etm-layout-split>
    </etm-main-body>
    <etm-drawer
      :visible.sync="showDrawer"
      type="big"
      @close="closeDrawer"
    >
      <detail
        :child-id="childId"
        :drawer-page="drawerPage"
        @finish="finishDrawer"
        @change="changeType"
        @close="closeDrawer"
      />
    </etm-drawer>
  </div>
</template>

<script>
import { parseTime } from '@/utils'
import {
  queryGardenAttendanceList,
  exportGardenAttendanceListToExcel,
  queryClazzList,
  queryGradeList,
  queryClazzAttendanceList,
  exportClazzAttendanceListToExcel,
  queryChildAttendanceList,
  exportChildAttendanceListToExcel
} from '@/api/newDaycare/attendanceStatisticsGuardHead'
import { queryOrganization } from '@/api/newDaycare/childDataHead'
import { downloadFileForUrl } from '@/utils/file'
import detail from '@/views/newDaycare/childManageGuard/component/childDetail'
export default {
  components: {
    detail
  },
  data() {
    return {
      gardenFilter: [
        {
          label: '日期',
          type: 'date',
          value: '',
          prop: 'queryDate',
          default: parseTime(new Date(), '{y}-{m}-{d}'),
          props: {
            type: 'date',
            placeholder: '年/月/日',
            clearable: false
          }
        }
      ],
      clazzFilter: [
        {
          label: '日期',
          type: 'date',
          value: '',
          prop: 'queryDate',
          default: parseTime(new Date(), '{y}-{m}-{d}'),
          props: {
            type: 'date',
            placeholder: '年/月/日',
            clearable: false
          }
        },
        {
          type: 'select',
          label: '年级',
          options: [],
          props: {
            placeholder: '全部年级'
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
      childFilter: [
        {
          label: '日期',
          type: 'date',
          value: '',
          prop: 'queryDate',
          default: parseTime(new Date(), '{y}-{m}-{d}'),
          props: {
            type: 'date',
            placeholder: '年/月/日',
            clearable: false
          }
        },
        {
          type: 'input',
          label: '幼儿姓名',
          props: {
            placeholder: '请输入幼儿姓名'
          },
          value: ''
        }
      ],
      activeName: 'garden',
      queryGarden: [],
      options: [],
      tableData: [],
      queryObj: {},
      showDrawer: false,
      drawerPage: '',
      childId: null,
      childName: '',
      canExport: true
    }
  },
  computed: {
    columns() {
      const common = [
        { label: '应出勤人数', prop: 'shouldArriveNumber' },
        { label: '实际出勤人数', prop: 'arrivedNumber' },
        { label: '请假人数', prop: 'requestForLeaveNumber' },
        { label: '缺勤人数', prop: 'absenceNumber' },
        { label: '出勤率', prop: 'rateOfAttendance_p' }
      ]
      if (this.activeName === 'garden') {
        return [
          { label: '园所', prop: 'organizationName' },
          ...common
        ]
      }
      if (this.activeName === 'clazz') {
        return [
          { label: '年级', prop: 'gradeName' },
          { label: '班级', prop: 'clazzName' },
          ...common
        ]
      }
      if (this.activeName === 'child') {
        return [
          { label: '幼儿姓名', prop: 'childName', _link: true },
          { label: '应出勤天数', prop: 'shouldArriveNumber' },
          { label: '实际出勤天数', prop: 'arrivedNumber' },
          { label: '请假次数', prop: 'requestForLeaveNumber' },
          { label: '缺勤次数', prop: 'absenceNumber' },
          { label: '出勤率', prop: 'rateOfAttendance' }
        ]
      }
      return []
    },
    gradeObj() {
      return this.clazzFilter[1]
    },
    clazzObj() {
      return this.clazzFilter[2]
    }
  },
  watch: {
    activeName: {
      handler(v) {
        if (v === 'garden') {
          this.getGradeList()
        }
        this.getGardenList()
        this.refreshTableData()
      },
      immediate: true
    },
    gradeObj: {
      handler(v) {
        if (v.value) {
          this.gradeChange(v.value)
        }
      },
      deep: true
    }
  },
  methods: {
    getGardenList() {
      queryOrganization().then(res => {
        const { data } = res
        Array.isArray(data) && data.forEach(v => {
          v.label = v.areaName
          v.value = v.areaName
          v.sonOrganizationVOList.forEach(i => {
            i.label = i.organizationName
            i.value = i.sonOrganizationId
          })
          v.children = v.sonOrganizationVOList
        })
        this.options = data
      })
    },
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
    refreshTableData() {
      this.tableData = []
      if (this.activeName === 'garden') {
        this.queryObj = {
          date: this.gardenFilter[0].value || this.gardenFilter[0].default,
          areaName: this.queryGarden[0] || null,
          enterpriseId: this.queryGarden[1] || null
        }
        queryGardenAttendanceList(this.queryObj).then(res => {
          const { data } = res
          data.forEach(v => {
            v.rateOfAttendance_p = v.rateOfAttendance + '%'
            v.organizationName = v.name
          })
          this.tableData = data
        })
      } else if (this.activeName === 'clazz') {
        this.queryObj = {
          date: this.clazzFilter[0].value || this.clazzFilter[0].default,
          gradeId: this.gradeObj.value || null,
          clazzId: this.clazzObj.value || null,
          areaName: this.queryGarden[0] || null,
          enterpriseId: this.queryGarden[1] || null
        }
        queryClazzAttendanceList(this.queryObj).then(res => {
          const { data } = res
          data.forEach(v => {
            v.rateOfAttendance_p = v.rateOfAttendance + '%'
          })
          this.tableData = data
        })
      } else if (this.activeName === 'child') {
        this.queryObj = {
          date: this.childFilter[0].value || this.childFilter[0].default,
          childName: this.childFilter[1].value || null,
          areaName: this.queryGarden[0] || null,
          enterpriseId: this.queryGarden[1] || null
        }
        queryChildAttendanceList(this.queryObj).then(res => {
          const { data } = res
          data.forEach(v => {
            v.rateOfAttendance_p = v.rateOfAttendance + '%'
          })
          this.tableData = data
        })
      }
    },
    handleSearch() {
      this.refreshTableData()
    },
    handleReset() {
      this.refreshTableData()
      this.queryGarden = ''
      if (this.activeName === 'clazz') {
        this.clazzObj.options = []
      }
    },
    handleGardenChange(val) {
      console.log('handleGardenChange', val)
    },
    exportToExcel() {
      if (!this.canExport) return
      this.canExport = false
      let p
      if (this.activeName === 'garden') {
        p = exportGardenAttendanceListToExcel({
          date: this.gardenFilter[0].value || this.gardenFilter[0].default,
          areaName: this.queryGarden[0] || null,
          enterpriseId: this.queryGarden[1] || null
        })
      }
      if (this.activeName === 'clazz') {
        p = exportClazzAttendanceListToExcel({
          date: this.clazzFilter[0].value || this.clazzFilter[0].default,
          gradeId: this.gradeObj.value || null,
          clazzId: this.clazzObj.value || null,
          areaName: this.queryGarden[0] || null,
          enterpriseId: this.queryGarden[1] || null
        })
      }
      if (this.activeName === 'child') {
        p = exportChildAttendanceListToExcel({
          date: this.childFilter[0].value || this.childFilter[0].default,
          childName: this.childFilter[1].value || null,
          areaName: this.queryGarden[0] || null,
          enterpriseId: this.queryGarden[1] || null
        })
      }
      p.then(res => {
        downloadFileForUrl(res)
        this.canExport = true
      }).catch(err => {
        console.error(err)
        this.canExport = true
      })
    },
    showDetail(column, scope) {
      this.childId = scope.row.childId
      this.childName = scope.row.childName
      this.drawerPage = 'detail'
      this.showDrawer = true
    },
    closeDrawer() {
      this.showDrawer = false
    },
    finishDrawer() {
      this.refreshTableData()
    },
    changeType(type) {
      this.drawerPage = type
    }
  }
}
</script>

<style scoped lang="scss">
.attendance-wrap {
  .select-garden {
    display: inline-block;
    margin-right: 24px;
    span {
      margin-right: 6px;
    }
  }
}
</style>
