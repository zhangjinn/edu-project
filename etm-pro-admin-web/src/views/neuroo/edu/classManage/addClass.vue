<template>
  <etm-layout-split>
    <div class="addClass-wrap">
      <etm-form ref="form" class="form" :model="form" :rules="rules" style="flex: 1;overflow:auto;">
        <etm-title :border="false" size="14">基础信息</etm-title>
        <el-form-item label="园区:" prop="schoolId">
          <el-select v-model="form.schoolId" filterable placeholder="请选择园区" @change="changeSchool">
            <el-option
              v-for="(school, index) of schools"
              :key="index"
              :label="school.label"
              :value="school.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="班级名称:" prop="clazzName">
          <el-input v-model="form.clazzName" placeholder="请输入班级名称" />
        </el-form-item>
        <el-form-item label="适用月龄: ">
          <el-row type="flex">
            <el-col :span="11">
              <el-form-item prop="monthAgeStart" style="margin-bottom: 0;">
                <el-select v-model="form.monthAgeStart">
                  <el-option v-for="item in maxMonth" :key="item" :label="item+ '月'" :value="item" />
                </el-select>
              </el-form-item>

            </el-col>
            <el-col :span="2" style="text-align: center">至</el-col>
            <el-col :span="11">
              <el-form-item prop="monthAgeEnd" style="margin-bottom: 0;">
                <el-select v-model="form.monthAgeEnd">
                  <el-option v-for="item in maxMonth" :key="item" :label="item+ '月'" :disabled="item < form.monthAgeStart" :value="item" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="满班人数:" prop="fullNumber">
          <el-input v-model="form.fullNumber" placeholder="请输入满员人数" />
        </el-form-item>
        <el-form-item label="备注信息:" prop="">
          <el-input
            v-model="form.remarks"
            placeholder="请输入备注信息"
            type="textarea"
            maxlength="300"
            show-word-limit
            rows="4"
          />
        </el-form-item>
        <etm-title :border="false" size="14">人员配置</etm-title>
        <el-form-item label="老师:" prop="teacherIds">
          <el-select
            v-model="form.teacherIds"
            filterable
            multiple
            placeholder="请选择老师"
            @change="changeView"
          >
            <el-option
              v-for="item in teachers"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="班主任:" prop="headTeacherIds">
          <el-select
            v-model="form.headTeacherIds"
            filterable
            multiple
            placeholder="请选择班主任"
            @change="changeView"
          >
            <el-option
              v-for="item in headTeachers"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

      </etm-form>
      <etm-form-foot @save="save" @cancel="cancel" />

    </div>
  </etm-layout-split>
</template>

<script>
import { mapState } from 'vuex'
import { getEnumValueByKey } from '@/enums'
import { postClass, queryClazzByClazzId, updateClass } from '@/api/neuroo/edu/clazzManage'
import { queryEmployeeListByTagCode, querySubOrganizationList } from '@/api/base/base'
import baseMixin from '@/layout/mixin/baseMixin'
import { unique } from '@/utils/arrUtils'

/**
 *  2020/4/17 9:49
 *  haijinsha
 */
