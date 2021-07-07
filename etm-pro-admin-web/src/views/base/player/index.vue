<template>
  <div class="player-index">
    <structure-a>
      <etm-title>员工管理</etm-title>
      <div class="player-row">
        <div
          class="left-box"
        >
          <div class="orgtable">
            <el-tree
              lazy
              :load="loadNode"
              :expand-on-click-node="false"
              :props="defaultProps"
              default-expand-all
              @node-click="handleCurrentChange"
            >
              <span slot-scope="{ node, data }" class="custom-tree-node">
                <span :class="{'activeNodeName': currentNodeName === data.id}">
                  <i :class="['iconfont', data.type === 'ENTERPRISE' ? 'icongongsi': 'iconzuzhijiagou']" />
                  <span>{{ data.name }}</span>
                  <template>
                    <!--部门-->
                    <el-dropdown trigger="hover" @command="command(node, data,$event)">
                      <span class="el-dropdown-link">
                        <i class="el-icon-arrow-down el-icon--right" />
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-if="data.type !== 'ENTERPRISE'" command="editDep">编辑部门</el-dropdown-item>
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
        </div>
        <div v-if="showOrgDetail" class="right-box">
          <div class="container">
            <div class="company-info">
              <div class="company-name">
                <!--                六米科技(1人)-->
                {{ currentRow.name }}
                <!--({{ organizationCount }})人-->
              </div>
              <!--              <div class="company-addr">-->
              <!--                <span class="el-icon-location" />-->
              <!--                {{ currentRow.organizationAddress }}-->
              <!--              </div>-->
            </div>
            <el-tabs v-model="activeName" @tab-click="changeMenu">
              <el-tab-pane label="员工" name="employee" />
              <el-tab-pane label="角色" name="role" />
              <el-tab-pane label="岗位" name="post" />
            </el-tabs>
          </div>
          <div class="content-box">
            <player-employee
              v-if="activeName === 'employee'"
              :org-name="currentRow.name"
              :org-id="currentRow.id"
            />
            <player-role
              v-if="activeName === 'role'"
              :org-name="currentRow.name"
              :org-id="currentRow.id"
            />
            <player-post
              v-if="activeName === 'post'"
              :org-name="currentRow.name"
              :org-id="currentRow.id"
            />
          </div>
        </div>
      </div>
      <etm-pop
        pop="complex"
        :visible="addDepVisible"
        :title="depData.status === 'create' ? '新建部门' : '编辑部门'"
        @confirm="addDepConfirm('addDep')"
        @cancel="addDepVisible = false"
        @close="addDepVisible = false"
      >
        <add-dep ref="addDep" type="dep" :dep="depData" />
      </etm-pop>

      <etm-pop
        pop="complex"
        :visible="addSubDepVisible"
        :title="depSubData.status === 'create' ? '新建子部门' : '编辑子部门'"
        @confirm="addSubDepConfirm('addSubDep')"
        @cancel="addSubDepVisible = false"
        @close="addSubDepVisible = false"
      >
        <add-dep ref="addSubDep" type="subDep" :dep="depSubData" />
      </etm-pop>

    </structure-a>
  </div>
</template>

<script>
import structureA from '../../../layout/main/structureA'
import PlayerRole from '@/views/base/player/component/PlayerRole'
import PlayerEmployee from '@/views/base/player/component/PlayerEmployee'
import PlayerPost from '@/views/base/player/component/PlayerPost'
import EtmTitle from '@/layout/main/EtmTitle/src/EtmTitle'
import EtmPop from '@/layout/main/EtmPop/src/EtmPop'
import AddDep from '@/views/base/organization/components/addDep'
import { addDepartment, updateDepartment } from '@/api/departement'
import { getCurrentOrganizationObject } from '@/utils/auth'
import { queryDepartmentSelectList } from '@/api/employee'

