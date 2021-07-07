<template>
  <div>
    <div>
      <post-table
        :post-list="postList"
        @handleView="postStaffView"
        @handleEdit="handleEdit"
        @handlePostAddVisible="handlePostAddVisible"
      />
    </div>

    <side-window
      v-if="postStaffVisible"
      :visible="postStaffVisible"
      :title="'岗位员工名单'"
      @close="closeSide"
    >
      <template v-slot:body>
        <div class="body" style="margin-top: 16px;margin-bottom: 16px ;padding-bottom: 0px;">
          <post-staff-title @handleRemove="handleRemove" @handleSearch="handleSearch" />
          <post-staff-table
            ref="staffTable"
            :current-post-id="currentPostId"
            @handleEditStaff="handleEditStaff"
          />
        </div>
      </template>
    </side-window>

    <full-window
      v-if="postAddVisible"
      :visible="postAddVisible"
      :title="addName"
      @close="cancelAddCustom"
      @confirm="submitAddCustom"
      @cancel="cancelAddCustom"
    >
      <post-add
        ref="postAdd"
        :current-post="currentPost"
        @addSuccess="addSuccess"
      />
    </full-window>

    <el-dialog
      title="批量调整所属岗位"
      width="600px"
      :visible.sync="postChangeVisible"
      :close-on-click-modal="false"
      center
    >
      <change-post />
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
import postTable from './postTable'
import postStaffTitle from './postList/postStaffTitle'
import postStaffTable from './postList/postStaffTable'
import postAdd from './postAdd/postAdd'
import staffUpdata from '../organizationalStructure/staffAdd/staffUpdata'
import changePost from './changePost/changePost'
import { getOrganizationId } from '@/utils/auth'

import fullWindow from '../../../../layout/main/fullWindow'
import sideWindow from '../../../../layout/main/sideWindow'

import { getPositionListByOrganizationId } from '@/api/post'

export default {
  name: 'Post',
  components: {
    postTable,
    postStaffTitle,
    postStaffTable,
    postAdd,
    changePost,
    fullWindow,
    sideWindow,
    staffUpdata
  },
  data() {
    return {
      drawerWidth: this.$store.state.commonStyle.drawerWidth, // 抽屉宽度
      postStaffVisible: false,
      postAddVisible: false,
      postChangeVisible: false,
      postList: undefined,
      currentPostId: undefined,
      currentPost: undefined,
      updataStaffVisible: false,
      currentStaff: undefined,
      addName: '添加岗位'
    }
  },
  created() {
    this.getPositionList(getOrganizationId())
  },
  methods: {
    postStaffView(id) {
      this.currentPostId = id
      this.postStaffVisible = true
    },
    closeSide() {
      this.postStaffVisible = false
    },
    handlePostAddVisible() {
      this.addName = '添加岗位'
      this.currentPost = undefined
      this.postAddVisible = true
    },
    handlePostChangeVisible() {
      this.postChangeVisible = true
    },

    getPositionList(id) {
      getPositionListByOrganizationId(id).then(response => {
        this.postList = response.data
      })
    },
    addSuccess() {
      this.postAddVisible = false
      this.getPositionList(getOrganizationId())
    },
    cancelAddCustom() {
      this.currentPost = undefined
      this.postAddVisible = false
    },
    submitAddCustom() {
      this.$refs.postAdd.addPost('addCustomerForm')
    },
    handleSearch(val) {
      this.$refs.staffTable.search(val)
    },
    handleRemove() {
      this.$refs.staffTable.removePost()
    },
    handleEdit(post) {
      this.addName = '修改岗位'
      this.currentPost = post
      this.postAddVisible = true
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
