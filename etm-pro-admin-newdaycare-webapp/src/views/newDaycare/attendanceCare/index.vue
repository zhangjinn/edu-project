<template>
  <div class="index-wrap">
    <etm-main-body>
      <etm-layout-split>
        <div slot="header">
          <etm-tabs
            ref="tabs"
            v-model="activeName"
            :setting="hasAuthOfBool('daycare.attendanceCare.setting')"
            @setting="setting"
          >
            <el-tab-pane
              v-if="hasAuth('daycare.attendanceUndoCare.queryBatch', 'tabs', 'activeName')"
              label="未考勤"
              name="notAttendance"
            >
              <etm-tool-bar
                v-model="formData"
                @search="handleSearch"
              />
            </el-tab-pane>
            <el-tab-pane
              v-if="hasAuth('daycare.attendanceDoneCare.queryBatch', 'tabs', 'activeName')"
              label="已到园"
              name="attendance"
            >
              <etm-tool-bar
                v-model="formData2"
                @search="handleSearch2"
              />
            </el-tab-pane>
            <el-tab-pane
              v-if="hasAuth('daycare.attendanceLeave.queryBatch', 'tabs', 'activeName')"
              label="已离园"
              name="out"
            >
              <etm-tool-bar
                v-model="formData3"
                @search="handleSearch3"
              />
            </el-tab-pane>
          </etm-tabs>
        </div>
        <div slot="body">
          <not-attendance
            v-if="activeName === 'notAttendance'"
            :not-search="notSearch"
          />
          <attendance
            v-if="activeName === 'attendance'"
            :attend-search="attendSearch"
          />
          <leave-school
            v-if="activeName === 'out'"
            :leave-search="leaveSearch"
          />
        </div>
      </etm-layout-split>
    </etm-main-body>
  </div>
</template>

<script>
/**
 * index create by Administrator
 * createTime 2020/09/08 19:17
 */
import attendance from '@/views/newDaycare/attendanceCare/attendance/attendance'
import notAttendance from '@/views/newDaycare/attendanceCare/notAttendance/notAttendance'
import leaveSchool from '@/views/newDaycare/attendanceCare/leaveSchool/leaveSchool'
import baseMixin from '@/layout/mixin/baseMixin'
// import { queryEmployeeSelectByTabCode } from '@/api/daycare/yunCall'
// import { queryClassCareName, queryRomeCareName } from '@/api/daycare/attendanceCare'
import { parseTime } from '@/utils'

export default {
  name: 'Index',
  components: {
    attendance, notAttendance, leaveSchool
  },
  filters: {},
  mixins: [baseMixin],
  props: {},
  data () {
    return {
      activeName: 'notAttendance',
      formData: [
        {
          label: '学员姓名',
          type: 'input',
          prop: 'childName',
          value: '',
          props: {
            placeholder: '请输入学员姓名'
          }
        },
        {
          label: '所在班级',
          type: 'input',
          prop: 'clazzName',
          value: '',
          props: {
            placeholder: '请输入班级名称'
          }
        },
        {
          label: '考勤日期',
          type: 'date',
          value: '',
          prop: 'time',
          default: parseTime(new Date(), '{y}-{m}-{d}'),
          props: {
            type: 'date',
            placeholder: '年/月/日',
            clearable: false
          }
        }
      ],
      formData2: [
        {
          label: '学员姓名',
          type: 'input',
          prop: 'childName',
          value: '',
          props: {
            placeholder: '请输入学员姓名'
          }
        },
        {
          label: '所在班级',
          type: 'input',
          prop: 'clazzName',
          value: '',
          props: {
            placeholder: '请输入班级名称'
          }
        },
        {
          label: '考勤日期',
          type: 'date',
          value: '',
          prop: 'time',
          default: parseTime(new Date(), '{y}-{m}-{d}'),
          props: {
            type: 'date',
            placeholder: '年/月/日',
            clearable: false
          }
        }
      ],
      formData3: [
        {
          label: '学员姓名',
          type: 'input',
          prop: 'childName',
          value: '',
          props: {
            placeholder: '请输入学员姓名'
          }
        },
        {
          label: '所在班级',
          type: 'input',
          prop: 'clazzName',
          value: '',
          props: {
            placeholder: '请输入班级名称'
          }
        },
        {
          label: '考勤日期',
          type: 'date',
          value: '',
          prop: 'time',
          default: parseTime(new Date(), '{y}-{m}-{d}'),
          props: {
            type: 'date',
            placeholder: '年/月/日',
            clearable: false
          }
        }
      ],
      notSearch: {},
      attendSearch: {},
      leaveSearch: {}
    }
  },
  computed: {},
  watch: {},
  created () {
  },
  mounted () {
  },
  methods: {
    handleSearch () {
      const itemSearch = {}
      itemSearch.childName = this.getObjectByProp('childName', this.formData).value
      itemSearch.clazzName = this.getObjectByProp('clazzName', this.formData).value
      itemSearch.date = this.getObjectByProp('time', this.formData).value
      this.$set(this, 'notSearch', itemSearch)
      console.log(itemSearch)
    },
    handleSearch2 () {
      const itemSearch = {}
      itemSearch.childName = this.getObjectByProp('childName', this.formData2).value
      itemSearch.clazzName = this.getObjectByProp('clazzName', this.formData).value
      itemSearch.date = this.getObjectByProp('time', this.formData2).value
      this.$set(this, 'attendSearch', itemSearch)
    },
    handleSearch3 () {
      const itemSearch = {}
      itemSearch.childName = this.getObjectByProp('childName', this.formData3).value
      itemSearch.clazzName = this.getObjectByProp('clazzName', this.formData).value
      itemSearch.date = this.getObjectByProp('time', this.formData3).value
      this.$set(this, 'leaveSearch', itemSearch)
      // console.log(itemSearch)
    },
    setting () {
      this.$router.push({ path: '/newdaycare_attendanceCareSetting' })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
