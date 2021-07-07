<template>
  <div class="PlayerRole-wrap">
    <tool-search v-model="roleName" placeholder="请输入角色按回车搜索" @search="search">
      <el-button type="primary" icon="el-icon-plus" @click="add">添加角色</el-button>
      <!--      <el-button type="plain">启用</el-button>-->
      <!--      <el-button type="plain">禁用</el-button>-->
      <!--      <el-button type="plain">删除</el-button>-->
    </tool-search>
    <etm-table-page
      ref="etmTable"
      type="index"
      :height="tableHeight"
      :columns="columns"
      :table-data="tableData"
      border
      @size-change="sizeChange"
      @currentChange="currentChange"
    >
      <template slot="right">
        <el-table-column label="操作">
          <template slot-scope="scope">
            <etm-text type="primary" @click.stop="edit(scope.row)">修改</etm-text>
          </template>
        </el-table-column>
      </template>
    </etm-table-page>

    <etm-pop
      v-if="addRoleVisible"
      :visible="addRoleVisible"
      pop="complex"
      width="1000px"
      :title="roleData.status === 'create' ? '添加角色' : '编辑角色'"
      cancel-btn="取消"
      @close="addRoleVisible = false"
      @cancel="addRoleVisible = false"
      @confirm="submitAddRole('addRole')"
    >

      <add-role ref="addRole" :role="roleData" />
    </etm-pop>

    <!--<el-dialog-->
    <!--  :title="roleData.status === 'create' ? '添加角色' : '编辑角色'"-->
    <!--  :visible.sync="addRoleVisible"-->
    <!--  top="5vh"-->
    <!--  width="80%"-->
    <!--&gt;-->
    <!--  <div>-->
    <!--    <add-role ref="addRole" :role="roleData" />-->
    <!--  </div>-->
    <!--  <span slot="footer" class="dialog-footer">-->
    <!--    <el-button @click="addRoleVisible = false">取 消</el-button>-->
    <!--    <el-button type="primary" @click="submitAddRole('addRole')">确 定</el-button>-->
    <!--  </span>-->
    <!--</el-dialog>-->
  </div>
</template>

<script>
import ToolSearch from '@/views/base/player/component/toolSearch'
import EtmTablePage from '@/views/base/player/component/EtmTablePage'
import { addRole, getRoleDetailById, queryRoleList, updateRole } from '@/api/employee'
import { parseTime } from '@/utils'
import AddRole from '@/views/base/player/component/addRole'
import EtmPop from '@/layout/main/EtmPop/src/EtmPop'
import baseMixin from '@/layout/mixin/baseMixin'

/**
   * PlayerRole create by    dengShen
   * createTime   2020/3/16 16:45:43
   */
export default {
  name: 'PlayerRole',
  components: {
    EtmPop,
    AddRole, EtmTablePage, ToolSearch
  },
  mixins: [baseMixin],
  props: {
    orgId: {
      type: [String, Number],
      required: true
    },
    orgName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      addRule: false,
      ruleData: {
        ruleName: '',
        ruleDesc: '',
        auth: ''
      },
      radio: '1',
      columns: [
        {
          label: '角色名称',
          prop: 'name'
        },
        {
          label: '角色员工数',
          prop: 'employeeCount'
        },
        {
          label: '创建时间',
          prop: 'createTime'
        }
        // {
        //   label: '配置权限',
        //   prop: 'resources.name'
        // }
      ],
      tableData: {},
      addRoleVisible: false,
      roleData: {
        name: '',
        description: '',
        dataPrivilege: '',
        resourceIds: [],
        status: 'create'
      },
      roleName: '',
      currentRow: {}
    }
  },
  computed: {},
  watch: {
    'orgId'() {
      this.init()
    }
  },
  created() {
  },
  mounted() {
    this.init()
  },
  methods: {
    sizeChange(val) {
      this.pageInfo.pageSize = val
      this.pageInfo.pageNum = 1
      this.init()
    },
    currentChange(val) {
      this.pageInfo.pageNum = val
      this.init()
    },
    search(val) {
      console.log(val)
      this.roleName = val
      this.init()
    },
    init() {
      console.log(`role is running...`)
      queryRoleList({ pageSize: this.pageInfo.pageSize, pageNum: this.pageInfo.pageNum, name: this.roleName }).then(res => {
        console.log(res)
        this.tableData = res.data
        this.tableData.content.map(item => {
          item.createTime = parseTime(item.createTime, '{y}-{m}-{d}')
        })
      })
    },
    // filterHandler(value, row, column) {
    //   const property = column['property']
    //   return row[property] === value
    // },
    submitAddRole(ref) {
      this.$refs[ref].validator().then(res => {
        // eslint-disable-next-line prefer-const
        let { roleData, resourceIds } = this.$refs[ref].emitData()
        console.log(resourceIds)
        if (!resourceIds.length) {
          return this.$message.error('请至少选择一个功能权限')
        }

        const { name, description, dataPrivilege } = roleData
        if (this.roleData.status === 'create') {
          addRole({ name: name, description: description, resourceIds, dataPrivilege }).then(res => {
            this.addRoleVisible = false
            this.$message.success('添加角色成功')
            this.$refs[ref].resetFields()
            this.init()
          })
        } else if (this.roleData.status === 'edit') {
          updateRole({ roleId: this.currentRow.id, name, description, resourceIds, dataPrivilege }).then(res => {
            this.addRoleVisible = false
            this.$message.success('更新角色成功')
            this.$refs[ref].resetFields()
            this.init()
          })
        }
      })
    },
    add() {
      // queryAuthList().then(res => {
      //   console.log(res)
      //   this.roleData.authList = res.data
      // })
      // this.$router.push({ name: 'addRole' })
      this.roleData = {
        name: '',
        resourceIds: [],
        description: '',
        dataPrivilege: 'ALL',
        status: 'create'
      }
      this.addRoleVisible = true
    },
    edit(row) {
      this.roleData.status = 'edit'
      this.currentRow = row
      getRoleDetailById({ roleId: row.id }).then(res => {
        console.log(res)
        res.data.status = 'edit'
        this.roleData = res.data
        this.addRoleVisible = true
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .PlayerRole-wrap {
    .EtmTablePage-wrap {
      padding: 0;
      & /deep/ .el-pagination {
        margin-top: 16px;
        padding: 0!important;
      }
    }
  }
</style>
