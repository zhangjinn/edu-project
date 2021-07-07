<template>
  <div>
    <div>
      <organization-table
        ref="orgTable"
        style="height: 100%"
        :table-data="companyData"
        :company="companyName"
        @handleView="handleStaffVisible"
        @selectRow="selectRow"
        @handleAddOrg="handleAddOrgVisible"
        @handleAddStaff="handleAddStaffVisible"
        @handleEdit="handelEdit"
      />
    </div>
    <side-window
      v-if="staffVisible"
      :visible="staffVisible"
      :title="'组织员工名单'"
      @close="closeSide"
    >
      <template v-slot:body>
        <div class="body" style="margin-top: 16px;margin-bottom: 16px ;padding-bottom: 0px;">
          <staff-title
            @handleChangeOrg="handleChangeOrgVisible"
            @handleSearch="handleSearch"
            @handleUse="handleUse"
            @handleUnUse="handleUnUse"
            @handleDel="handleDel"
          />
          <staff-table
            ref="staffTable"
            :current-organization-id="currentOrganizationId"
            @handleEditStaff="handleEditStaff"
          />
        </div>
      </template>
    </side-window>

    <full-window
      v-if="addOrgVisible"
      :visible="addOrgVisible"
      :title="addName"
      @close="cancelAddCustom"
      @confirm="submitAddCustom"
      @cancel="cancelAddCustom"
    >
      <organization-add
        ref="orgAdd"
        :current-row="currentOrganization"
        @uplodeOrganization="uplodeOrganization"
      />
    </full-window>

    <full-window
      v-if="updataOrgVisible"
      :visible="updataOrgVisible"
      :title="addName"
      @close="cancelUpdataCustom"
      @confirm="submitUpdataCustom"
      @cancel="cancelUpdataCustom"
    >
      <organization-updata
        ref="orgUpdata"
        :current-row="currentOrganization"
        @uplodeOrganization="uplodeOrganization"
      />
    </full-window>

    <full-window
      v-if="addStaffVisible"
      :visible="addStaffVisible"
      :title="'添加员工'"
      @close="cancelAddStaffCustom"
      @confirm="submitAddStaffCustom"
      @cancel="cancelAddStaffCustom"
    >
      <staff-add ref="staffAdd" @addStaffSuccess="addStaffSuccess" />
    </full-window>

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
import organizationTable from './organizationTable'
import staffTitle from './staffList/staffTitle'
import staffTable from './staffList/staffTable'
import organizationAdd from './organizationalAdd/organizationAdd'
import OrganizationUpdata from './organizationalAdd/organizationUpdata'
import staffAdd from './staffAdd/staffAdd'
import staffUpdata from './staffAdd/staffUpdata'
import fullWindow from '../../../../layout/main/fullWindow'
import sideWindow from '../../../../layout/main/sideWindow'

import { employeeCount, getOrganizationTreeAll, totalEmployeeCount } from '@/api/organization'
import { getOrganizationId, getPersonId } from '@/utils/auth'

export default {
  name: 'OrganizationTab',
  components: {
    organizationTable,
    staffTitle,
    staffTable,
    organizationAdd,
    OrganizationUpdata,
    staffAdd,
    fullWindow,
    sideWindow,
    staffUpdata
  },
  data() {
    return {
      drawerWidth: this.$store.state.commonStyle.drawerWidth, // 抽屉宽度
      companyName: '',
      staffVisible: false,
      addOrgVisible: false,
      updataOrgVisible: false,
      addStaffVisible: false,
      updataStaffVisible: false,
      changeOrgVisible: false,
      currentOrganizationId: undefined,
      currentOrganization: undefined,
      companyData: undefined,
      queryEntry: {
        personId: undefined
      },
      employeeCountEntry: {
        organizationIds: []
      },
      totalEntry: {
        organizationId: ''
      },
      addName: '添加岗位',
      currentStaff: undefined
    }
  },
  created() {
    this.queryEntry.personId = getPersonId()
    this.getOrganizations(this.queryEntry)

    this.totalEntry.organizationId = getOrganizationId()
    this.totalEmployeeCount(this.totalEntry)
  },
  methods: {
    handleStaffVisible(id) {
      console.log(this.staffVisible)
      this.currentOrganizationId = id
      this.staffVisible = true
    },
    handleAddOrgVisible() {
      this.addName = '添加组织'
      this.currentOrganization = undefined
      this.addOrgVisible = true
    },
    handleAddStaffVisible() {
      this.addStaffVisible = true
    },
    handelEdit(org) {
      this.addName = '修改组织'
      this.currentOrganization = org
      this.updataOrgVisible = true
    },
    handleChangeOrgVisible() {
      this.changeOrgVisible = true
    },
    // 保存组织机构
    uplodeOrganization() {
      this.addOrgVisible = false
      this.getOrganizations(this.queryEntry)
    },
    selectRow() {
      this.currentRow = this.$refs.orgTable.getCurrentRow()
    },
    getOrganizations(entry) {
      getOrganizationTreeAll(entry).then(response => {
        this.companyData = response.data

        // 获取组织机构id的集合
        this.employeeCountEntry.organizationIds = []
        for (const index in this.companyData) {
          this.companyData[index].employeeNum = 0
          this.employeeCountEntry.organizationIds.push(this.companyData[index].organizationId)
        }
        this.employeeCount(this.employeeCountEntry)
      })
    },
    totalEmployeeCount(entry) {
      totalEmployeeCount(entry).then(response => {
        if (response.code === 0) {
          this.companyName = response.data.organizationName
        }
      })
    },
    employeeCount(entry) {
      // 根据组织id集合获取员工数量
      employeeCount(entry).then(response => {
        if (response.code === 0 && response.data != null && response.data.length > 0) {
          for (const index in this.companyData) {
            for (const index2 in response.data) {
              if (response.data[index2].organizationId === this.companyData[index].organizationId) {
                this.companyData[index].employeeNum = response.data[index2].employeeCount
              }
            }
          }
        }
      })
    },
    addStaffSuccess() {
      this.addStaffVisible = false
    },
    closeSide() {
      this.staffVisible = false
    },
    cancelAddCustom() {
      this.addOrgVisible = false
    },
    submitAddCustom() {
      this.$refs.orgAdd.sure('addCustomerForm')
    },
    cancelUpdataCustom() {
      this.updataOrgVisible = false
    },
    submitUpdataCustom() {
      this.$refs.orgUpdata.sure()
    },
    cancelAddStaffCustom() {
      this.addStaffVisible = false
    },
    submitAddStaffCustom() {
      this.$refs.staffAdd.onSubmit('staffForm')
    },
    handleSearch(val) {
      // 搜索功能
      this.$refs.staffTable.search(val)
    },
    handleDel() {
      // 删除员工账号
      this.$refs.staffTable.employee(3)
    },
    handleUnUse() {
      // 禁用员工账号
      this.$refs.staffTable.employee(0)
    },
    handleUse() {
      // 启用员工账号
      this.$refs.staffTable.employee(1)
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

<style lang="scss" scoped>

</style>