export default {
  name: 'AddClass',
  components: {},
  filters: {},
  mixins: [baseMixin],
  props: {},
  data() {
    return {
      maxMonth: getEnumValueByKey('MAX_MONTH'),
      teachers: [],
      headTeachers: [],
      customerSelect: [],
      schools: [],
      form: {
        schoolId: '',
        monthAgeStart: '',
        monthAgeEnd: '',
        fullNumber: 21,
        remarks: '',
        headTeacherIds: [],
        teacherIds: [],
        nurseryIds: [],
        customerIds: [],
        doctorIds: []
      },
      rules: {
        schoolId: { required: true, message: '请选择园区', trigger: 'change' },
        clazzName: { required: true, message: '请输入班级名称', trigger: 'blur' },
        monthAgeStart: { required: false, message: '请输入适用月龄', trigger: 'blur' },
        monthAgeEnd: { required: false, message: '请输入适用月龄', trigger: 'blur' },
        fullNumber: { required: true, message: '请输入满员人数', trigger: 'blur' },
        headTeacherIds: { required: true, message: '请选择班主任', trigger: 'change' },
        teacherIds: { required: true, message: '请选择老师', trigger: 'change' },
        nurseryIds: { required: true, message: '请选择保育员', trigger: 'change' },
        customerIds: { required: true, message: '请选择会员', trigger: 'change' },
        doctorIds: { required: true, message: '请选择儿保医生', trigger: 'change' }
      }
    }
  },
  computed: {
    ...mapState('neuroo/classManage', [`clazzId`])
  },
  watch: {},
  created() {
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      querySubOrganizationList({ tagCode: 'SCHOOL' }).then(res => {
        this.schools = this.convertDataToOptions(res.data, 'name', 'id')
      })
      // 有ID查询详情
      if (this.clazzId) {
        queryClazzByClazzId({ clazzId: this.clazzId }).then(res => {
          this.form = res.data
          const teachersOfClass = this.convertDataToOptions(res.data.teacherList, 'teacherName', 'teacherId')
          const headTeachersOfClass = this.convertDataToOptions(res.data.headTeacherList, 'headTeacherName', 'headTeacherId')
          this.form.teacherIds = res.data.teacherList.map(item => item.teacherId)
          this.form.headTeacherIds = res.data.headTeacherList.map(item => item.headTeacherId)

          queryEmployeeListByTagCode({ departmentId: this.form.schoolId, tagCode: 'TEACHER' }).then(res => {
            const teachers = this.convertDataToOptions(res.data, 'employeeName', 'employeeId')

            this.teachers = unique([...teachers, ...teachersOfClass], 'value')
          })
          queryEmployeeListByTagCode({ departmentId: this.form.schoolId, tagCode: 'HEAD_TEACHER' }).then(res => {
            const headTeachers = this.convertDataToOptions(res.data, 'employeeName', 'employeeId')
            this.headTeachers = unique([...headTeachers, ...headTeachersOfClass], 'value')
          })
        })
      } else {
        this.form = {
          schoolId: '',
          monthAgeStart: '',
          monthAgeEnd: '',
          fullNumber: 21,
          remarks: '',
          headTeacherIds: [],
          teacherIds: [],
          nurseryIds: [],
          customerIds: [],
          doctorIds: []
        }
      }
    },
    changeSchool() {
      this.form.headTeacherIds = []
      this.form.teacherIds = []
      queryEmployeeListByTagCode({ departmentId: this.form.schoolId, tagCode: 'TEACHER' }).then(res => {
        this.teachers = this.convertDataToOptions(res.data, 'employeeName', 'employeeId')
      })
      queryEmployeeListByTagCode({ departmentId: this.form.schoolId, tagCode: 'HEAD_TEACHER' }).then(res => {
        this.headTeachers = this.convertDataToOptions(res.data, 'employeeName', 'employeeId')
      })
    },
    save() {
      this.$refs['form'].$children[0].validate(valid => {
        if (valid) {
          const { schoolId, clazzName, monthAgeStart, monthAgeEnd, fullNumber, remarks, headTeacherIds, teacherIds } = this.form
          if (this.clazzId) {
            updateClass({
              clazzId: this.clazzId, clazzName, monthAgeStart, monthAgeEnd, fullNumber, remarks, headTeacherIds, teacherIds
            }).then(res => {
              this.$message.success('更新成功')
              this.cancel()
            })
          } else {
            postClass({
              schoolId,
              schoolName: this.schools.find(item => item.value === schoolId).label,
              clazzName,
              monthAgeStart,
              monthAgeEnd,
              fullNumber,
              remarks,
              headTeacherIds,
              teacherIds
            }).then(res => {
              this.$message.success('添加成功')
              this.cancel()
            })
          }
        }
      })
    },
    cancel() {
      this.$emit('jump', 'classManage')
    },
    changeView() {
      this.$forceUpdate()
    }
  }
}
</script>

<style lang="scss" scoped>
  .addClass-wrap {
    /*height: calc(100% - 60px);*/
    /*height: 100%;*/
    /*background-color: #fff;*/
    /*overflow: auto;*/
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    /*.form {*/
    /*  height: calc(100% - 56px);*/
    /*}*/

    & /deep/ .el-input, .el-textarea, .el-select {
      width: 100%;
    }

    & /deep/ .el-form-item__content {
      max-width: 500px;
    }

  }
</style>
