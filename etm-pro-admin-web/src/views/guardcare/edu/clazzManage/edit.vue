<template>
  <etm-form ref="form" class="classItem" :model="form" type="dialog">
    <el-row :gutter="24">
      <el-col :span="12">
        <el-form-item
          label="年级"
          prop="gradeName"
          :rules="formValidate.nullValueRule(true,'请选择年级')"
        >
          <el-select v-model="form.gradeName" placeholder="请选择年级">
            <el-option
              v-for="item in gradeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          prop="clazzName"
          :rules="formValidate.nullValueRule(true,'请输入班级名称')"
          label="班级名称"
        >
          <el-input
            v-model="form.clazzName"
            maxlength="10"
            placeholder="请输入班级名称"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item
          prop="headTeacher"
          label="班主任"
        >
          <el-select v-model="form.headTeacher" multiple collapse-tags placeholder="请选择班主任" @change="changeTeacher(form.headTeacher,'headTeacher')">
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
          label="老师"
        >
          <el-select v-model="form.teacher" multiple collapse-tags placeholder="请选择老师" @change="changeTeacher(form.teacher,'teacher')">
            <el-option
              v-for="item in teacherOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
  </etm-form>
</template>

<script>
import baseMixin from '@/layout/mixin/baseMixin'
import formValidate from '@/utils/rules'
import { getEmployeeAll } from '@/api/customer'
import { getGrade } from '@/api/guardcare/edu/gradeManage'
import {
  getClazzItem
} from '@/api/guardcare/edu/clazzManage'
export default {
  name: 'EditClass',
  mixins: [baseMixin],
  props: {
    itemId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      formValidate,
      form: {
        gradeName: '',
        clazzName: '',
        headTeacher: [],
        teacher: [],
        headTeacherInfo: [],
        teacherInfo: []
      },
      gradeOptions: [],
      teacherOptions: [],
      clazzRolesHeadTeacher: [],
      clazzRolesTeacher: []
    }
  },
  created() {
    this.init()
  },
  methods: {

    init() {
      // 获取年级列表
      const param = {
        paged: false
      }
      getGrade(param).then((res) => {
        this.gradeOptions = this.convertDataToOptions(res.data, 'name', 'id')
      })

      // 获取市场人员
      getEmployeeAll().then((res) => {
        this.teacherOptions = this.convertDataToOptions(res.data, 'name', 'id')
      })
      this.getClazzItemData()
    },

    getClazzItemData() {
      const id = this.itemId
      getClazzItem(id).then((res) => {
        const { data } = res
        this.form.gradeName = data.gradeId
        this.form.clazzName = data.name
        this.form.headTeacher = []
        this.form.teacher = []
        this.form.headTeacherInfo = []
        this.form.teacherInfo = []
        if (data.clazzRoles) {
          data.clazzRoles.map((val) => {
            if (val.type === 'HEADTEACHER') {
              const id = val.employeeId
              this.form.headTeacher.push(id)
              this.form.headTeacherInfo.push({
                label: val.employeeName,
                value: id,
                id: val.id
              })
            }
            if (val.type === 'TEACHER') {
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

        this.clazzRolesHeadTeacher = JSON.parse(JSON.stringify(this.form.headTeacherInfo))
        this.clazzRolesTeacher = JSON.parse(JSON.stringify(this.form.teacherInfo))
      })
    },
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
          that.clazzRolesHeadTeacher.map((v, i) => {
            if (val.value === v.value) {
              val.id = v.id
            }
          })
        })
      } else if (type === 'teacher') {
        this.form.teacherInfo = JSON.parse(JSON.stringify(arr))
        this.form.teacherInfo.map((val, index) => {
          that.clazzRolesTeacher.map((v, i) => {
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
  .classItem{

  }

</style>
