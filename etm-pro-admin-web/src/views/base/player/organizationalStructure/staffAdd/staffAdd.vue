<template>
  <div>
    <el-form ref="staffForm" :model="staffForm" label-width="100px" :rules="rules" class="demo-addCustomerForm">
      <el-form-item label="任职组织" prop="org">
        <el-input v-model="staffForm.org" disabled />
      </el-form-item>
      <el-form-item label="账号" prop="accountName">
        <el-input
          v-model="staffForm.accountName"
          maxlength="11"
          @change="changeAccount"
        />
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="staffForm.name" />
      </el-form-item>

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

      <el-form-item label="性别">
        <el-radio-group v-model="staffForm.sex">
          <el-radio label="男" value="1" />
          <el-radio label="女" value="0" />
        </el-radio-group>
      </el-form-item>

    </el-form>

  </div>
</template>
<script>

import { getOrganizationTreeAll, getOrganizationTreeChild, addEmployees, checkPhone } from '@/api/organization'
import { getPositionTree, getPositionListByPostId } from '@/api/post'
import { roleEnterprise } from '@/api/role'
import { getPersonId } from '@/utils/auth'

export default {
  name: 'OrganizationAdd',

  data() {
    var checkUser = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'))
      } else {
        const reg = /^1\d{10}$/
        if (reg.test(value)) {
          checkPhone(value).then(response => {
            if (response.data != null) {
              this.staffForm.name = response.data.name
              callback(new Error('当前输入的账号已任职其他公司，如有疑问请联系当事人' + response.data.name))
            } else {
              callback()
            }
            setTimeout(() => {
            }, 1.5 * 1000)
          })
        } else {
          return callback(new Error('请输入正确的手机号'))
        }
      }
    }
    const that = this
    return {
      staffForm: {
        accountName: undefined, // 账号
        name: undefined, // 姓名
        password: undefined, // 密碼
        servingSchoolId: undefined, // 任职校区
        department: undefined, // 部门
        fkPostIds: undefined, // 岗位
        fkRoleIds: undefined, // 角色
        gender: undefined
      },

      orgTypeEntry: {
        type: 'department'
      },

      accountHasBeenUse: false,
      accountUser: undefined,

      organizationList: undefined,
      departmentList: undefined,
      roleList: undefined,
      postList: undefined,

      roleEntry: {
        enterprise: undefined
      },
      queryEntry: {
        personId: undefined
      },

      rules: {
        accountName: [{ required: true, message: '请输入手机号', trigger: 'blur' },
          { required: false, validator: checkUser, trigger: 'blur' }],
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
  watch: {
    staffForm: {
      handler: function(val) {
      },
      deep: true
    }
  },
  created() {
    this.queryEntry.personId = getPersonId()
    this.getOrganizations(this.queryEntry)
  },
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          /* if (this.staffForm.servingSchoolId != null && this.staffForm.servingSchoolId.length > 0) {
                            this.staffForm.servingSchoolId = this.staffForm.servingSchoolId[this.staffForm.servingSchoolId.length - 1]
                          }*/
          if (this.staffForm.department !== null && this.staffForm.department !== undefined && this.staffForm.department.length > 0) {
            this.staffForm.servingSchoolId = this.staffForm.department[this.staffForm.department.length - 1]
          }
          /* // 部门取最后一个
                          if (this.staffForm.fkPostIds != null && this.staffForm.fkPostIds.length > 0) {
                            this.staffForm.fkPostIds.push(this.staffForm.fkPostIds[this.staffForm.fkPostIds.length - 1])
                          }*/
          addEmployees(this.staffForm).then(response => {
            if (response.code === 0) {
              this.$emit('addStaffSuccess')
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
        if (data[i].children === null || data[i].children.length < 1) {
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
      if (node.children.length === 0 && node.data.hasChildren) {
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
      if (node.children && node.children.length === 0 && node.data.hasChildren) {
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
          if (response.data !== null) {
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
