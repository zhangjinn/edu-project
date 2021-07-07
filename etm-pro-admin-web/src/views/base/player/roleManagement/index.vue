<template>
  <div>
    <div>
      <role-table
        :role-list="roleList"
        @roleStaffView="handleRoleStaffView"
        @roleEditView="roleEditView"
        @roleAddVisible="handleRoleAddVisible"
      />
    </div>

    <side-window
      v-if="roleStaffVisible"
      :visible="roleStaffVisible"
      :title="'角色员工名单'"
      @close="closeSide"
    >
      <template v-slot:body>
        <div class="body" style="margin-top: 16px;margin-bottom: 16px ;padding-bottom: 0px;">
          <role-staff-title
            @handleMembership="handleMembership"
            @handleSearch="handleSearch"
          />
          <role-staff-table
            ref="staffTable"
            :role-id="currentRoleId"
            @handleEditStaff="handleEditStaff"
          />
        </div>
      </template>
    </side-window>

    <full-window
      v-if="roleAddVisible"
      :visible="roleAddVisible"
      :title="addName"
      @close="cancelAddCustom"
      @confirm="submitAddCustom"
      @cancel="cancelAddCustom"
    >
      <role-add
        ref="roleAdd"
        :current-role="currentRole"
        @addSuccess="addRoleSuccess"
      />
    </full-window>

    <el-dialog
      title="批量调整所属角色"
      width="600px"
      :visible.sync="changeRoleVisible"
      :close-on-click-modal="false"
      center
    >
      <change-role />
    </el-dialog>

    <full-window
      v-if="updataStaffVisible"
      :visible="updataStaffVisible"
      :title="'修改员工'"
      @close="cancelUpdataStaffCustom"
      @confirm="submitUpdataStaffCustom"
      @cancel="cancelUpdataStaffCustom"
    >
      <staff-updata
        ref="staffUpdata"
        :current-staff="currentStaff"
        @updataStaffSuccess="updataStaffSuccess"
      />
    </full-window>

  </div>
</template>

<script>
import roleTable from './roleTable'
import roleStaffTitle from './roleList/roleStaffTitle'
import roleStaffTable from './roleList/roleStaffTable'
import roleAdd from './roleAdd/roleAdd'
import staffUpdata from '../organizationalStructure/staffAdd/staffUpdata'
import changeRole from './changeRole/changeRole'
import { roleEnterprise } from '@/api/role'
import { getOrganizationId } from '@/utils/auth'

import fullWindow from '../../../../layout/main/fullWindow'
import sideWindow from '../../../../layout/main/sideWindow'

export default {
  name: 'Role',
  components: {
    roleTable,
    roleStaffTitle,
    roleStaffTable,
    roleAdd,
    changeRole,
    fullWindow,
    sideWindow,
    staffUpdata
  },
  data() {
    return {
      drawerWidth: this.$store.state.commonStyle.drawerWidth, // 抽屉宽度
      roleStaffVisible: false,
      roleAddVisible: false,
      changeRoleVisible: false,
      roleList: undefined,
      currentRoleId: undefined,
      currentRole: undefined,
      addName: '添加角色',
      updataStaffVisible: false,
      currentStaff: undefined,
      getEntry: {
        enterprise: undefined
      }
    }
  },
  created() {
    this.getEntry.enterprise = getOrganizationId()
    this.getRoleEnterprise(this.getEntry)
  },
  methods: {
    handleRoleStaffView(id) {
      this.currentRoleId = id
      this.roleStaffVisible = true
    },
    closeSide() {
      this.roleStaffVisible = false
    },
    handleRoleAddVisible() {
      this.addName = '添加角色'
      this.currentRole = undefined
      this.roleAddVisible = true
    },
    handleChangeRoleVisible() {
      this.changeRoleVisible = true
    },

    getRoleEnterprise(params) {
      roleEnterprise(params).then(response => {
        this.roleList = response.data
        setTimeout(() => {
        }, 1.5 * 1000)
      })
    },
    addRoleSuccess() {
      this.roleAddVisible = false
      this.getRoleEnterprise(this.getEntry)
    },
    roleEditView(role) {
      this.addName = '修改角色'
      this.currentRole = role
      this.roleAddVisible = true
    },
    cancelAddCustom() {
      this.roleAddVisible = false
    },
    submitAddCustom() {
      this.$refs.roleAdd.sure('addCustomerForm')
    },
    handleSearch(val) {
      this.$refs.staffTable.search(val)
    },
    handleMembership() {
      this.$refs.staffTable.membership()
    },
    handleEditStaff(val) {
      // 修改员工账号
      this.currentStaff = val
      this.updataStaffVisible = true
    },
    cancelUpdataStaffCustom() {
      this.updataStaffVisible = false
    },
    submitUpdataStaffCustom() {
      this.$refs.staffUpdata.onSubmit('staffForm')
    },
    updataStaffSuccess() {
      this.updataStaffVisible = false
    }
  }
}
</script>

<style lang="scss">

</style>
