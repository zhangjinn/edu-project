<template>
  <div class="addEmployee-wrap">
    <el-form ref="employee" :model="employeeData" :rules="employeeRule" label-width="100px">
      <el-form-item label="任职组织">
        <span>{{ currentOrganization.organizationName }}</span>
      </el-form-item>
      <el-form-item label="账号" prop="telephone">
        <el-input v-model="employeeData.telephone" />
      </el-form-item>

      <el-form-item label="姓名" prop="name">
        <el-input v-model="employeeData.name" />
      </el-form-item>
      <el-form-item label="角色" prop="roleIds">
        <el-select v-model="employeeData.roleIds" multiple>
          <el-option
            v-for="(item,index) of roleList"
            :key="index"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="岗位" prop="positionIds">
        <el-select v-model="employeeData.positionIds" multiple>
          <el-option
            v-for="(item,index) of positionList"
            :key="index"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门" prop="">
        <el-select v-model="employeeData.departmentId" clearable>
          <el-option
            v-for="(item,index) of departmentList"
            :key="index"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-radio v-model="employeeData.gender" label="MALE">男</el-radio>
        <el-radio v-model="employeeData.gender" label="FEMALE">女</el-radio>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { checkPhone } from '@/api/organization'
import { queryDepartmentSelect, queryPositionSelect, queryRoleSelect } from '@/api/employee'
import { getCurrentOrganizationObject } from '@/utils/auth'

/**
   *  2020/4/6 14:50
   *  haijinsha
   */
export default {
  name: 'AddEmployee',
  filters: {},
  mixins: [],
  props: {
    orgId: {
      type: [String, Number],
      required: true,
      default: ''
    },
    employee: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    const checkUser = async(rule, value, callback) => {
      if (!value) {
        callback(new Error('手机号不能为空'))
      } else {
        const reg = /^1\d{10}$/
        if (reg.test(value)) {
          await checkPhone(value).then(res => {
            if (res.data) {
              this.employeeData.name = res.data.name
              callback(new Error('当前输入的账号已任职其他公司，如有疑问请联系当事人' + res.data.name))
            } else {
              callback()
            }
          })
        } else {
          return callback(new Error('请输入正确的手机号'))
        }
      }
    }
    return {
      employeeData: this.employee,
      positionList: [],
      departmentList: [],
      roleList: [],
      employeeRule: {
        telephone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkUser }
        ],
        name: { required: true, message: '请输入员工姓名', trigger: 'blur' },
        roleIds: { required: true, message: '请选择角色', trigger: 'change' },
        positionIds: { required: true, message: '请选择岗位', trigger: 'change' },
        departmentId: { required: true, message: '请选择部门', trigger: 'change' },
        gender: { required: true, message: '请选择性别', trigger: 'change' }
      },
      currentOrganization: getCurrentOrganizationObject()
    }
  },
  computed: {},
  watch: {
    employee(val) {
      this.employeeData = val
    }
  },
  created() {
    this.init()
  },
  mounted() {

  },
  methods: {
    init() {
      // 角色下拉
      queryRoleSelect().then(res => {
        this.roleList = res.data
      })
      // 岗位下拉
      queryPositionSelect().then(res => {
        this.positionList = res.data
      })
      // 部门下拉
      queryDepartmentSelect().then(res => {
        this.departmentList = res.data
      })
    },
    validator() {
      return this.$refs['employee'].validate()
    },
    resetFields() {
      this.$refs['employee'].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
  .addEmployee-wrap {

    & /deep/ .el-input, .el-select {
      width: 100%;
    }

  }
</style>
