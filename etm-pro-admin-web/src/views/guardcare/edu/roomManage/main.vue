<template>
  <div class="main-wrap">
    <etm-layout-split>
      <template slot="header">
        <etm-tabs v-model="activeName" :setting="hasAuthOfBool('guardcare.room.setting')" @setting="setting">
          <el-tab-pane label="场所/教室" name="gradeManage">
            <etm-tool-bar v-show="show" v-model="formData" @search="search" @reset="resetSearch" />
          </el-tab-pane>
        </etm-tabs>
      </template>
      <template slot="body">
        <etm-table-page
          :data="tableData"
          :columns="columns"
          :index="true"
          @currentChange="currentChange"
        >
          <etm-table-tool-bar slot="tool">
            <div slot="right">
              <el-button v-has="{authId: 'guardcare.room.create'}" type="primary" @click="addGrade"><i class="el-icon-plus" />&nbsp;&nbsp;添加场所/教室</el-button>
            </div>
          </etm-table-tool-bar>
          <el-table-column slot="left" label="场所/教室名称">
            <template v-slot="scoped">
              <etm-text v-if="!hasAuthOfBool('guardcare.room.query')" type="normal">{{ scoped.row.name }}</etm-text>
              <etm-text v-else type="primary" @click="handleDetail(scoped.row)">{{ scoped.row.name }}</etm-text>
            </template>
          </el-table-column>

          <el-table-column slot="right" label="使用状态">
            <template v-slot="scoped">
              <el-switch
                v-model="scoped.row.enable"
                @change="switchChange(scoped.row)"
              />
            </template>
          </el-table-column>

          <el-table-column slot="right" label="操作">
            <template v-slot="scoped">
              <etm-text v-has="{authId: 'guardcare.room.update'}" type="primary" @click="handleEdit(scoped.row, true)">编辑</etm-text>
              <etm-text v-has="{authId: 'guardcare.room.remove'}" type="danger" @click="handleDelete(scoped.row)">删除</etm-text>
            </template>
          </el-table-column>
        </etm-table-page>
      </template>
    </etm-layout-split>

    <!--添加弹框-->
    <etm-pop
      :visible="popVisibleEdit"
      pop="complex"
      title="添加场所/教室"
      confirm-btn="确定"
      cancel-btn="取消"
      @close="popCloseEdit"
      @cancel="popCloseEdit"
      @confirm="popConfirmEdit"
    >
      <div class="popContent">
        <edit v-if="popVisibleEdit && drawerType==='add'" ref="childPopForm" :type="drawerType" />
      </div>
    </etm-pop>

    <!--详情/编辑抽屉-->
    <etm-drawer :visible.sync="drawerVisible">
      <etm-layout-split line>
        <etm-title :title="drawerTitle" border size="big">
          <template v-if="drawerVisible && drawerType==='edit'" slot="tool">
            <el-button v-has="{authId: 'guardcare.room.query'}" plain size="mini" @click="cancelDrawer">取消</el-button>
            <el-button type="primary" size="mini" @click="popConfirmEdit">保存</el-button>
          </template>
          <template v-if="drawerVisible && drawerType==='detail'" slot="tool">
            <el-button v-has="{authId: 'guardcare.room.update'}" plain size="mini" @click="handleEdit">编辑</el-button>
          </template>
        </etm-title>
        <div class="drawerBody">
          <detail v-if="drawerVisible && drawerType==='detail' && roomId" :item-id="roomId" />
          <edit v-if="drawerVisible && drawerType==='edit' && roomId" ref="childPopForm" :type="drawerType" :item-id="roomId" />
        </div>

      </etm-layout-split>
    </etm-drawer>
  </div>
</template>

