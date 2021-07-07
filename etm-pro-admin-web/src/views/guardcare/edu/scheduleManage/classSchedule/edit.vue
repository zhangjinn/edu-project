<template>
  <div>
    <etm-form ref="form" :model="form" type="dialog">

      <el-form-item
        label="使用学期"
        prop="semester"
        :rules="formValidate.nullValueRule(true,'请选择学期')"
      >
        <el-select v-model="form.semester" placeholder="请选择学期">
          <el-option
            v-for="item in semesterOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        label="使用班级"
        required
      >
        <div class="clazz">
          <el-form-item
            prop="grade"
            :rules="formValidate.nullValueRule(true,'请选择年级')"
          >
            <el-select v-model="form.grade" placeholder="请选择年级" @change="change">
              <el-option
                v-for="item in gradeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            prop="clazz"
            :rules="formValidate.nullValueRule(true,'请选择班级')"
          >
            <el-select v-model="form.clazz" placeholder="请选择班级">
              <el-option
                v-for="item in clazzOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </div>
      </el-form-item>

      <el-form-item
        label="上课时段"
        prop="time"
        :rules="formValidate.nullValueRule(true,'请选择上课时段')"
      >
        <el-select v-model="form.time" placeholder="请选择上课时段">
          <el-option
            v-for="item in timeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        label="课程科目"
        prop="subject"
        :rules="formValidate.nullValueRule(true,'请选择课程科目')"
      >
        <el-select v-model="form.subject" placeholder="请选择课程科目">
          <el-option
            v-for="item in subjectOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        label="课表颜色"
        prop="color"
        :rules="formValidate.nullValueRule(true,'请选择课表颜色')"
      >
        <etm-color v-model="form.color" />
      </el-form-item>

      <el-form-item
        prop="headTeacher"
        label="授课老师"
      >
        <el-select v-model="form.headTeacher" multiple filterable placeholder="请选择授课老师" @change="changeTeacher(form.headTeacher,'headTeacher')">
          <el-option
            v-for="item in teacherOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        prop="teacher"
        label="助教老师"
      >
        <el-select v-model="form.teacher" multiple filterable placeholder="请选择助教老师" @change="changeTeacher(form.teacher,'teacher')">
          <el-option
            v-for="item in teacherOptions"
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
import etmColor from '@/views/newDaycare/courseTimeManageTeach/components/etmColor.vue'

import { getClazz } from '@/api/guardcare/edu/clazzManage'
import { getGrade } from '@/api/guardcare/edu/gradeManage'
import { getEmployeeAll } from '@/api/customer'
import { getScheduleClazzItem, getScheduleTimeSetting, getSemesterSetting, getSubjectSetting } from '@/api/guardcare/edu/scheduleManage'