export default {
  name: 'OrientationTab',
  components: {
    AddDep,
    EtmPop,
    EtmTitle,
    PlayerPost,
    PlayerEmployee,
    PlayerRole,
    structureA
  },
  provide() {
    return {
      currentNode: this.currentNode
    }
  },
  data() {
    const checkUser = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'))
      } else {
        const reg = /^1\d{10}$/
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error('请输入正确的手机号'))
        }
      }
    }
    const that = this
    return {
      loading: false,
      currentNodeName: '',
      activeName: 'employee',
      orgVisible: true,
      roleVisible: false,
      postVisible: false,
      showOrgDetail: true,
      addOrg: false,
      addEntity: {
        organizationName: undefined,
        treeParentIds: [],
        organizationAddress: undefined,
        organizationType: undefined,
        organizationId: undefined,
        belongCompany: undefined,
        name: undefined,
        accountName: undefined
      },
      rules: {
        organizationName: { required: true, message: '请输入企业名称', trigger: 'blur' },
        treeParentIds: { required: true, message: '请选择上级企业', trigger: 'blur' },
        organizationType: { required: true, message: '请选择企业属性', trigger: 'blur' },
        name: { required: true, message: '请输入企业负责人', trigger: 'blur' },
        accountName: [{ required: true, message: '请输入负责人手机号', trigger: 'blur' },
          { validator: checkUser, trigger: 'blur' }]
      },
      selectProps: {
        checkStrictly: true,
        expandTrigger: 'hover',
        value: 'treeId',
        label: 'organizationName',
        emitPath: false,
        lazy: true,
        lazyLoad(node, resolve) {
          that.getOrganizationChild(node, resolve)
        },
        children: 'children',
        hasChildren: 'hasChildren'
      },
      selectPropsect: {
        value: 'treeId',
        label: 'organizationName'
      },
      dragList: [],
      selectList: [],
      tableData: [],
      employeeCountEntry: {
        organizationIds: []
      },
      organizationCount: 0,
      currentRow: {},
      // 企业部门树
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      props: {
        label: 'name',
        children: 'zones',
        isLeaf: 'leaf'
      },
      // 添加企业
      company: false,
      appVisible: false,
      organizationList: [],
      department: false,
      addDepVisible: false,
      depData: {
        organizationId: '',
        name: '',
        status: 'create'
      },
      depSubData: {
        organizationId: '',
        name: '',
        status: 'create'
      },
      orgData: {},
      addOrgVisible: false,
      isDisableVisible: false,
      addSubDepVisible: false,
      isDeleteDepVisible: false,
      currentNode: {}
    }
  },
  created() {
    this.init()
  },
  methods: {
    handleCurrentChange(row) {
      this.currentNodeName = row.id
      let currentRow = row
      if (!currentRow.id) {
        const currentOrganizationObject = getCurrentOrganizationObject()
        currentRow = {
          id: currentOrganizationObject.organizationId,
          name: currentOrganizationObject.organizationName
        }
      }

      this.currentRow = currentRow
      this.showOrgDetail = true
    },
    init() {
      const currentOrganizationObject = getCurrentOrganizationObject()
      this.treeData.push({
        id: currentOrganizationObject.organizationId,
        name: currentOrganizationObject.organizationName,
        children: [],
        type: 'ENTERPRISE'
      })
      this.currentRow = {
        id: currentOrganizationObject.organizationId,
        name: currentOrganizationObject.organizationName
      }
      // queryDepartmentSelectList({ departmentId: '' }).then(res => {
      //   this.treeData[0].children = res.data
      //   // if (!this.currentRow.id) {
      //   //   this.currentRow = this.treeData[0].children[0]
      //   // }
      // })
    },
    changeMenu(tab) {

    },
    // 组织部门树
    loadNode(node, resolve) {
      this.node = node
      this.resolve = resolve
      this.node.childNodes = []
      console.log('load', node)
      const currentOrganizationObject = getCurrentOrganizationObject()
      if (node.level === 0) {
        return resolve([{ name: currentOrganizationObject.organizationName, type: 'ENTERPRISE', id: currentOrganizationObject.organizationId }])
      }
      // this.loading = true
      queryDepartmentSelectList({ departmentId: node.data.type === 'ENTERPRISE' ? '' : node.data.id }).then(res => {
        this.treeData[0].children = res.data
        // if (!this.currentRow.id) {
        //   this.currentRow = this.treeData[0].children[0]
        // }
        // this.loading = false
        resolve(res.data)
      })
    },
    // 企业
    changeType(val) {
      this.selectList = []
      this.appVisible = val !== 'department'
    },
    // 企业部门下拉功能
    command(node, event, command) {
      console.log(node, event, command)
      this.$set(this.currentNode, 'data', node.parent.data || node.data)
      this[command](event, node)
    },
    // 新建下级企业
    createSubOrg(e) {
      this.orgData = {
        status: 'create',
        organizationId: e.id
      }
      this.addOrgVisible = true
      this.$nextTick(() => {
        this.$refs['addOrg'].resetFields()
      })
    },
    // 新建部门
    createDep() {
      this.addDepVisible = true
      this.depData.organizationId = 1
    },
    // 编辑部门
    editDep(event) {
      this.addDepVisible = true
      console.log(event)
      this.depData = {
        status: 'edit',
        name: event.name,
        organizationId: event.id,
        type: 'dep'
      }
    },
    // 编辑子部门
    editSubDep(ev) {
      this.addSubDepVisible = true
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
    createSubDep(e) {
      this.addSubDepVisible = true
      this.depData.organizationId = e.id
    },
    // 新建部门
    addDepConfirm(ref) {
      this.$refs[ref].validator().then(res => {
        const { organizationId, name } = this.depData
        if (this.depData.status === 'create') {
          addDepartment({ organizationId, name }).then(res => {
            this.$message.success('添加部门成功')
          })
        } else {
          updateDepartment({ id: organizationId, name }).then(res => {
            this.$message.success('修改部门成功')
          })
        }
        this.addDepVisible = false
        this.$refs[ref].resetFields()
        // this.currentNodeName = name
        this.loadNode(this.node, this.resolve)
      })
    },
    // 新建子部门
    addSubDepConfirm(ref) {
      this.$refs[ref].validator().then(res => {
        const { name } = this.depSubData
        const { organizationId } = this.depData
        if (this.depSubData.status === 'create') {
          addDepartment({ organizationId, name }).then(res => {
            this.$message.success('添加子部门成功')
          })
        } else {
          updateDepartment({ id: organizationId, name }).then(res => {
            this.$message.success('修改子部门成功')
            this.$refs[ref].resetFields()
          })
        }
        this.$refs[ref].resetFields()
        this.addSubDepVisible = false
        // this.currentNodeName = name
        this.loadNode(this.node, this.resolve)
      })
    }
  }
}

