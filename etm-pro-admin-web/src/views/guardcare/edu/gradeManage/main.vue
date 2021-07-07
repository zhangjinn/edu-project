<template>
  <div class="main-wrap">
    <etm-layout-split>
      <template slot="header">
        <etm-tabs v-model="activeName">
          <el-tab-pane label="年级管理" name="gradeManage">
            <etm-tool-bar v-show="show" v-model="formData" @search="search()" @reset="resetSearch" />
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
              <el-button v-has="{authId: 'guardcare.grade.create'}" type="primary" @click="addGrade"><i class="el-icon-plus" />&nbsp;&nbsp;添加年级</el-button>
            </div>
          </etm-table-tool-bar>
          <el-table-column slot="left" label="年级名称">
            <template v-slot="scoped">
              <etm-text type="primary" @click="handleDetail(scoped.row)">{{ scoped.row.name }}</etm-text>
            </template>
          </el-table-column>
          <el-table-column slot="right" label="操作">
            <template v-slot="scoped">
              <etm-text v-has="{authId: 'guardcare.grade.update'}" type="primary" @click="handleEdit(scoped.row, true)">编辑</etm-text>
              <etm-text v-has="{authId: 'guardcare.grade.remove'}" type="danger" @click="handleDelete(scoped.row)">删除</etm-text>
            </template>
          </el-table-column>
        </etm-table-page>
      </template>
    </etm-layout-split>

    <!--添加年级弹框-->
    <etm-pop
      :visible="popVisibleEdit"
      pop="simple"
      title="添加年级"
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
            <el-button plain size="mini" @click="cancelDrawer">取消</el-button>
            <el-button type="primary" size="mini" @click="popConfirmEdit">保存</el-button>
          </template>
          <template v-if="drawerVisible && drawerType==='detail'" slot="tool">
            <el-button v-has="{authId: 'guardcare.grade.update'}" plain size="mini" @click="handleEdit">编辑</el-button>
          </template>
        </etm-title>
        <div class="drawerBody">
          <detail v-if="drawerVisible && drawerType==='detail' && gradeId" :item-id="gradeId" />
          <edit v-if="drawerVisible && drawerType==='edit' && gradeId" ref="childPopForm" :type="drawerType" :item-id="gradeId" />
        </div>

      </etm-layout-split>
    </etm-drawer>
  </div>
</template>

<script>
import baseMixin from '@/layout/mixin/baseMixin'
import { parseTime } from '@/utils/index'
import edit from './edit'
import detail from './detail'
import {
  getGrade,
  postGrade,
  putGrade,
  delGrade
} from '@/api/guardcare/edu/gradeManage'
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
          label: '年级',
          type: 'input',
          prop: 'gradeName',
          value: null,
          props: {
            placeholder: '请输入年级'
          }
        }
      ],

      // 表格数据
      tableData: {
        content: []
      },
      columns: [ // 表格的列表头传值
        {
          label: '操作时间',
          prop: 'updateTime',
          align: 'left'
        }
      ],
      gradeId: null

    }
  },
  created() {
    this.init()
  },
  activated() {
    if (this.$store.state.guardcareDashboard.pageEntry === 'addGrade') {
      this.$nextTick(() => {
        this.addGrade()
        this.$store.commit('guardcareDashboard/SET_PAGEENTRY', null)
      })
    }
  },
  methods: {
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

    // 获取列表
    init() {
      const param1 = {
        name: this.getValueByProp('gradeName', this.formData) ? this.getValueByProp('gradeName', this.formData) : null,
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize
      }
      getGrade(param1).then((res) => {
        const { data } = res
        this.tableData = data
        this.tableData.content.map((val) => {
          val.updateTime = parseTime(val.updateTime, '{y}-{m}-{d}')
        })
      })
    },

    // 添加年级
    addGrade() {
      this.gradeId = null
      this.drawerType = 'add'
      this.popVisibleEdit = true
    },

    // 修改年级
    handleEdit(row, drawerPath = false) {
      this.drawerPath = drawerPath
      if (row.id) {
        this.gradeId = row.id
      }
      this.drawerType = 'edit'
      this.drawerTitle = '修改年级'
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
          this.gradeId = row.id
          delGrade(this.gradeId).then((res) => {
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
    handleDetail(row, drawerPath = false) {
      this.drawerPath = drawerPath
      if (row.id) {
        this.gradeId = row.id
      }
      this.drawerType = 'detail'
      this.drawerTitle = '年级详情'
      this.drawerVisible = true
    },
    cancelDrawer() {
      if (this.drawerPath) {
        this.drawerVisible = false
        return
      }
      this.drawerType = 'detail'
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

          const param = {
            name: formData.name
          }
          if (this.drawerType === 'add') {
            postGrade(param).then((res) => {
              this.popVisibleEdit = false
              this.$message({
                message: '已添加',
                type: 'success'
              })
              this.reset()
            })
          } else if (this.drawerType === 'edit') {
            putGrade(param, this.gradeId).then((res) => {
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
