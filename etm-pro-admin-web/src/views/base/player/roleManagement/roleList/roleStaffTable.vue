<template>
  <div>
    <el-table
      ref="multipleTable"
      style="width: 100%;margin-top: 16px;"
      :data="roleStaffList"
      height="calc(100vh - 190px)"
      tooltip-effect="dark"
      border
    >

      <el-table-column
        type="selection"
        width="60"
      />

      <el-table-column
        label="操作"
        width="70"
      >
        <template slot-scope="{row}">
          <el-button type="text" size="small" @click="handleEdit(row)">修改</el-button>
        </template>
      </el-table-column>

      <el-table-column
        prop="name"
        label="员工姓名"
        width="120"
      />
      <el-table-column
        prop="accountName"
        label="账号"
        width="150"
      />
      <el-table-column
        prop="gender"
        label="性别"
        width="70"
      >
        <template slot-scope="{row}">
          <span>{{ handleSex(row.gender) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="role"
        label="角色"
        width="180"
      >
        <template slot-scope="{row}">
          <span>{{ handleRole(row.roleList) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="post"
        label="岗位"
        min-width="180"
      >
        <template slot-scope="{row}">
          <span>{{ handlePost(row.postList) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="enable"
        label="状态"
        width="70"
      >
        <template slot-scope="{row}">
          <span>{{ handleState(row.employeeEnable) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="180"
      >
        <template slot-scope="{row}">
          <span>{{ handleTime(row.createTime) }}</span>
        </template>
      </el-table-column>

    </el-table>

    <el-pagination
      :current-page="entry.pageNum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="entry.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="staffNum"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

  </div>
</template>
<script>

import { getRoleStaffs, membership } from '@/api/role'
import { getOrganizationId } from '@/utils/auth'
import tips from '../../tips'

export default {
  name: 'RoleStaffTable',
  components: {
  },
  props: ['roleId'],
  data() {
    return {
      roleStaffList: undefined,
      entry: {
        organizationId: undefined,
        roleId: undefined,
        pageNum: 1,
        pageSize: 10,
        keyword: undefined
      },
      staffList: undefined,
      staffNum: 0,
      membershipEntry: {
        roleId: undefined,
        accountIds: []
      }
    }
  },
  created() {
    this.getStaffs()
  },
  methods: {
    handleSex(sex) {
      if (sex === 1) {
        return '男'
      } else if (sex === 2) {
        return '女'
      }
    },
    handleState(state) {
      if (state === 0) {
        return '禁用'
      } else if (state === 1) {
        return '启用'
      } else if (state === 2) {
        return '未激活'
      }
    },
    getStaffs() {
      this.entry.organizationId = getOrganizationId()
      this.entry.roleId = this.roleId
      getRoleStaffs(this.entry).then(response => {
        this.roleStaffList = response.data.content
        this.staffNum = response.data.totalElements
        this.entry.pageNum = response.data.pageNum
        this.entry.pageSize = response.data.pageSize
      })
    },
    handlePost(posts) {
      let postStr = '没有配置权限'
      if (posts != null) {
        postStr = ''
        for (let i = 0; i < posts.length; i++) {
          if (posts[i] != null) {
            postStr += posts[i].name + '、'
          }
        }
        if (postStr.length > 0) {
          postStr = postStr.substring(0, postStr.length - 1)
        }
      }
      return postStr
    },
    handleRole(roles) {
      let roleStr = '没有配置权限'
      if (roles != null) {
        roleStr = ''
        for (let i = 0; i < roles.length; i++) {
          if (roles[i] != null) {
            roleStr += roles[i].name + '、'
          }
        }
        if (roleStr.length > 0) {
          roleStr = roleStr.substring(0, roleStr.length - 1)
        }
      }
      return roleStr
    },
    handleTime(time) {
      return tips.handleTimeStr(time)
    },
    handleEdit(row) {
      this.$emit('handleEditStaff', row)
    },
    handleSizeChange(val) {
      this.entry.pageSize = val
      this.getStaffs()
    },
    handleCurrentChange(val) {
      this.entry.pageNum = val
      this.getStaffs()
    },
    membership() {
      this.membershipEntry.roleId = this.roleId
      this.membershipEntry.accountIds = this.getSelectEmployeeList()
      console.log(this.membershipEntry.accountIds)
      if (this.membershipEntry.accountIds.length === 0) {
        this.$message.error('请选择员工')
      } else {
        membership(this.membershipEntry).then(response => {
          if (response.code === 0) {
            // 移除成功
            this.getStaffs()
          } else {
            // 移除失败
            this.$message.error(response.message)
          }
        })
      }
    },
    search(val) {
      this.entry.pageNum = 1
      this.entry.keyword = val
      this.getStaffs()
    },
    getSelectEmployeeList() {
      const ids = []
      if (this.$refs.multipleTable.selection != null && this.$refs.multipleTable.selection.length > 0) {
        for (const index in this.$refs.multipleTable.selection) {
          ids.push(this.$refs.multipleTable.selection[index].accountId)
        }
      }
      return ids
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