</script>

<style lang="scss">
  @import "~@/styles/mixin.scss";

  .organizationIndex {
    .el-tabs__header {
      @include bgc_white();
      border-radius: 5px;
    }
  }

</style>

<style lang="scss" scoped>
  .player-index {
    margin-top: 16px;
    font-size: 14px;

    .player-row {
      height: calc(100% - 73px);
      display: flex;
    }

    .left-box {
      min-width: 360px;
      padding-left: 20px;
      height: 100%;
      overflow: auto;
      .orgtable {

      }

      & /deep/ .el-tree-node__content {
        height: 40px;
      }

      & /deep/ .activeNodeName {
        color: $main-color;
      }

    }

    .right-box {
      flex: 1;
      height: 100%;
      padding: 0 24px;
      border-left: 1px solid #eee;
    }

    .container {
      /*display: flex;*/
      /*align-items: center;*/
      /*justify-content: space-between;*/
      padding-top: 16px;

      .company-info {
        padding-bottom: 20px;

        .company-name {
          color: #222222;
          font-size: 16px;
        }

        .company-addr {
          color: #999999;
          font-size: 14px;
          margin-top: 10px;
        }
      }
    }

    /*& /deep/ .el-table td {*/
    /*  border-bottom: none;*/
    /*}*/
  }
</style>
