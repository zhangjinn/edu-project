<template>
  <div class="employee-wrap">
    <tool-search
      v-model="employeeName"
      placeholder="请输入员工姓名按回车搜索"
      prefix-icon="el-icon-search"
      @search="search"
    >
      <el-button type="primary" icon="el-icon-plus" @click="addEmployeeHandle">添加员工
      </el-button>
      <!--<el-button type="plain" :disabled="isStart" @click="handleStart">启用</el-button>-->
      <!--<el-button type="plain" :disabled="isDisable" @click="handleDisable">禁用</el-button>-->
      <!--<el-button type="plain" :disabled="isRemove" @click="handleRemove">删除</el-button>-->
    </tool-search>
    <etm-table-page
      ref="etmTable"
      :height="tableHeight"
      :columns="columns"
      :table-data="tableData"
      border
      type="index"
      @selection-change="handleSelectionChange"
      @currentChange="currentChange"
    >

      <el-table-column
        align="left"
        type="selection"
        width="40"
      />

      <!--      <el-table-column-->
      <!--        slot="right"-->
      <!--        align="left"-->
      <!--        label="角色"-->
      <!--        prop="role"-->
      <!--        :filters="allRole"-->
      <!--        :filter-method="filterRoleHandler"-->
      <!--      />-->
      <!--      <el-table-column-->
      <!--        slot="right"-->
      <!--        align="left"-->
      <!--        label="岗位"-->
      <!--        prop="post"-->
      <!--        :filters="allPost"-->
      <!--        :filter-method="filterPostHandler"-->
      <!--      />-->
      <el-table-column
        slot="right"
        align="left"
        label="性别"
        prop="gender"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.gender === 'MALE'">男</span>
          <span v-if="scope.row.gender === 'FEMALE'">女</span>
        </template>
      </el-table-column>

      <el-table-column
        slot="right"
        align="left"
        label="账号状态"
        prop="accountStatus"
      >
        <template slot-scope="scope">
          <span v-if="!scope.row.enable"><etm-dot type="disabled" />已禁用</span>
          <span v-if="scope.row.enable"><etm-dot type="active" />使用中</span>
        </template>
      </el-table-column>
      <el-table-column
        slot="right"
        align="left"
        width="200"
        label="操作"
      >
        <div slot-scope="scope" style="display: flex;">
          <etm-text type="primary" @click="editEmployee(scope.row)">修改</etm-text>
          <etm-text v-show="!scope.row.enable" type="primary" @click="changeStatus(scope.row)">启用</etm-text>
          <etm-text v-show="scope.row.enable" type="danger" @click="changeStatus(scope.row)">禁用</etm-text>
          <!--<etm-text type="danger" @click="removePost(scope.row)">移除岗位</etm-text>-->
        </div>
      </el-table-column>
    </etm-table-page>
    <!--    添加员工-->
    <etm-pop
      ref="addStaff"
      :visible="addEmployeeVisible"
      pop="complex"
      :title="employeeData.status === 'create'?'添加员工': '编辑员工'"
      @close="cancelAddStaffCustom"
      @cancel="cancelAddStaffCustom"
      @confirm="submitAddStaffCustom('addEmployee')"
    >
      <add-employee ref="addEmployee" :org-id="orgId" :employee="employeeData" />
    </etm-pop>
  </div>
</template>

<script>
import ToolSearch from '@/views/base/player/component/toolSearch'
import { checkPhone, getOrganizationTreeAll } from '@/api/organization'
// import { getPositionListByPostId, getPositionTree } from '@/api/post'
import { roleEnterprise } from '@/api/role'
import EtmDot from './EtmDot'
import EtmTablePage from '@/views/base/player/component/EtmTablePage'
import EtmPop from '@/layout/main/EtmPop/src/EtmPop'
import { parseTime } from '@/utils'
import AddEmployee from '@/views/base/player/component/addEmployee'
import { addEmployee, getEmployeeDetailById, getEmployeeList, switchEmployeeStatus, updateEmployee } from '@/api/employee'
import baseMixin from '@/layout/mixin/baseMixin'

/**
   * employee create by    dengShen
   * createTime   2020/3/16 14:49:06
   */
