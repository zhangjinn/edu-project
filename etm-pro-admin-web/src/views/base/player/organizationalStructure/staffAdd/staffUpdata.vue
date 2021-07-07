<template>
  <div>
    <el-form ref="staffForm" :model="staffForm" label-width="100px" :rules="rules" class="demo-addCustomerForm">
      <el-row style="height: 100px">
        <el-col :span="10">
          <el-form-item label="账号" prop="accountName">
            <el-input v-model="staffForm.accountName" style="width: 200px" @change="changeAccount" />
          </el-form-item>
        </el-col>

        <el-col :span="10">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="staffForm.name" style="width: 200px" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row style="height: 100px">

        <el-col :span="10">
          <el-form-item label="任职组织" prop="servingSchoolId">
            <el-select
              v-model="staffForm.servingSchoolId"
              placeholder="请选择组织"
              @change="changeOrg"
            >

              <el-option
                v-for="item in organizationList"
                :key="item.value"
                :label="item.organizationName"
                :value="item.organizationId"
              />

            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="10">
          <el-form-item label="岗位">
            <el-cascader
              ref="postCascader"
              v-model="staffForm.fkPostIds"
              :options="postList"
              clearable
              placeholder="请选择岗位"
              :props="postProps"
            />
          </el-form-item>
        </el-col>

      </el-row>

      <el-row style="height: 100px">

        <el-col :span="10">
          <el-form-item label="任职部门">
            <el-cascader
              ref="departmentCas"
              v-model="staffForm.department"
              :options="departmentList"
              clearable
              placeholder="请选择部门"
              :props="orgProps"
            />
          </el-form-item>
        </el-col>

        <el-col :span="10">
          <el-form-item label="角色">
            <el-cascader
              ref="roletCascader"
              v-model="staffForm.fkRoleIds"
              :options="roleList"
              clearable
              placeholder="请选择角色"
              :props="roleProps"
            />
          </el-form-item>
        </el-col>

      </el-row>

      <el-row style="height: 100px">

        <el-col :span="10">
          <el-form-item label="性别">
            <el-radio-group v-model="staffForm.gender" style="width: 150px;">
              <el-radio :label="1">男</el-radio>
              <el-radio :label="2">女</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>

      </el-row>

    </el-form>

  </div>
</template>
<script>

import { checkPhone, getEmployees, getOrganizationTreeAll, getOrganizationTreeChild, updataEmployees } from '@/api/organization'
import { getPositionListByPostId, getPositionTree } from '@/api/post'
import { roleEnterprise } from '@/api/role'
import { getOrganizationId, getPersonId } from '@/utils/auth'

