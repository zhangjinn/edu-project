<template>
  <div>
    <etm-table-page
      :data="tableData"
      :columns="columns"
      :index="true"
      @currentChange="currentChange"
    >
      <etm-table-tool-bar slot="tool">
        <div slot="right">
          <el-button v-has="{authId: 'guardcare.courseExtra.create'}" type="primary" @click="handleAdd"><i class="el-icon-plus" />&nbsp;&nbsp;添加课程</el-button>
        </div>
      </etm-table-tool-bar>
      <el-table-column slot="left" label="课程名称">
        <template v-slot="scoped">
          <etm-text v-if="!hasAuthOfBool('guardcare.courseExtra.query')" type="normal">{{ scoped.row.name }}</etm-text>
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
          <etm-text v-has="{authId: 'guardcare.courseExtra.update'}" type="primary" @click="handleEdit(scoped.row, true)">编辑</etm-text>
          <etm-text v-has="{authId: 'guardcare.courseExtra.remove'}" type="danger" @click="handleDelete(scoped.row)">删除</etm-text>
        </template>
      </el-table-column>
    </etm-table-page>

    <!--添加弹框-->
    <etm-pop
      :visible="popVisibleEdit"
      pop="complex"
      title="添加课程"
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
            <el-button v-has="{authId: 'guardcare.courseExtra.query'}" plain size="mini" @click="cancelDrawer">取消</el-button>
            <el-button type="primary" size="mini" @click="popConfirmEdit">保存</el-button>
          </template>
          <template v-if="drawerVisible && drawerType==='detail'" slot="tool">
            <el-button v-has="{authId: 'guardcare.courseExtra.update'}" plain size="mini" @click="handleEdit">编辑</el-button>
          </template>
        </etm-title>
        <div class="drawerBody">
          <detail v-if="drawerVisible && drawerType==='detail' && courseId" :item-id="courseId" />
          <edit v-if="drawerVisible && drawerType==='edit' && courseId" ref="childPopForm" :type="drawerType" :item-id="courseId" />
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
  getCourseSpecial,
  postCourseSpecial,
  putCourseSpecial,
  delCourseSpecial,
  putCourseSpecialStatus
} from '@/api/guardcare/edu/courseManage'
export default {
  name: 'MaterialTable',
  components: {
    edit,
    detail
  },
  mixins: [baseMixin],
  data() {
    return {
      drawerPath: false,
      popVisibleEdit: false,

      drawerVisible: false,
      drawerType: 'detail',
      drawerTitle: '特色课程详情',
      formData: [],
      // 表格数据
      tableData: {
        content: []
      },
      columns: [ // 表格的列表头传值
        {
          label: '上课时长（分钟）',
          prop: 'courseHour'
        },
        {
          label: '已报名（人）',
          prop: 'purchasedNum'
        }

      ],
      courseId: null

    }
  },

  methods: {

    currentChange(pageNum, pageSize) {
      this.pageInfo = {
        pageNum,
        pageSize
      }
      this.init()
    },

    // 重置
    reset() {
      this.pageInfo.pageNum = 1
      this.init()
    },

    init() {
      const param1 = {
        name: this.getValueByProp('name', this.formData) ? this.getValueByProp('name', this.formData) : null,
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize
      }
      getCourseSpecial(param1).then((res) => {
        const { data } = res
        this.tableData = data
      })
    },

    // 添加
    handleAdd() {
      this.courseId = null
      this.drawerType = 'add'
      this.popVisibleEdit = true
    },
    cancelDrawer() {
      if (this.drawerPath) {
        this.drawerVisible = false
        return
      }
      this.drawerType = 'detail'
    },
    // 修改
    handleEdit(row, drawerPath = false) {
      this.drawerPath = drawerPath
      if (row.id) {
        this.courseId = row.id
      }
      this.drawerTitle = '编辑特色课程'
      this.drawerType = 'edit'
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
          this.courseId = row.id
          delCourseSpecial(this.courseId).then((res) => {
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
        this.courseId = row.id
      }
      this.drawerTitle = '特色课程详情'
      this.drawerType = 'detail'
      this.drawerVisible = true
    },

    // 弹窗关闭
    popCloseEdit() {
      this.popVisibleEdit = false
    },

    // 状态改变
    switchChange(row) {
      if (row.id) {
        this.courseId = row.id
      }
      const param = {
        enable: row.enable
      }
      putCourseSpecialStatus(param, this.courseId).then((res) => {
        this.reset()
      })
    },

    // 弹窗确定
    popConfirmEdit() {
      this.$refs['childPopForm'].$refs['form'].$children[0].validate(valid => {
        if (valid) {
          const formData = this.$refs['childPopForm'].form
          const imageList = []
          if (formData.previewSrcKey.length > 0) {
            formData.previewSrcKey.map((val) => {
              imageList.push({
                url: val
              })
            })
          }
          let enable = false
          if (formData.enable === '1') {
            enable = true
          }
          const param = {
            attachment: imageList,
            price: formData.price,
            enable: enable,
            num: formData.childNum,
            name: formData.name,
            scheduleColor: formData.color,
            courseHour: formData.long,
            age: formData.age,
            introduction: formData.desc
          }

          if (this.drawerType === 'add') {
            postCourseSpecial(param).then((res) => {
              this.popVisibleEdit = false
              this.$message({
                message: '已添加',
                type: 'success'
              })
              this.reset()
            })
          } else if (this.drawerType === 'edit') {
            putCourseSpecial(param, this.courseId).then((res) => {
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

<style scoped lang="scss">
</style>