export default {
  name: 'PlayerEmployee',
  components: {
    AddEmployee,
    EtmPop,
    EtmTablePage,
    EtmDot,
    ToolSearch
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
    const checkUser = (rule, value, callback) => {
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
      columns: [
        {
          label: '姓名',
          prop: 'name'
        },
        {
          label: '账号',
          prop: 'telephone'
        },
        {
          label: '角色',
          prop: 'roleNames'
        },
        {
          label: '岗位',
          prop: 'positionNames'
        },
        {
          label: '部门',
          prop: 'departmentName'
        },
        {
          label: '创建时间',
          prop: 'createTime'
        }
      ],
      tableData: {},
      pageInfo: {
        pageNum: 1,
        pageSize: 10
      },
      allRole: [],
      allPost: [],
      addEmployeeVisible: false,
      rules: {
        accountName: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { required: false, validator: checkUser, trigger: 'blur' }],
        name: { required: true, message: '请输入员工名称', trigger: 'blur' },
        servingSchoolId: { required: true, message: '请选择员工任职校区', trigger: 'blur' }
      },
      employeeData: {
        organizationName: '',
        gender: '',
        name: '',
        telephone: '',
        departmentId: '',
        roleIds: [],
        positionIds: [],
        status: 'create'
      },
      postList: [],
      roleList: [],
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
      },
      selectedList: [],
      employeeName: ''
    }
  },
  computed: {
    isRemove() {
      return this.selectedList.length <= 0
    },
    isStart() {
      return this.isRemove && this.selectedList.every(item => item.employeeEnable === 0)
    },
    isDisable() {
      return this.isRemove && this.selectedList.every(item => item.employeeEnable === 1)
    }
  },
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

    currentChange(e) {
      this.pageInfo.pageNum = e
      this.init()
    },
    search(val) {
      console.log(val)
      this.init()
    },
    /**
       * 筛选角色和岗位
       * @param tableData
       */
    handleFilter(tableData) {
      tableData.forEach(item => {
        if (!Array.isArray(this.allRole)) {
          console.log(this.allRole)
          return
        }
        this.allRole = [...this.allRole, ...item.roleList || []]
        this.allPost = [...this.allPost, ...item.postList || []]
      })

      this.allRole = this.allRole.map(item => {
        return {
          text: item.name,
          value: item.id
        }
      })
      this.allPost = this.allPost.map(item => {
        return {
          text: item.name,
          value: item.positionId
        }
      })
      this.allRole = unique(this.allRole, 'text')
      this.allPost = unique(this.allPost, 'text')

      function unique(arr, key) {
        arr = arr || []
        const hash = {}
        const result = []
        arr.reduce((item, next) => {
          if (!hash[next[key]]) {
            hash[next[key]] = true
            item.push(next)
          }
          return item
        }, result)
        return result
      }
    },
    init() {
      this.employeeData.organizationName = this.orgName
      const { pageNum, pageSize } = this.pageInfo
      this.orgId && getEmployeeList({ organizationId: this.orgId, employeeName: this.employeeName, pageNum, pageSize }).then(res => {
        this.tableData = res.data
        this.tableData.content = this.tableData.content.map(item => {
          item.createTime = parseTime(item.createTime, '{y}-{m}-{d}')

          item.roleNames = item.roleNames.join('，')
          item.positionNames = item.positionNames.join('，')
          return item
        })
      })
    },
    filterRoleHandler(value, row, column) {
      const isIn = row.roleList.some(item => item.id === value)
      return isIn ? row : ''
    },
    filterPostHandler(value, row, column) {
      const isIn = row.postList.some(item => item.positionId === value)
      return isIn ? row : ''
    },
    /**
       * 添加员工
       */
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

      // this.getPositionListById(id)
      this.roleEntry.enterprise = id
      this.getRoleEnterprise(this.roleEntry)

      this.getOrganizationTreeChild(id)
    },
    getOrganizations(entry) {
      getOrganizationTreeAll(entry).then(response => {
        // this.organizationList = this.getCascad(response.data)
        console.log(response)
        setTimeout(() => {
        }, 1.5 * 1000)
      })
    },
    // getPositionListById(id) {
    //   getPositionTree(id).then(response => {
    //     this.postList = this.getCascad(response.data)
    //     setTimeout(() => {
    //     }, 1.5 * 1000)
    //   })
    // },
    getRoleEnterprise(params) {
      roleEnterprise(params).then(response => {
        this.roleList = response.data
        setTimeout(() => {
        }, 1.5 * 1000)
      })
    },
    getPostTreeChildNode(node, resolve) {
      if (node.children.length === 0 && node.data.hasChildren) {
        // getPositionListByPostId(node.data.positionId).then(response => {
        //   resolve(response.data)
        // })
      } else {
        resolve(node.children)
      }
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
    handleAddStaffVisible() {
      this.addEmployeeVisible = true
    },

    addStaffSuccess() {
      this.addEmployeeVisible = false
    },

    cancelAddStaffCustom() {
      this.addEmployeeVisible = false
    },
    addEmployeeHandle() {
      this.addEmployeeVisible = true
      this.employeeData.status = 'create'
      this.$nextTick(() => {
        this.$refs['addEmployee'].resetFields()
      })
    },
    submitAddStaffCustom(ref) {
      this.$refs[ref].validator().then(res => {
        if (this.employeeData.status === 'create') {
          addEmployee({ ...this.employeeData }).then(res => {
            this.$message.success('员工添加成功')
            this.addEmployeeVisible = false
            this.init()
          })
        } else if (this.employeeData.status === 'edit') {
          updateEmployee({ ...this.employeeData }).then(res => {
            this.$message.success('员工添加成功')
            this.addEmployeeVisible = false
            this.init()
          })
        }

        console.log(this.employeeData)
      })
    },
    handleSelectionChange(e) {
      this.selectedList = e
    },
    handleStart(e) {
    },
    handleDisable(e) {
    },
    handleRemove(e) {
    },
    editEmployee(row) {
      getEmployeeDetailById({ id: row.id }).then(res => {
        this.employeeData = res.data
        this.employeeData.status = 'edit'
      })
      console.log(row)
      this.staffForm = row

      this.addEmployeeVisible = true
    },
    changeStatus(row) {
      console.log(row)
      switchEmployeeStatus({ enable: !row.enable, employeeId: row.id }).then(res => {
        this.init()
      })
    },
    removeRule(row) {
      console.log(row)
    },
    removePost(row) {
      console.log(row)
    }

  }
}
</script>

<style lang="scss" scoped>
  .employee-wrap {
    .EtmTablePage-wrap {
      padding: 0;
      & /deep/ .el-pagination {
        margin-top: 16px;
        padding: 0!important;
      }
    }

  }
</style>
