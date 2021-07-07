<template>
  <div class="index-wrap">
    <structure-a>
      <etm-title>组织架构</etm-title>
      <div class="org-row">
        <div class="left-box">
          <el-tree
            :data="treeData"
            lazy
            :expand-on-click-node="false"
            :load="loadNode"
            node-key="id"
            default-expand-all
            :props="defaultProps"
            @node-click="handleNodeClickOrg"
          >
            <span slot-scope="{ node, data }" class="custom-tree-node">
              <span :class="{'activeNodeName': currentNodeName === data.id}">
                <i :class="['iconfont', data.type === 'ENTERPRISE' ? 'icongongsi': 'iconzuzhijiagou']" />
                {{ data.name }}
                <template>
                  <!--企业-->
                  <el-dropdown v-if="data.type === 'ENTERPRISE'" trigger="hover" @command="command(node, data,$event)">
                    <span class="el-dropdown-link">
                      <i class="el-icon-arrow-down el-icon--right" />
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <!--<el-dropdown-item command="createOrg">新建企业</el-dropdown-item>-->
                      <el-dropdown-item command="editOrg">编辑企业</el-dropdown-item>
                      <!--<el-dropdown-item command="disableOrg">禁用企业</el-dropdown-item>-->
                      <el-dropdown-item command="createSubOrg">新建下级企业</el-dropdown-item>
                      <el-dropdown-item command="createDep">新建部门</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                  <!--部门-->
                  <el-dropdown v-if="data.type === 'DEPARTMENT'" trigger="hover" @command="command(node, data,$event)">
                    <span class="el-dropdown-link">
                      <i class="el-icon-arrow-down el-icon--right" />
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="editDep">编辑部门</el-dropdown-item>
                      <!--<el-dropdown-item command="deleteDep">删除部门</el-dropdown-item>-->
                      <el-dropdown-item command="createSubDep">新建子部门</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>

              </span>
              <span />
            </span>
          </el-tree>
        </div>
        <div class="right-box">
          <div class="card-box">
            <el-breadcrumb separator="/" class="bread">
              <el-breadcrumb-item v-for="(item) of breadcrumb" :key="item.id">{{ item.name }}</el-breadcrumb-item>
            </el-breadcrumb>
            <div class="card-wrap">
              <etm-card v-for="(dep) of departmentList" :key="dep.id" :data="dep" type="department" @next="handleNodeClickDep" />
              <etm-card v-for="(user) of userList" :key="user.id" :data="user" type="user" />
            </div>
          </div>
        </div>
      </div>

      <etm-pop
        pop="complex"
        :visible="addOrgVisible"
        :title="orgData.status === 'create' ? '新建组织' : '编辑组织'"
        @confirm="addOrgConfirm('addOrg')"
        @cancel="cancelOrg"
        @close="cancelOrg"
      >
        <add-org ref="addOrg" :org="orgData" />
      </etm-pop>
      <etm-pop
        pop="complex"
        :visible="addDepVisible"
        :title="depData.status === 'create' ? '新建部门' : '编辑部门'"
        @confirm="addDepConfirm('addDep')"
        @cancel="cancelDep"
        @close="cancelDep"
      >
        <add-dep ref="addDep" type="dep" :dep="depData" />
      </etm-pop>

      <etm-pop
        pop="complex"
        :visible="addSubDepVisible"
        :title="depData.status === 'create' ? '新建子部门' : '编辑子部门'"
        @confirm="addSubDepConfirm('addSubDep')"
        @cancel="cancelSubDep"
        @close="cancelSubDep"
      >
        <add-dep ref="addSubDep" type="subDep" :dep="depData" />
      </etm-pop>

      <etm-tip v-if="isDisableVisible" title="提示" content="确定禁用该企业吗?" :confirm="handleDisable" :cancel="() => { isDisableVisible = false }" />
      <etm-tip
        v-if="isDeleteDepVisible"
        type="error"
        title="提示"
        content="确定删除该部门吗?"
        :confirm="handleDeleteDep"
        :cancel="() => {isDeleteDepVisible =false }"
      />
    </structure-a>
  </div>
</template>

<script>
import EtmTitle from '@/layout/main/EtmTitle/src/EtmTitle'
import {
  addOrganization,
  getCurrentTop,
  queryDepartmentByCurrentOrg,
  queryEmployeeByCurrentOrg,
  queryOrganizationById,
  queryOrganizationOrDepartmentSelectOrList,
  updateOrganization
} from '@/api/organizationV2'
import EtmCard from '@/views/base/player/component/EtmCard'
import EtmPop from '@/layout/main/EtmPop/src/EtmPop'
import AddOrg from '@/views/base/organization/components/addOrg'
import EtmTip from '@/layout/main/EtmTip/src/EtmTip'
import AddDep from '@/views/base/organization/components/addDep'
import { addDepartment, queryDepartmentById, updateDepartment } from '@/api/departement'
import { getCurrentOrganizationObject } from '@/utils/auth'
import StructureA from '@/layout/main/structureA'

