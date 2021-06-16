<template>
  <div class="courseDetail-wrap">
    <etm-field-label
      type="left"
      label="课程名称"
    >
      {{ course.courseName }}
    </etm-field-label>
    <etm-field-label
      type="left"
      label="课程类型"
    >
      {{ course.courseTypeName }}
    </etm-field-label>
    <etm-field-label
      type="left"
      label="上课班级"
    >
      {{ course.clazzName }}
    </etm-field-label>
    <etm-field-label
      type="left"
      label="班主任"
    >
      {{ course.headTeacherName }}
    </etm-field-label>
    <etm-field-label
      type="left"
      label="上课老师"
    >
      {{ course.teacherName }}
    </etm-field-label>
    <etm-field-label
      type="left"
      label="助教老师"
    >
      {{ course.helperTeacherList.join() }}
    </etm-field-label>
    <etm-field-label
      type="left"
      label="上课教室"
    >
      {{ course.classsroomName }}
    </etm-field-label>
    <etm-field-label
      type="left"
      label="日期"
    >
      {{ course.courseDate }}
    </etm-field-label>
    <etm-field-label
      type="left"
      label="上课时段"
    >
      {{ course.courseTimePeriod }}
    </etm-field-label>
    <etm-field-label
      type="left"
      label="学员/容量"
    >
      {{
        course.expChildList.length + course.formalChildList.length
      }}/{{ course.totalFormalChildNum + course.totalExpChildNum }}
    </etm-field-label>

    <etm-title
      show-toggle
      open-text="展开"
      close-text="收起"
      @toggle="showExp = !showExp"
    >
      <span>学员/试听学位 {{ course.expChildList.length }}/{{ course.totalExpChildNum }}</span>
    </etm-title>
    <el-collapse-transition>
      <div v-show="showExp">
        <etm-table
          :columns="columns"
          :data="course.expChildList"
        >
          <!--<el-table-column label="操作">-->
          <!--  <template v-slot="{row}">-->
          <!--    <etm-text>签到</etm-text>-->
          <!--  </template>-->
          <!--</el-table-column>-->
        </etm-table>
      </div>
    </el-collapse-transition>

    <etm-title
      show-toggle
      open-text="展开"
      close-text="收起"
      @toggle="showFormal = !showFormal"
    >
      <span>学员/正式学位 {{ course.formalChildList.length }}/{{ course.totalFormalChildNum }}</span>
    </etm-title>
    <el-collapse-transition>
      <div v-show="showFormal">
        <etm-table
          :columns="columns"
          :data="course.formalChildList"
        >
          <!--<el-table-column label="操作">-->
          <!--  <template v-slot="{row}">-->
          <!--    <etm-text>请假</etm-text>-->
          <!--    <etm-text>入园</etm-text>-->
          <!--    <etm-text>离园</etm-text>-->
          <!--  </template>-->
          <!--</el-table-column>-->
        </etm-table>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>/**
 * courseDetail create by haijinsha
 * createTime 2020/9/18 11:27
 */
import { queryCourseDetailById } from '@/api/newDaycare/scheduleManage'
import { parseTime } from '@/utils'

export default {
  name: 'CourseDetail',
  components: {},
  filters: {},
  mixins: [],
  props: {
    courseManagementId: {
      type: [Number, String],
      default: ''
    }
  },
  data () {
    return {
      columns: [
        {
          label: '姓名',
          prop: 'name'
        },
        {
          label: '性别',
          prop: 'gender'
        },
        {
          label: '考勤状态',
          prop: 'attendStatus'
        }
      ],
      course: {
        courseName: '',
        courseTypeName: '',
        clazzName: '',
        teacherName: '',
        classsroomName: '',
        courseDate: '',
        courseTimePeriod: '',
        helperTeacherList: [],
        expChildList: []
      },
      showExp: true,
      showFormal: true
    }
  },
  computed: {},
  watch: {
    courseManagementId: {
      handler () {
        this.init()
      }
    }
  },
  created () {
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      if (!this.courseManagementId) {
        return
      }
      queryCourseDetailById({ courseManagementId: this.courseManagementId }).then(res => {
        this.course = res.data
        this.course.courseDate = parseTime(this.course.courseDate, '{y}-{m}-{d}')
        this.course.expChildList.forEach(item => {
          if (item.gender) {
            item.gender = item.gender === 'MALE' ? '男' : '女'
          }
        })
        this.course.formalChildList.forEach(item => {
          if (item.gender) {
            item.gender = item.gender === 'MALE' ? '男' : '女'
          }
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