export default {
  name: 'StaffUpdata',
  // eslint-disable-next-line vue/require-prop-types
  props: ['currentStaff'],
  data() {
    var checkUser = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'))
      } else {
        const reg = /^1\d{10}$/
        if (reg.test(value)) {
          if (value !== this.currentStaff.accountName) {
            checkPhone(value).then(response => {
              if (response.data != null) {
                return callback(new Error('当前输入的账号已任职其他公司，如有疑问请联系当事人' + response.data.name))
              } else {
                callback()
              }
              setTimeout(() => {
              }, 1.5 * 1000)
            })
          } else {
            callback()
          }
        } else {
          return callback(new Error('请输入正确的手机号'))
        }
      }
    }
    const that = this
    return {
      staffForm: {
        updateType: 2,
        accountName: undefined, // 账号
        name: undefined, // 姓名
        servingSchoolId: undefined, // 任职校区
        department: [], // 部门
        fkPostIds: [], // 岗位
        fkRoleIds: [], // 角色
        gender: undefined,
        lastServingOrganizationId: undefined // 原先的组织id
      },

      orgTypeEntry: {
        type: 'department'
      },

      accountHasBeenUse: false,
      accountUser: undefined,

      organizationList: [],
      departmentList: [],
      roleList: [],
      postList: [],

      roleEntry: {
        enterprise: undefined
      },
      queryEntry: {
        personId: undefined
      },

      rules: {
        accountName: [{ required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkUser, trigger: 'blur' }],
        name: { required: true, message: '请输入员工名称', trigger: 'blur' },
        servingSchoolId: { required: true, message: '请选择员工任职校区', trigger: 'blur' }
      },

      orgProps: {
        checkStrictly: true,
        expandTrigger: 'hover',
        value: 'organizationId',
        label: 'organizationName',
        lazy: true,
        lazyLoad(node, resolve) {
          that.getOrganizationTreeChildNode(node, resolve)
        },
        children: 'children',
        hasChildren: 'hasChildren'
      },
      roleProps: {
        multiple: true,
        checkStrictly: true,
        expandTrigger: 'hover',
        value: 'id',
        emitPath: false,
        label: 'name'
      },
      postProps: {
        multiple: true,
        checkStrictly: true,
        expandTrigger: 'hover',
        value: 'positionId',
        label: 'positionName',
        emitPath: false,
        lazy: true,
        lazyLoad(node, resolve) {
          that.getPostTreeChildNode(node, resolve)
        },
        children: 'children',
        hasChildren: 'hasChildren'
      }
    }
  },
  created() {
    if (this.currentStaff !== undefined) {
      console.log(this.currentStaff)
      this.staffForm.accountName = this.currentStaff.accountName
      this.staffForm.name = this.currentStaff.name
      this.staffForm.lastServingOrganizationId = this.currentStaff.organizationId
      this.staffForm.gender = this.currentStaff.gender
      if (this.currentStaff.postList != null && this.currentStaff.postList.length > 0) {
        const array = []
        for (const index in this.currentStaff.postList) {
          array.push(this.currentStaff.postList[index].positionId)
        }
        this.staffForm.fkPostIds = array
      }
      if (this.currentStaff.roleList != null && this.currentStaff.roleList.length > 0) {
        const array = []
        for (const index in this.currentStaff.roleList) {
          array.push(this.currentStaff.roleList[index].id)
        }
        this.staffForm.fkRoleIds = array
      }
      const orgId = getOrganizationId()
      getEmployees(orgId, this.currentStaff.accountId).then(response => {
        if (response.code === 0) {
          this.staffForm.servingSchoolId = response.data.organizationId // 组织id
          const array = []
          array.push(response.data.servingSchoolId)
          this.staffForm.department = array
          this.$nextTick(() => {
            this.$refs.departmentCas.presentText = response.data.servingSchoolName
            this.$refs.departmentCas.inputValue = response.data.servingSchoolName
          })
          this.queryEntry.personId = getPersonId()
          this.getOrganizations(this.queryEntry)
        }
      })
    } else {
      this.queryEntry.personId = getPersonId()
      this.getOrganizations(this.queryEntry)
    }
  },
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.staffForm.department != null && this.staffForm.department !== undefined && this.staffForm.department.length > 0) {
            this.staffForm.servingSchoolId = this.staffForm.department[this.staffForm.department.length - 1]
          }
          updataEmployees(this.staffForm, this.currentStaff.accountId).then(response => {
            if (response.code === 0) {
              this.$emit('updataStaffSuccess')
            }
            setTimeout(() => {
            }, 1.5 * 1000)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOrganizations(entry) {
      getOrganizationTreeAll(entry).then(response => {
        this.organizationList = this.getCascad(response.data)

        const id = this.staffForm.servingSchoolId
        this.getPositionListById(id)
        this.roleEntry.enterprise = id
        this.getRoleEnterprise(this.roleEntry)
        this.getOrganizationTreeChild(id)

        setTimeout(() => {
        }, 1.5 * 1000)
      })
    },

    getPositionListById(id) {
      getPositionTree(id).then(response => {
        this.postList = this.getCascad(response.data)
        setTimeout(() => {
        }, 1.5 * 1000)
      })
    },

    getRoleEnterprise(params) {
      roleEnterprise(params).then(response => {
        this.roleList = response.data
        setTimeout(() => {
        }, 1.5 * 1000)
      })
    },

    getCascad(data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].children == null || data[i].children.length < 1) {
          data[i].children = undefined
        } else {
          this.getCascad(data[i].children)
        }
      }
      return data
    },
    changeOrg() {
      if (this.staffForm.fkPostIds !== undefined) {
        this.staffForm.fkPostIds = undefined
      }
      if (this.staffForm.fkRoleIds !== undefined) {
        this.staffForm.fkRoleIds = undefined
      }
      if (this.staffForm.department !== undefined) {
        this.staffForm.department = undefined
      }

      const id = this.staffForm.servingSchoolId

      this.getPositionListById(id)
      this.roleEntry.enterprise = id
      this.getRoleEnterprise(this.roleEntry)

      this.getOrganizationTreeChild(id)
    },

    getOrganizationTreeChild(id) {
      getOrganizationTreeChild(id, this.orgTypeEntry).then(response => {
        this.departmentList = response.data
        setTimeout(() => {
        }, 1.5 * 1000)
      })
    },

    getOrganizationTreeChildNode(node, resolve) {
      if (node.data !== undefined && node.children.length === 0 && node.data.hasChildren) {
        getOrganizationTreeChild(node.data.organizationId, this.orgTypeEntry).then(response => {
          resolve(response.data)
          setTimeout(() => {
          }, 1.5 * 1000)
        })
      } else {
        resolve(node.child)
      }
    },

    getPostTreeChildNode(node, resolve) {
      console.log(node)
      if (node.data !== undefined && node.children.length === 0 && node.data.hasChildren) {
        getPositionListByPostId(node.data.positionId).then(response => {
          resolve(response.data)
        })
      } else {
        resolve(node.children)
      }
    },

    getDepartmentList(id) {
      for (const index in this.organizationList) {
        if (id === this.organizationList[index].organizationId) {
          return this.organizationList[index].children
        }
      }
      return null
    },
    changeAccount(val) {
      const reg = /^1\d{10}$/
      if (reg.test(val)) {
        checkPhone(val).then(response => {
          if (response.data != null) {
            this.accountHasBeenUse = true
            this.accountUser = response.data
          } else {
            this.accountHasBeenUse = false
            this.accountUser = null
          }
          setTimeout(() => {
          }, 1.5 * 1000)
        })
      } else {
        this.accountHasBeenUse = false
        this.accountUser = null
      }
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