/**
   *  2020/4/7 14:16
   *  haijinsha
   */
export default {
  name: 'Index',
  components: { StructureA, AddDep, EtmTip, AddOrg, EtmPop, EtmCard, EtmTitle },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      currentNodeName: '',
      topInfo: {},
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      departmentList: [],
      userList: [],
      breadcrumb: [],
      addOrgVisible: false,
      orgData: {
        id: '',
        logo: '',
        name: '',
        address: '',
        organizationManager: '',
        telephone: '',
        status: '',
        solutionIdList: []
      },
      isDisableVisible: false,
      addDepVisible: false,
      depData: {
        organizationId: '',
        name: '',
        status: 'create'
      },
      isDeleteDepVisible: false,
      addSubDepVisible: false,
      currentNode: {},
      node: {},
      resolve: {}
    }
  },
  provide() {
    return {
      topInfo: this.topInfo,
      currentNode: this.currentNode
    }
  },
  computed: {},
  watch: {},
  created() {
    this.init()
  },
  mounted() {
  },
  methods: {
    init() {
      getCurrentTop().then(res => {
        this.$set(this.topInfo, 'data', res.data)
        console.log(res)
        this.treeData = []
        const currentOrganizationObject = getCurrentOrganizationObject()
        this.treeData.push({
          id: currentOrganizationObject.organizationId,
          name: currentOrganizationObject.organizationName,
          children: [],
          type: 'ENTERPRISE'
        })
        // queryOrganizationOrDepartmentSelectOrList({ id: res.data.topOrganizationId }).then(res => {
        //   this.treeData[0].children = res.data
        // })
        this.breadcrumb.push({
          id: currentOrganizationObject.organizationId,
          name: currentOrganizationObject.organizationName
        })
        queryEmployeeByCurrentOrg({ organizationId: currentOrganizationObject.organizationId }).then(res => {
          this.userList = res.data
        })

        queryDepartmentByCurrentOrg({ id: currentOrganizationObject.organizationId }).then(res => {
          this.departmentList = res.data
          console.log(res)
        })
      })
    },
    loadNode(node, resolve) {
      this.node = node
      this.resolve = resolve
      if (!node.data.id) {
        return resolve([])
      }
      queryOrganizationOrDepartmentSelectOrList({ id: node.data.id, organizationType: node.data.type }).then(res => {
        resolve(res.data)
      })
    },
    handleNodeClickOrg(data, node) {
      this.currentNodeName = data.id
      this.breadcrumb = []
      let nodeData = node
      while (nodeData.parent) {
        this.breadcrumb.unshift({ name: nodeData.data.name, id: nodeData.data.id })
        nodeData = nodeData.parent
      }
      /**
         * 1. 如果点击的是部门,那么就去获取该部门下的员工
         * 2. 如果点击的是企业,那么就去获取该企业下的部门
         */
      this.userList = []
      this.departmentList = []
      if (data.type === 'DEPARTMENT') {
        queryEmployeeByCurrentOrg({ organizationId: data.id }).then(res => {
          this.userList = res.data
        })
      } else if (data.type === 'ENTERPRISE') {
        queryDepartmentByCurrentOrg({ id: data.id }).then(res => {
          this.departmentList = res.data
          console.log(res)
        })
      }

      queryEmployeeByCurrentOrg({ organizationId: data.id }).then(res => {
        this.userList = res.data
      })

      queryDepartmentByCurrentOrg({ id: data.id }).then(res => {
        this.departmentList = res.data
        console.log(res)
      })
    },
    handleNodeClickDep(data) {
      console.log(data)
      this.breadcrumb.push({ name: data.name, id: data.id })
      queryEmployeeByCurrentOrg({ organizationId: data.id }).then(res => {
        this.userList = res.data
        this.departmentList = []
      })
    },
    // 企业部门下拉功能
    command(node, event, command) {
      if (node.level === 0) {
        const currentOrganizationObject = getCurrentOrganizationObject()
        this.$set(this.currentNode, 'data', {
          id: currentOrganizationObject.organizationId,
          name: currentOrganizationObject.organizationName
        })
      } else {
        this.$set(this.currentNode, 'data', node.parent.data)
      }

      // this.$set(this.parentNode, 'data', node.parent && node.parent.data)
      console.log('上级', node, event, command)
      this[command](event, node)
    },
    // 编辑企业
    editOrg(e, node) {
      this.$set(this.currentNode, 'data', node.data)
      queryOrganizationById({ organizationId: e.id }).then(res => {
        this.orgData = res.data
        this.orgData.status = 'edit'
      })
      this.addOrgVisible = true
    },
    // 禁用企业
    disableOrg() {
      this.isDisableVisible = true
    },
    // 禁用企业
    handleDisable() {
      this.isDisableVisible = false
      this.$message.info('接口开发中...')
    },
    // 新建下级企业
    createSubOrg(ev, node) {
      this.$set(this.currentNode, 'data', node.data)
      this.orgData.status = 'create'
      this.addOrgVisible = true
      this.$nextTick(() => {
        this.$refs['addOrg'].resetFields()
      })
    },
    // 新建部门
    createDep(ev, node) {
      this.$set(this.currentNode, 'data', node.data)
      this.depData.status = 'create'
      this.addDepVisible = true
    },
    // 编辑子部门
    editDep(event) {
      this.addDepVisible = true
      queryDepartmentById({ id: event.id }).then(res => {
        this.depData = res.data
        this.depData.status = 'edit'
      })
    },
    // 删除部门
    deleteDep() {
      this.isDeleteDepVisible = true
    },
    // 删除部门
    handleDeleteDep() {
      this.isDeleteDepVisible = false
      this.$message.info('接口开发中...')
    },
    // 新建子部门
    createSubDep(ev, node) {
      this.$set(this.currentNode, 'data', node.data)
      console.log(ev, node)
      this.addSubDepVisible = true
    },
    // 新建组织
    addOrgConfirm(ref) {
      console.log(123)
      this.$refs[ref].validator().then(res => {
        const { logo, name, organizationManager, address, telephone, id, solutionIdList } = this.orgData
        if (this.orgData.status === 'create') {
          addOrganization({ parentOrganizationId: this.currentNode.data.id, logo, name, address, organizationManager, telephone, solutionIdList }).then(res => {
            this.$message.success('新增组织成功')
            this.addOrgVisible = false
            // location.reload()
            this.init()
          })
        } else if (this.orgData.status === 'edit') {
          updateOrganization({ id, logo, name, address, solutionIdList }).then(res => {
            this.$message.success('更新组织成功')
            this.addOrgVisible = false
            // location.reload()
            this.init()
          })
        }
      })
    },
    // 新建部门
    addDepConfirm(ref) {
      this.$refs[ref].validator().then(res => {
        const { id, name } = this.depData
        const { id: organizationId } = this.currentNode.data
        if (this.depData.status === 'edit') {
          // 更新
          updateDepartment({ id, name }).then(res => {
            this.$message.success('更新部门成功')
            this.init()
          })
        } else if (this.depData.status === 'create') {
          addDepartment({ organizationId, name }).then(res => {
            this.$message.success('添加部门成功')
            this.init()
          })
        }
        this.addDepVisible = false
        this.$refs[ref].resetFields()
        this.loadNode(this.node, this.resolve)
      })
    },
    // 新建子部门
    addSubDepConfirm(ref) {
      this.$refs[ref].validator().then(res => {
        const { name } = this.depData
        const { id: organizationId } = this.currentNode.data
        addDepartment({ organizationId, name }).then(res => {
          this.$message.success('添加子部门成功')
          console.log(res)
          this.addSubDepVisible = false
          this.$refs[ref].resetFields()
        })
      })
      this.loadNode(this.node, this.resolve)
    },
    cancelOrg() {
      this.addOrgVisible = false
      this.$refs.addOrg.resetFields()
    },
    cancelDep() {
      this.addDepVisible = false
      this.$refs.addDep.resetFields()
    },
    cancelSubDep() {
      this.addSubDepVisible = false
      this.$refs.addSubDep.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
  .index-wrap {
    font-size: 14px;
    margin-top: 16px;

    .org-row {
      height: calc(100% - 73px);
      display: flex;
      padding-bottom: 24px;
      box-sizing: border-box;

      .left-box {
        width: 360px;
        padding-left: 24px;
        overflow: auto;

        & /deep/ .el-tree-node__content {
          height: 40px;
        }

        & /deep/ .activeNodeName {
          @include c-main_color();
          /*color: $main-color;*/
        }
      }

      .right-box {
        flex: 1;
        padding-left: 24px;
        overflow: auto;
        border-left: 1px solid #f4f4f4;

        .card-box {
          height: inherit;
          overflow: auto;
          .card-wrap{
            padding-right: 50%;
          }

          & /deep/ .bread {
            display: flex;
            align-items: center;
            height: 40px;
          }

          & /deep/ .el-breadcrumb {
            .el-breadcrumb__item {
              .el-breadcrumb__inner, .el-breadcrumb__separator {
                color: $secondary-color;
              }

              &:last-child {
                .el-breadcrumb__inner {
                  color: $text-color;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
