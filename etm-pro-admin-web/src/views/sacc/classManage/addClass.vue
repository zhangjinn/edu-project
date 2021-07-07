<template>
  <etm-layout-split>
    <div class="addClass-wrap">
      <etm-form ref="form" class="form" :model="form" :rules="rules" style="flex: 1;overflow:auto;">
        <etm-title :border="false" size="14">{{ clazzId ? '修改班级' : '新增班级' }}</etm-title>
        <el-form-item label="班级名称:" prop="clazzName">
          <el-input v-model="form.clazzName" placeholder="请输入班级名称" />
        </el-form-item>
        <!-- <el-form-item label="适用月龄: " required>
          <el-row type="flex">
            <el-col :span="11">
              <el-form-item prop="monthAgeStart">
                <el-select v-model="form.monthAgeStart">
                  <el-option v-for="item in maxMonth" :key="item" :label="item+ '月'" :value="item" />
                </el-select>
              </el-form-item>

            </el-col>
            <el-col :span="2" style="text-align: center">至</el-col>
            <el-col :span="11">
              <el-form-item prop="monthAgeEnd">
                <el-select v-model="form.monthAgeEnd">
                  <el-option v-for="item in maxMonth" :key="item" :label="item+ '月'" :disabled="item < form.monthAgeStart" :value="item" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item> -->
        <el-form-item label="满班人数:">
          <el-input v-model="form.fullNumber" placeholder="请输入满班人数" />
        </el-form-item>

        <!-- <etm-title :border="false" size="14">人员配置</etm-title> -->
        <el-form-item label="班主任:">
          <el-select
            v-model="form.headTeacherIds"
            multiple
            placeholder="请选择班主任"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="授课老师:">
          <el-select
            v-model="form.teacherIds"
            multiple
            placeholder="请选择授课老师"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="保育员:" prop="nurseryIds">
          <el-select
            v-model="form.nurseryIds"
            multiple
            placeholder="请选择保育员"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="儿保医生:" prop="doctorIds">
          <el-select
            v-model="form.doctorIds"
            multiple
            placeholder="请选择儿保医生"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item label="会员:">
          <el-select
            v-model="form.customerIds"
            multiple
            placeholder="请选择会员"
          >
            <el-option
              v-for="item in customerSelect"
              :key="item.customerId"
              :label="item.customerName"
              :value="item.customerId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注:">
          <el-input v-model="form.remark" placeholder="请输入备注信息" type="textarea" rows="4" />
        </el-form-item>
        <!--<el-form-item>-->
        <!--  <el-button type="primary" @click="save">确定</el-button>-->
        <!--  <el-button class="etm-button-plain" @click="cancel">取消</el-button>-->
        <!--</el-form-item>-->

      </etm-form>
      <etm-form-foot @save="save" @cancel="cancel" />
    </div>
  </etm-layout-split>

</template>

<script>
import { queryEmployeeSelectAll } from '@/api/employee'
import { queryCustomerAndNoClass } from '@/api/sacc'
import { addClazz, queryClazzDetailById, updateClazz } from '@/api/clazz'
import { mapState } from 'vuex'
import { getEnumValueByKey } from '@/enums'

/**
   *  2020/4/17 9:49
   *  haijinsha
   */
export default {
  name: 'AddClass',
  components: {},
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      maxMonth: getEnumValueByKey('MAX_MONTH'),
      options: [],
      customerSelect: [],
      form: {
        clazzName: '',
        monthAgeStart: '',
        monthAgeEnd: '',
        fullNumber: '',
        remark: '',
        headTeacherIds: [],
        teacherIds: [],
        nurseryIds: [],
        customerIds: [],
        doctorIds: []
      },
      rules: {
        clazzName: { required: true, message: '请输入班级名称', trigger: 'blur' },
        monthAgeStart: { required: true, message: '请输入适用月龄', trigger: 'blur' },
        monthAgeEnd: { required: true, message: '请输入适用月龄', trigger: 'blur' },
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
    ...mapState('clazz', [`clazzId`])
  },
  watch: {},
  created() {
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      // if (!this.clazzId) {
      //   return this.cancel()
      // }
      queryEmployeeSelectAll({ clazzId: this.clazzId }).then(res => {
        this.options = res.data
      })

      if (this.clazzId) {
        queryCustomerAndNoClass({ clazzId: this.clazzId }).then(res => {
          this.customerSelect = res.data
        })
        queryClazzDetailById({ clazzId: this.clazzId }).then(res => {
          const { data } = res
          data.headTeacherIds = []
          data.teacherIds = []
          data.customerIds = []
          data.headTeacherList.forEach(v => {
            data.headTeacherIds.push(v.headTeacherId)
          })
          data.teacherList.forEach(v => {
            data.teacherIds.push(v.teacherId)
          })
          data.customerList.forEach(v => {
            data.customerIds.push(v.customerId)
          })
          this.form = data
        })
      } else {
        queryCustomerAndNoClass({ clazzId: '' }).then(res => {
          this.customerSelect = res.data
        })
      }
    },
    save() {
      this.$refs['form'].$children[0].validate(valid => {
        if (valid) {
          const { clazzName, fullNumber, remark, headTeacherIds, teacherIds, customerIds } = this.form
          if (this.clazzId) {
            updateClazz({
              clazzId: this.clazzId, clazzName, fullNumber, remark, headTeacherIds, teacherIds, customerIds
            }).then(res => {
              this.$message.success('更新成功')
              this.cancel()
            })
          } else {
            addClazz({ clazzName, fullNumber, remark, headTeacherIds, teacherIds, customerIds }).then(res => {
              this.$message.success('添加成功')
              this.cancel()
            })
          }
        }
      })
    },
    cancel() {
      this.$emit('jump', 'classManage')
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
