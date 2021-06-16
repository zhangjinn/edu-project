<template>
  <etm-form
    ref="form"
    :model="form"
    type="dialog"
  >
    <el-form-item
      label="年级"
      prop="gradeName"
      :rules="formValidate.nullValueRule(true,'请选择年级')"
    >
      <el-select
        v-model="form.gradeName"
        placeholder="请选择年级"
      >
        <el-option
          v-for="item in gradeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <div
      v-for="(domain, index) in form.domains"
      :key="domain.key"
      class="classItem"
    >
      <el-form-item
        :prop="'domains.' + index + '.clazzName'"
        :rules="formValidate.nullValueRule(true,'请输入班级名称')"
        label="班级名称"
      >
        <el-input
          v-model="domain.clazzName"
          maxlength="10"
          class="classInput"
          placeholder="请输入班级名称"
        />
        <!--<div class="icon">-->
        <etm-font-icon
          v-if="index===0"
          class="icon"
          @click.native="addClass()"
        />
        <etm-font-icon
          v-else
          class="icon"
          :name="'minus'"
          @click.native="removeClass(domain)"
        />
        <!--</div>-->
      </el-form-item>
      <el-form-item
        :prop="'domains.' + index + '.headTeacher'"
        label="班主任"
      >
        <el-select
          v-model="domain.headTeacher"
          multiple
          collapse-tags
          placeholder="请选择班主任"
          @change="changeTeacher(domain.headTeacher,index,'headTeacher')"
        >
          <el-option
            v-for="item in teacherOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        :prop="'domains.' + index + '.teacher'"
        label="老师"
      >
        <el-select
          v-model="domain.teacher"
          multiple
          collapse-tags
          placeholder="请选择老师"
          @change="changeTeacher(domain.teacher,index,'teacher')"
        >
          <el-option
            v-for="item in teacherOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </div>
  </etm-form>
</template>

<script>
import baseMixin from '@/layout/mixin/baseMixin'
import formValidate from '@/utils/rules'
import EtmFontIcon from '@/components/EtmFontIcon'
import { getEmployeeAll } from '@/api/customer'
import { getGrade } from '@/api/newDaycare/listEduGuardGradeManage'
export default {
  name: 'EditClass',
  components: {
    EtmFontIcon
  },
  mixins: [baseMixin],
  data () {
    return {
      formValidate,
      form: {
        gradeName: '',
        domains: [
          {
            clazzName: '',
            headTeacher: '',
            teacher: '',
            headTeacherInfo: [],
            teacherInfo: []
          }
        ]
      },
      gradeOptions: [],
      teacherOptions: []

    }
  },
  created () {
    this.getGradeList()
    this.getEmployeeAllData()
  },
  methods: {
    // 获取年级列表
    getGradeList () {
      const param = {
        paged: false
      }
      getGrade(param).then((res) => {
        this.gradeOptions = this.convertDataToOptions(res.data, 'name', 'id')
      })
    },

    // 获取市场人员
    getEmployeeAllData () {
      getEmployeeAll().then((res) => {
        this.teacherOptions = this.convertDataToOptions(res.data, 'name', 'id')
      })
    },
    addClass () {
      this.form.domains.push({
        clazzName: '',
        headTeacher: [],
        teacher: [],
        headTeacherInfo: [],
        teacherInfo: [],
        key: Date.now()
      })
    },
    removeClass (item) {
      const index = this.form.domains.indexOf(item)
      if (index !== -1) {
        this.form.domains.splice(index, 1)
      }
    },

    changeTeacher (idArr, index, type) {
      const arr = []
      let obj = {}
      idArr.map((val) => {
        obj = this.teacherOptions.find((item) => {
          return item.value === val
        })
        arr.push(obj)
      })
      if (type === 'headTeacher') {
        this.form.domains[index].headTeacherInfo = arr
      } else if (type === 'teacher') {
        this.form.domains[index].teacherInfo = arr
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .classInput {
    width: 94% !important;
  }

  .classItem {
    position: relative;

    .icon {
      position: absolute;
      right: -12px;
      top: 9px;
    }
  }
</style>
