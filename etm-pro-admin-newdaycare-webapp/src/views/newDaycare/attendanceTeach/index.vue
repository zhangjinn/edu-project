<template>
  <div class="index-wrap">
    <etm-main-body>
      <etm-layout-split>
        <div slot="header">
          <etm-tabs
            ref="tabs"
            v-model="activeName"
            :setting="hasAuthOfBool('daycare.attendanceTeach.setting')"
            @setting="setting"
          >
            <el-tab-pane
              v-if="hasAuth('daycare.attendanceUndoTeach.queryBatch', 'tabs', 'activeName')"
              label="未考勤"
              name="notAttendance"
            >
              <etm-tool-bar
                v-model="formData"
                @search="handleSearch"
              />
            </el-tab-pane>
            <el-tab-pane
              v-if="hasAuth('daycare.attendanceDoneTeach.queryBatch', 'tabs', 'activeName')"
              label="已考勤"
              name="attendance"
            >
              <etm-tool-bar
                v-model="formData2"
                @search="handleSearch2"
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
        </div>
      </etm-layout-split>
    </etm-main-body>
  </div>
</template>

<script>
/**
 * index create by Administrator
 * createTime 2020/09/08 15:09
 */
import baseMixin from '@/layout/mixin/baseMixin'
import notAttendance from '@/views/newDaycare/attendanceTeach/notAttendance/notAttendance'
import attendance from '@/views/newDaycare/attendanceTeach/attendance/attendance'
import { queryClassName, queryCourse } from '@/api/newDaycare/attendanceTeach'
import { queryEmployeeSelectByTabCode } from '@/api/newDaycare/yunCall'
import { parseTime } from '@/utils/index'

export default {
  name: 'Index',
  components: {
    notAttendance,
    attendance
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
          label: '课程名称',
          type: 'select',
          prop: 'courseName',
          value: '',
          props: {
            placeholder: '请输入课程名称'
          },
          options: []
        },
        {
          label: '所在班级',
          type: 'select',
          prop: 'clazzId',
          value: null,
          props: {
            placeholder: '请选择所在班级'
          },
          options: []
        },
        {
          label: '上课时间',
          type: 'date',
          value: '',
          prop: 'time',
          default: [parseTime(new Date(), '{y}-{m}-{d}'), parseTime(new Date(), '{y}-{m}-{d}')],
          props: {
            type: 'daterange',
            startPlaceholder: '年/月',
            endPlaceholder: '年/月'
          }
        },
        {
          label: '上课老师',
          type: 'select',
          prop: 'teacherName',
          value: '',
          props: {
            placeholder: '请输入上课老师名称'
          },
          options: []
        },
        {
          label: '助教老师',
          type: 'select',
          prop: 'helpTeacherName',
          value: '',
          props: {
            placeholder: '请输入助教老师名称'
          },
          options: []
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
          label: '课程名称',
          type: 'select',
          prop: 'courseName',
          value: '',
          props: {
            placeholder: '请输入课程名称'
          },
          options: []
        },
        {
          label: '所在班级',
          type: 'select',
          prop: 'clazzId',
          value: null,
          props: {
            placeholder: '请选择所在班级'
          },
          options: []
        },
        {
          label: '上课时间',
          type: 'date',
          value: '',
          prop: 'time',
          default: [parseTime(new Date(), '{y}-{m}-{d}'), parseTime(new Date(), '{y}-{m}-{d}')],
          props: {
            type: 'daterange',
            startPlaceholder: '年/月',
            endPlaceholder: '年/月'
          }
        },
        {
          label: '上课老师',
          type: 'select',
          prop: 'teacherName',
          value: '',
          props: {
            placeholder: '请输入上课老师名称'
          },
          options: []
        },
        {
          label: '助教老师',
          type: 'select',
          prop: 'helpTeacherName',
          value: '',
          props: {
            placeholder: '请输入助教老师名称'
          },
          options: []
        }
      ],
      notSearch: {},
      attendSearch: {}
    }
  },
  computed: {},
  watch: {},
  created () {
  },
  mounted () {
    this.getClassName()
    this.getCourse()
    this.getWorkers()
  },
  methods: {
    setting () {
      this.$router.push({ path: '/newdaycare_attendanceTeachSetting' })
    },
    handleSearch () {
      const itemSearch = {}
      itemSearch.childName = this.getObjectByProp('childName', this.formData).value
      itemSearch.courseName = this.getObjectByProp('courseName', this.formData).value
      itemSearch.clazzId = this.getObjectByProp('clazzId', this.formData).value
      itemSearch.time = this.getObjectByProp('time', this.formData).value
      itemSearch.teacherName = this.getObjectByProp('teacherName', this.formData).value
      itemSearch.helpTeacherName = this.getObjectByProp('helpTeacherName', this.formData).value
      this.$set(this, 'notSearch', itemSearch)
      // console.log(this.notSearch)
    },
    handleSearch2 () {
      const itemSearch = {}
      itemSearch.childName = this.getObjectByProp('childName', this.formData2).value
      itemSearch.courseName = this.getObjectByProp('courseName', this.formData2).value
      itemSearch.clazzId = this.getObjectByProp('clazzId', this.formData2).value
      itemSearch.time = this.getObjectByProp('time', this.formData2).value
      itemSearch.teacherName = this.getObjectByProp('teacherName', this.formData2).value
      itemSearch.helpTeacherName = this.getObjectByProp('helpTeacherName', this.formData2).value
      this.$set(this, 'attendSearch', itemSearch)
      // console.log(this.attendSearch)
    },
    getClassName () {
      queryClassName({ teCourseName: null }).then(res => {
        const itemList = []
        // console.log(res)
        res.data.forEach(item => {
          itemList.push({
            label: item.teClazzName,
            value: item.teClazzId
          })
        })
        // console.log(itemList)
        this.$set(this.formData[2], 'options', itemList)
        this.$set(this.formData2[2], 'options', itemList)
      })
    },
    getCourse () {
      queryCourse().then(res => {
        const itemList = []
        res.data.forEach(item => {
          itemList.push({
            label: item.caeCourseName,
            value: item.caeCourseId
          })
        })
        this.$set(this.formData[1], 'options', itemList)
        this.$set(this.formData2[1], 'options', itemList)
      })
    },
    getWorkers () {
      queryEmployeeSelectByTabCode({ tagCode: null }).then(res => {
        // console.log(res)
        const itemSearch = []
        for (let i = 0; i < res.data.length; i++) {
          itemSearch.push({
            value: res.data[i].id,
            label: res.data[i].name
          })
        }
        this.$set(this.formData[4], 'options', itemSearch)
        this.$set(this.formData[5], 'options', itemSearch)
        this.$set(this.formData2[4], 'options', itemSearch)
        this.$set(this.formData2[5], 'options', itemSearch)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