export default {
  name: 'Edit',
  components: {
    etmColor
  },
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
    labelId: {
      type: [Number, String],
      default: null
    },
    semesterId: {
      type: [Number, String],
      default: null
    },
    gradeId: {
      type: [Number, String],
      default: null
    },
    clazzId: {
      type: [Number, String],
      default: null
    }
  },
  data() {
    return {
      formValidate,
      form: {
        semester: '',
        grade: '',
        clazz: '',
        subject: '',
        color: '',
        time: '',
        headTeacher: [],
        teacher: [],
        headTeacherInfo: [],
        teacherInfo: []
      },
      semesterOptions: [],
      gradeOptions: [],
      clazzOptions: [],
      subjectOptions: [],
      timeOptions: [],
      teacherOptions: [],
      rolesHeadTeacher: [],
      rolesTeacher: []

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
      // 学期
      getSemesterSetting().then(res => {
        const semester = []
        res.data.forEach(v => {
          semester.push({
            label: `${v.name}`,
            value: v.id
          })
        })
        this.semesterOptions = semester

        // 添加学期默认值
        if (this.semesterId) {
          this.form.semester = this.semesterId
        }
      }).catch(err => {
        console.error(err)
      })

      // 获取市场人员
      getEmployeeAll().then((res) => {
        this.teacherOptions = this.convertDataToOptions(res.data, 'name', 'id')
      })

      // 获取课程科目
      getSubjectSetting().then(res => {
        this.subjectOptions = this.convertDataToOptions(res.data, 'name', 'id')
      }).catch(err => {
        console.error(err)
      })

      // 获取时段
      const paramTime = {
        type: 'COURSE'
      }
      getScheduleTimeSetting(paramTime).then((res) => {
        this.timeOptions = []
        res.data.map(item => {
          this.timeOptions.push(
            {
              label: item.startTime + '~' + item.endTime,
              value: item.id
            }
          )
        })

        // 添加课程时段默认值
        if (this.labelId) {
          this.form.time = this.labelId
        }
      })

      // 获取年级
      this.getGradeList()
    },

    // 获取年级列表
    getGradeList() {
      const param = {
        paged: false
      }
      getGrade(param).then((res) => {
        this.gradeOptions = this.convertDataToOptions(res.data, 'name', 'id')

        // 添加年级默认值
        if (this.gradeId) {
          this.form.grade = this.gradeId
          this.getClazzList(this.form.grade)
        }
      })
    },

    // 获取班级列表
    getClazzList(id) {
      const param = {
        gradeId: id,
        paged: false
      }
      getClazz(param).then((res) => {
        this.clazzOptions = this.convertDataToOptions(res.data, 'name', 'id')

        // 添加班级默认值
        if (this.clazzId) {
          this.form.clazz = this.clazzId
        }
      })
    },

    // 改变年级切换对应班级
    change(id) {
      this.getClazzList(id)
    },

    // 修改回显
    detail() {
      const id = this.itemId
      getScheduleClazzItem(id).then((res) => {
        const { data } = res
        this.getClazzList(data.gradeId)
        this.form = {
          semester: data.courseTermId,
          grade: data.gradeId,
          clazz: data.clazzId,
          subject: data.courseSubjectId,
          color: data.color,
          time: data.scheduleTimeSettingId,
          headTeacher: [],
          teacher: [],
          headTeacherInfo: [],
          teacherInfo: []

        }

        if (data.courseScheduleRoleList) {
          data.courseScheduleRoleList.map((val) => {
            if (val.type === 'LECTURER') {
              const id = val.employeeId
              this.form.headTeacher.push(id)
              this.form.headTeacherInfo.push({
                label: val.employeeName,
                value: id,
                id: val.id
              })
            }
            if (val.type === 'ASSISTANT') {
              const id = val.employeeId
              this.form.teacher.push(id)
              this.form.teacherInfo.push({
                label: val.employeeName,
                value: id,
                id: val.id
              })
            }
          })
        }

        this.rolesHeadTeacher = JSON.parse(JSON.stringify(this.form.headTeacherInfo))
        this.rolesTeacher = JSON.parse(JSON.stringify(this.form.teacherInfo))
      })
    },

    // 修改老师
    changeTeacher(idArr, type) {
      const that = this
      const arr = []

      idArr.map((val) => {
        let obj = {}
        this.teacherOptions.map((item) => {
          if (item.value === val) {
            obj = {
              value: item.value,
              label: item.label
            }
          }
        })
        arr.push(obj)
      })

      if (type === 'headTeacher') {
        this.form.headTeacherInfo = JSON.parse(JSON.stringify(arr))
        this.form.headTeacherInfo.map((val, index) => {
          that.rolesHeadTeacher.map((v, i) => {
            if (val.value === v.value) {
              val.id = v.id
            }
          })
        })
      } else if (type === 'teacher') {
        this.form.teacherInfo = JSON.parse(JSON.stringify(arr))
        this.form.teacherInfo.map((val, index) => {
          that.rolesTeacher.map((v, i) => {
            if (val.value === v.value) {
              that.form.teacherInfo[index].id = v.id
            }
          })
        })
      }
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