<script>
import baseMixin from '@/layout/mixin/baseMixin'
import edit from './edit'
import detail from './detail'
import {
  getRoom,
  postRoom,
  putRoom,
  delRoom,
  getRoomType,
  getRoomEnable
} from '@/api/guardcare/edu/roomManage'
export default {
  name: 'Index',
  components: {
    edit,
    detail
  },
  mixins: [baseMixin],
  data() {
    return {
      drawerPath: false,
      activeName: 'gradeManage',
      show: true,
      popVisibleEdit: false,

      drawerVisible: false,
      drawerType: 'detail',
      drawerTitle: '费用详情',

      formData: [
        {
          label: '场所/教室',
          type: 'input',
          prop: 'roomName',
          value: null,
          props: {
            placeholder: '请输入场所/教室'
          }
        },
        {
          label: '场所/教室类型',
          type: 'select',
          prop: 'roomType',
          value: null,
          props: {
            placeholder: '请选择场所/教室类型'
          },
          options: []
        }
      ],

      // 表格数据
      tableData: {
        content: []
      },
      columns: [ // 表格的列表头传值
        {
          label: '场所/教室类型',
          prop: 'roomType'
        },
        {
          label: '负责人',
          prop: 'employeeName'
        },
        {
          label: '可容纳人数',
          prop: 'num'
        }
      ],
      roomId: null
    }
  },
  created() {
    this.getRoomTypeData()
    this.init()
  },
  activated() {
    if (this.$store.state.guardcareDashboard.pageEntry === 'addRoom') {
      this.$nextTick(() => {
        this.addGrade()
        this.$store.commit('guardcareDashboard/SET_PAGEENTRY', null)
      })
    }
  },
  methods: {
    cancelDrawer() {
      if (this.drawerPath) {
        this.drawerVisible = false
        return
      }
      this.drawerType = 'detail'
    },
    setting() {
      this.$router.push({ path: '/guardcareSettings/roomManageSetting' })
    },
    toggle(val) {
      this.show = val
    },
    search() {
      this.reset()
    },
    resetSearch() {
      this.formData.forEach((item, index) => {
        item.value = null
      })
      this.reset()
    },
    reset() {
      this.pageInfo.pageNum = 1
      this.init()
    },
    currentChange(pageNum, pageSize) {
      this.pageInfo = {
        pageNum,
        pageSize
      }
      this.init()
    },

    // 查询场所类型列表
    getRoomTypeData() {
      getRoomType().then((res) => {
        this.formData[1].options = this.convertDataToOptions(res.data, 'name', 'id')
      })
    },

    // 获取列表
    init() {
      const param1 = {
        name: this.getValueByProp('roomName', this.formData) ? this.getValueByProp('roomName', this.formData) : null,
        roomTypeId: this.getValueByProp('roomType', this.formData) ? this.getValueByProp('roomType', this.formData) : null,
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize
      }
      getRoom(param1).then((res) => {
        const { data } = res
        this.tableData = data
      })
    },
    // 添加年级
    addGrade() {
      this.roomId = null
      this.drawerType = 'add'
      this.popVisibleEdit = true
    },

    // 状态改变
    switchChange(row) {
      if (row.id) {
        this.roomId = row.id
      }
      const param = {
        enable: row.enable
      }
      getRoomEnable(param, this.roomId).then((res) => {
        this.reset()
      })
    },

    // 修改
    handleEdit(row, drawerPath = false) {
      this.drawerPath = drawerPath
      if (row.id) {
        this.roomId = row.id
      }
      this.drawerType = 'edit'
      this.drawerTitle = '修改场所/教室'
      this.drawerVisible = true
    },

    // 删除
    handleDelete(row) {
      this.$etmTip.init({
        type: 'error',
        title: `确认删除该数据？`,
        content: `删除后将无法撤销，是否继续操作？`,
        confirmBtn: '删除',
        cancelBtn: '取消',
        cancel: () => {
          this.$etmTip.close()
        },
        confirm: () => {
          this.roomId = row.id
          delRoom(this.roomId).then((res) => {
            this.$etmTip.close()
            this.$message.success('已删除')
            this.reset()
          }).catch(() => {
            this.$etmTip.close()
          })
        }
      })
      this.$etmTip.open()
    },

    // 详情
    handleDetail(row) {
      this.drawerPath = false
      if (row.id) {
        this.roomId = row.id
      }
      this.drawerType = 'detail'
      this.drawerTitle = '场所/教室详情'
      this.drawerVisible = true
    },

    // 弹窗关闭
    popCloseEdit() {
      this.popVisibleEdit = false
    },

    // 弹窗确定
    popConfirmEdit() {
      this.$refs['childPopForm'].$refs['form'].$children[0].validate(valid => {
        if (valid) {
          const formData = this.$refs['childPopForm'].form
          const imageList = []
          let enable = false
          if (formData.previewSrcKey.length > 0) {
            formData.previewSrcKey.map((val) => {
              imageList.push({
                url: val
              })
            })
          }

          if (formData.enable === '1') {
            enable = true
          }
          const param = {
            employeeName: formData.principalName,
            attachment: imageList,
            enable: enable,
            num: formData.capacity,
            name: formData.roomName,
            description: formData.roomDesc,
            employeeId: formData.principal,
            roomTypeId: formData.roomType
          }

          if (this.drawerType === 'add') {
            postRoom(param).then((res) => {
              this.popVisibleEdit = false
              this.$message({
                message: '已添加',
                type: 'success'
              })
              this.reset()
            })
          } else if (this.drawerType === 'edit') {
            putRoom(param, this.roomId).then((res) => {
              // this.drawerVisible = false
              this.drawerType = 'detail'
              this.$message({
                message: '已修改',
                type: 'success'
              })
              this.reset()
            })
          }
        }
      })
    }

  }
}
</script>

<style scoped>

</style>
