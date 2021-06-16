<template>
  <etm-form
    ref="form"
    :model="form"
    type="dialog"
  >
    <el-form-item
      label="学期"
      prop="semester"
      :rules="formValidate.nullValueRule(true,'请选择学期')"
    >
      <el-select
        v-model="form.semester"
        placeholder="请选择学期"
        @change="changeSemester"
      >
        <el-option
          v-for="item in semesterOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item
      label="周次"
      prop="week"
      :rules="formValidate.nullValueRule(true,'请选择周次')"
    >
      <el-select
        v-model="form.week"
        placeholder="请选择周次"
        @change="changeWeek"
      >
        <el-option
          v-for="item in weekOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item
      label="年级"
      prop="grades"
      :rules="formValidate.nullValueRule(true,'请选择年级')"
    >
      <el-select
        v-model="form.grades"
        multiple
        filterable
        placeholder="请选择年级"
        @change="changeGrade"
      >
        <el-option
          v-for="item in gradeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
  </etm-form>
</template>

<script>
import baseMixin from '@/layout/mixin/baseMixin'
import formValidate from '@/utils/rules'

import { getSemesterSetting, getSemesterWeekSetting } from '@/api/newDaycare/listEduGuardScheduleManage'
import { getGrade } from '@/api/newDaycare/listEduGuardGradeManage'

export default {
  name: 'EditClass',
  components: {
  },
  mixins: [baseMixin],
  props: {
    type: {
      type: String,
      default: 'add',
      validator (val) {
        return ['add', 'edit'].includes(val)
      }
    },
    semesterId: {
      type: [Number, String],
      default: null
    }
  },
  data () {
    return {
      formValidate,
      form: {
        semester: '',
        // semesterName: '',
        grades: [],
        gradeNames: [],
        week: '',
        weekName: ''
      },
      semesterOptions: [],
      gradeOptions: [],
      weekOptions: []
    }
  },

  created () {
    this.getOptions()
    if (this.semesterId) {
      this.form.semester = this.semesterId
      this.getWeekData(this.semesterId)
    }
  },
  methods: {
    getOptions () {
      // 学期
      getSemesterSetting().then(res => {
        this.semesterOptions = this.convertDataToOptions(res.data, 'name', 'id')
      }).catch(err => {
        console.error(err)
      })

      // 年级
      const param = {
        paged: false
      }
      getGrade(param).then((res) => {
        this.gradeOptions = this.convertDataToOptions(res.data, 'name', 'id')
      }).catch(err => {
        console.error(err)
      })
    },
    // 学期改变
    changeSemester (id) {
      this.form.week = null
      this.form.weekName = null
      this.weekOptions = []
      this.getWeekData(id)
    },

    // 获取周次
    getWeekData (id) {
      const param = {
        courseTermId: id
      }
      getSemesterWeekSetting(param).then((res) => {
        if (res.data) {
          this.weekOptions = this.convertDataToOptions(res.data, 'name', 'id')
        }
      })
    },

    // 周次改变
    changeWeek (id) {
      let obj = {}
      obj = this.weekOptions.find((item) => {
        return item.value === id
      })
      this.form.weekName = obj.label
    },

    // 年级改变
    changeGrade (ids) {
      const names = []
      this.gradeOptions.map((val, index) => {
        if (ids.includes(val.value)) {
          names.push(val.label)
        }
      })
      this.form.gradeNames = names
    }
  }
}
</script>

<style scoped lang="scss">
.limit {
  color: $color-secondary;
}
</style>
