<template>
  <etm-form ref="form" :model="form" type="dialog">
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
      label="年级"
      prop="grade"
      :rules="formValidate.nullValueRule(true,'请选择年级')"
    >
      <el-select v-model="form.grade" placeholder="请选择年级">
        <el-option
          v-for="item in gradeOptions"
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
      <el-select v-model="form.week" placeholder="请选择周次">
        <el-option
          v-for="item in weekOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item
      label="课程科目"
      prop="courseSubjects"
      :rules="formValidate.nullValueRule(true,'请选择课程科目')"
    >
      <el-select v-model="form.courseSubjects" placeholder="请选择课程科目">
        <el-option
          v-for="item in courseSubjectsOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item
      label="课程名称"
      prop="courseTitle"
      :rules="formValidate.nullValueRule(true,'请输入课程名称')"
    >
      <el-input
        v-model="form.courseTitle"
        maxlength="10"
        placeholder="请输入课程名称"
      />
    </el-form-item>

    <el-form-item
      label="课程图片"
      prop="previewSrcLists"
    >
      <etm-upload-img
        :resource-name="'guardcare/materialManage'"
        :preview-src-list="form.previewSrcLists"
        :preview-src-key="form.previewSrcKey"
        :limit="9"
        @getImgList="getImgList"
      />
    </el-form-item>

    <el-form-item
      label="课程简介"
      prop="desc"
    >
      <el-input
        v-model="form.desc"
        type="textarea"
        :rows="3"
        placeholder="请输入课程简介"
      />
    </el-form-item>

    <el-form-item label="是否启用">
      <el-radio-group v-model="form.enable">
        <el-radio label="1">是</el-radio>
        <el-radio label="2">否</el-radio>
      </el-radio-group>
    </el-form-item>

  </etm-form>
</template>

<script>
import formValidate from '@/utils/rules'
import { getImgUrlRelativePath } from '@/utils'
import baseMixin from '@/layout/mixin/baseMixin'
import etmUploadImg from '@/components/EtmUploadImg/index'
// import { getSemesterSetting, getSemesterWeekSetting, getSubjectSetting } from '@/api/guardcare/edu/scheduleManage'
import { getSemesterSetting, getSemesterWeekSetting, getSubjectSetting } from '@/api/newDaycare/listEduGuardScheduleManage'
// import { getGrade } from '@/api/guardcare/edu/gradeManage'
import { getGrade } from '@/api/newDaycare/listEduGuardGradeManage'
// import { getCourseClazzItem } from '@/api/guardcare/edu/courseManage'
import { getCourseClazzItem } from '@/api/newDaycare/listEduGuardCourseManage'
export default {
  name: 'EditClass',
  components: {
    etmUploadImg
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
    }
  },
  data() {
    return {
      formValidate,
      form: {
        semester: '',
        grade: '',
        week: '',
        courseSubjects: '',
        courseTitle: '',
        previewSrcLists: [],
        previewSrcKey: [],
        desc: '',
        enable: '1'
      },
      semesterOptions: [],
      gradeOptions: [],
      weekOptions: [],
      courseSubjectsOptions: []

    }
  },
  created() {
    this.getOptions()
    if (this.type === 'edit') {
      this.init()
    }
  },
  methods: {
    getOptions() {
      // 学期
      getSemesterSetting().then(res => {
        this.semesterOptions = []
        res.data.forEach(v => {
          this.semesterOptions.push({
            label: `${v.name}`,
            value: v.id
          })
        })
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

      // 课程科目
      getSubjectSetting().then(res => {
        this.courseSubjectsOptions = this.convertDataToOptions(res.data, 'name', 'id')
      }).catch(err => {
        console.error(err)
      })
    },

    // 学期改变
    changeSemester(id) {
      this.form.week = null
      this.weekOptions = []
      this.getWeekData(id)
    },

    // 周次
    getWeekData(id) {
      const param = {
        courseTermId: id
      }
      getSemesterWeekSetting(param).then((res) => {
        if (res.data) {
          this.weekOptions = this.convertDataToOptions(res.data, 'name', 'id')
        }
      })
    },

    init() {
      const id = this.itemId
      getCourseClazzItem({ id }).then((res) => {
        const { data } = res
        this.changeSemester(data.courseTermId)
        this.form = {
          semester: data.courseTermId,
          grade: data.gradeId,
          week: data.courseTermWeekId,
          courseSubjects: data.courseSubjectId,
          courseTitle: data.name,
          previewSrcLists: [],
          previewSrcKey: [],
          desc: data.introduction,
          enable: data.enable ? '1' : '2'
        }

        if (data.attachment) {
          data.attachment.forEach(item => {
            this.form.previewSrcLists.push(item.url)
            this.form.previewSrcKey.push(getImgUrlRelativePath(item.url))
          })
        }
      })
    },
    getImgList(val, key) {
      this.form.previewSrcLists = val
      this.form.previewSrcKey = key
    }
  }
}
</script>

<style scoped lang="scss">
.tip{
  margin-bottom: 24px;
}
</style>
