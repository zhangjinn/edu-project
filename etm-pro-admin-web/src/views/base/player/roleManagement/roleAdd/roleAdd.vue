<template>
  <div class="addRole">
    <el-form ref="addCustomerForm" :model="addCustomerForm" label-width="100px" :rules="rules">
      <span class="title">填写角色信息</span>
      <el-row style="height: 100px ; padding-top: 10px">
        <el-col :span="10">
          <el-form-item label="角色名称：" prop="name">
            <el-input v-model="addCustomerForm.name" style="width: 250px" />
          </el-form-item>

        </el-col>

        <el-col :span="10">
          <el-form-item label="角色描述：">
            <el-input v-model="addCustomerForm.description" style="width: 250px" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row style="height: 100px ; padding-top: 10px">
        <el-col :span="24">
          <el-form-item label="数据权限：" prop="type">
            <el-radio-group v-model="addCustomerForm.type" @change="changType">
              <el-radio :label="'MYSELF'">仅本人数据</el-radio>
              <el-radio :label="'DEPARTMENT'">本部门及以下部门数据</el-radio>
              <el-radio :label="'COMPANY'">本企业及以下部门数据</el-radio>
              <el-radio :label="'CUSTOMIZE'" @click.native.prevent="showDialog">自定义数据范围</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <span class="title">选择角色权限</span>
      <el-row>
        <el-col :span="24">
          <resource-tree-new
            ref="resourceList"
            :select-list="addCustomerForm.resourceIds"
            style="margin-left: 18px ; padding-top: 10px"
          />
        </el-col>
      </el-row>
    </el-form>

    <div>
      <small-window
        :visible="resourceDialog"
        :title="'数据权限配置'"
        :btn-text="'确定'"
        @close="closeSmall"
        @btnClick="click"
      >
        <el-tree
          ref="resourceTree"
          :props="props"
          :load="loadNode"
          lazy
          show-checkbox
          @check-change="handleCheckChange"
        />
      </small-window>
    </div>

  </div>
</template>

<script>

import { getOrganizationTreeChild } from '@/api/organization'
import { addRole, enterpriseResourcde, getRole, updateRole } from '@/api/role'
import { getOrganization, getOrganizationId } from '@/utils/auth'
import resourceTreeNew from './resourceTreeNew'
import smallWindow from '../../../../../layout/main/smallWindow'

export default {
  name: 'RoleAdd',
  components: { resourceTreeNew, smallWindow },
  props: ['currentRoleId', 'currentRole'],
  data() {
    return {
      resourceDialog: false,
      school: undefined,
      treeProps: {
        label: 'name',
        children: 'children'
      },
      addCustomerForm: {
        name: undefined,
        description: undefined,
        resourceIds: [],
        enterpriseIds: undefined,
        roleId: undefined,
        type: '',
        organizationIds: []
      },
      authorityList: undefined,
      organizationList: [],
      props: {
        id: 'organizationId',
        label: 'organizationName',
        children: 'children'
      },
      orgTypeEntry: {
        type: 'department'
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      selectProps: {
        multiple: true,
        checkStrictly: true,
        expandTrigger: 'hover',
        value: 'organizationId',
        label: 'organizationName',
        emitPath: false
      },
      rules: {
        name: { required: true, message: '请输入角色名称', trigger: 'blur' },
        type: { required: true, message: '请编辑角色的数据权限', trigger: 'blur' }
      }
    }
  },
  created() {
    if (this.currentRole != null && this.currentRole !== undefined) {
      this.addCustomerForm.name = this.currentRole.name
      this.addCustomerForm.roleId = this.currentRole.id
      this.addCustomerForm.description = this.currentRole.description
      this.addCustomerForm.type = this.currentRole.type

      getRole(this.currentRole.id).then(response => {
        // 获取角色详情
        if (response.code === 0 && response.data.resources != null) {
          // 当前角色不为空
          console.log(response.data)
          this.addCustomerForm.type = response.data.dataPrivileges[0].type
          this.addCustomerForm.organizationIds = response.data.dataPrivileges[0].organizationIds
          for (const index in response.data.resources) {
            for (const childIndex in response.data.resources[index].children) {
              this.addCustomerForm.resourceIds.push(response.data.resources[index].children[childIndex].id)
            }
          }
          console.log(this.addCustomerForm.resourceIds)
          this.$refs.resourceList.setCurrentList()
        }
        setTimeout(() => {
        }, 1.5 * 1000)
      })
    }

    const id = getOrganizationId()
    this.getEnterpriseResourcde(id)

    const tree = getOrganization()
    this.organizationList.push(tree[0])
  },
  methods: {
    getEnterpriseResourcde(id) {
      enterpriseResourcde(id).then(response => {
        this.authorityList = response.data
        setTimeout(() => {
        }, 1.5 * 1000)
      })
    },
    getCascad(data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].children.length < 1) {
          data[i].children = undefined
        } else {
          this.getCascad(data[i].children)
        }
      }
      return data
    },
    sure(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const array = []
          array.push(getOrganizationId())

          this.addCustomerForm.enterpriseIds = array
          this.addCustomerForm.resourceIds = this.$refs.resourceList.getSelectList()

          if (this.addCustomerForm.type === 'CUSTOMIZE') {
            // 当前是自定义数据部分
            this.addCustomerForm.organizationIds = this.getSelectResourceList()
          }

          if (this.addCustomerForm.roleId === undefined) {
            addRole(this.addCustomerForm).then(response => {
              console.log('sure')
              if (response.code === 0) {
                this.$emit('addSuccess')
              }
              setTimeout(() => {
              }, 1.5 * 1000)
            })
          } else {
            updateRole(this.addCustomerForm).then(response => {
              if (response.code === 0) {
                this.$emit('addSuccess')
              }
              setTimeout(() => {
              }, 1.5 * 1000)
            })
          }
        }
      })
    },
    closeSmall() {
      this.resourceDialog = false
    },
    click() {
      this.resourceDialog = false
    },
    changType(val) {
      if (val === 'CUSTOMIZE') {
        this.resourceDialog = true
      }
    },
    showDialog() {
      this.addCustomerForm.type = 'CUSTOMIZE'
      this.resourceDialog = true
    },
    loadNode(node, resolve) {
      console.log(node)
      if (node.level === 0) {
        return resolve(this.organizationList)
      }
      if (node.childNodes == null || node.childNodes.length === 0) {
        getOrganizationTreeChild(node.data.organizationId, this.orgTypeEntry).then(response => {
          resolve(response.data)
        })
      } else {
        resolve(node.children)
      }
    },
    handleCheckChange() {

    },
    getSelectResourceList() {
      const array = this.$refs.resourceTree.getCheckedNodes()
      const idArray = []
      if (array !== undefined && array.length > 0) {
        for (const index in array) {
          idArray.push(array[index].organizationId)
        }
      }
      return idArray
    }
  }
}

</script>

<style lang="scss" scoped>

  @import "src/styles/variables";
  @import "~@/styles/mixin.scss";
  .addRole{

    .title{
      @include c_themeColor();
      font-size: $title-font-size;
      padding-left: 18px;
      margin-bottom: 10px;
    }

  }

</style>
