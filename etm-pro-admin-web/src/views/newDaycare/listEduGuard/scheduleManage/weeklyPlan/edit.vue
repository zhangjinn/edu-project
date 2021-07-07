<template>
  <div>
    <etm-form ref="form" :model="form" type="dialog">

      <el-form-item
        label="科目"
      >
        <span>{{ form.subject }}</span>
      </el-form-item>

      <el-form-item
        label="授课老师"
      >
        <span>{{ form.headTeacher }}</span>
      </el-form-item>
      <el-form-item
        label="课程"
        prop="course"
        :rules="formValidate.nullValueRule(true,'请选择课程')"
      >
        <el-select v-model="form.course" placeholder="请选择课程">
          <el-option
            v-for="item in courseOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

    </etm-form>

  </div>

</template>

<script>
import baseMixin from '@/layout/mixin/baseMixin'
import formValidate from '@/utils/rules'
// import {
//   getScheduleWeekItem
// } from '@/api/guardcare/edu/scheduleManage'
import {
  getScheduleWeekItem
} from '@/api/newDaycare/listEduGuardScheduleManage'
import { getCourseClazz } from '@/api/newDaycare/listEduGuardCourseManage'
// import {
//   getCourseClazz
// } from '@/api/guardcare/edu/courseManage'
export default {
  name: 'Edit',
  mixins: [baseMixin],
  props: {
    type: {
      type: String,
      default: 'add',
      validator(val) {
        return ['add', 'edit'].includes(val)
      }
    },
    itemId: {
      type: Number,
      default: null
    },
    cellData: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      formValidate,
      form: {
        subject: '',
        headTeacher: '',
        course: '',
        courseScheduleId: '' // 课表id

      },
      courseOptions: []

    }
  },
  created() {
    this.init()
    if (this.type === 'edit') {
      this.detail()
    }
  },
  methods: {
    init() {
      this.form.subject = this.cellData.courseSubjectName
      this.form.headTeacher = this.cellData.employeeName
      this.form.courseScheduleId = this.cellData.id

      const param = {
        paged: false
      }
      // 获取班级课程
      getCourseClazz(param).then((res) => {
        this.courseOptions = this.convertDataToOptions(res.data, 'name', 'id')
      })
    },

    // 修改回显
    detail() {
      const id = this.itemId
      getScheduleWeekItem({ id }).then((res) => {
        const { data } = res
        this.form.course = data.courseId
      })
    }

  }
}
</script>

<style scoped lang="scss">

  .clazz{
    display: flex;
    .el-form-item{
      flex: 1;
    }
  }

</style>
