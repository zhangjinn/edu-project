<template>
  <div>
    <etm-table-page
      :data="tableData"
      :columns="columns"
      :index="true"
      @currentChange="currentChange"
    >
      <etm-table-tool-bar slot="tool">
        <el-button
          slot="right"
          v-has="{authId: 'guardcare.courseClazz.create'}"
          type="primary"
          @click="handleAdd"
        >
          <i class="el-icon-plus" />&nbsp;&nbsp;添加课程
        </el-button>
      </etm-table-tool-bar>
      <el-table-column
        slot="left"
        label="课程名称"
      >
        <template v-slot="scoped">
          <etm-text
            v-if="!hasAuthOfBool('guardcare.courseClazz.query')"
            type="normal"
          >
            {{ scoped.row.name }}
          </etm-text>
          <etm-text
            v-else
            type="primary"
            @click="handleDetail(scoped.row)"
          >
            {{ scoped.row.name }}
          </etm-text>
        </template>
      </el-table-column>

      <el-table-column
        slot="right"
        label="操作"
      >
        <template v-slot="scoped">
          <etm-text
            v-has="{authId: 'guardcare.courseClazz.update'}"
            type="primary"
            @click="handleEdit(scoped.row, true)"
          >
            编辑
          </etm-text>
          <etm-text
            v-has="{authId: 'guardcare.courseClazz.remove'}"
            type="danger"
            @click="handleDelete(scoped.row)"
          >
            删除
          </etm-text>
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
        <edit
          v-if="popVisibleEdit"
          ref="childPopForm"
        />
      </div>
    </etm-pop>

    <!--详情/编辑抽屉-->
    <etm-drawer :visible.sync="drawerVisible">
      <etm-layout-split line>
        <etm-title
          :title="drawerTitle"
          border
          size="big"
        >
          <template
            v-if="drawerVisible && drawerType==='edit'"
            slot="tool"
          >
            <el-button
              v-has="{authId: 'guardcare.courseClazz.query'}"
              plain
              size="mini"
              @click="cancelDrawer"
            >
              取消
            </el-button>
            <el-button
              type="primary"
              size="mini"
              @click="popConfirmEdit"
            >
              保存
            </el-button>
          </template>
          <template
            v-if="drawerVisible && drawerType==='detail'"
            slot="tool"
          >
            <el-button
              v-has="{authId: 'guardcare.courseClazz.update'}"
              plain
              size="mini"
              @click="handleEdit"
            >
              编辑
            </el-button>
          </template>
        </etm-title>
        <div class="drawerBody">
          <detail
            v-if="drawerVisible && drawerType==='detail' && courseId"
            :item-id="courseId"
          />
          <edit
            v-if="drawerVisible && drawerType==='edit' && courseId"
            ref="childPopForm"
            :type="drawerType"
            :item-id="courseId"
          />
        </div>
      </etm-layout-split>
    </etm-drawer>
  </div>
</template>

<script>
import baseMixin from '@/layout/mixin/baseMixin'
import edit from './edit'
import detail from './detail'
// import {
//   getCourseClazz,
//   postCourseClazz,
//   putCourseClazz,
//   delCourseClazz
// } from '@/api/guardcare/edu/courseManage'

import {
  getCourseClazz,
  postCourseClazz,
  putCourseClazz,
  delCourseClazz
} from '@/api/newDaycare/listEduGuardCourseManage'
export default {
  name: 'PriceTable',
  components: {
    edit,
    detail
  },
  mixins: [baseMixin],
  data () {
    return {
      drawerPath: false,
      popVisibleEdit: false,

      drawerVisible: false,
      drawerType: 'detail',
      drawerTitle: '课程详情',
      formData: [],
      // 表格数据
      tableData: {
        content: []
      },
      columns: [ // 表格的列表头传值
        {
          label: '课程科目',
          prop: 'courseSubjectName'
        },
        {
          label: '学期',
          prop: 'courseTermName'
        },
        {
          label: '应用周次',
          prop: 'courseTermWeekName'
        },
        {
          label: '应用年级',
          prop: 'gradeName'
        }
      ],

      courseId: null
    }
  },

  methods: {
    currentChange (pageNum, pageSize) {
      this.pageInfo = {
        pageNum,
        pageSize
      }
      this.init()
    },

    // 重置
    reset () {
      this.pageInfo.pageNum = 1
      this.init()
    },

    // 获取年级列表
    init () {
      const param = {
        courseTermId: this.getValueByProp('semester', this.formData) ? this.getValueByProp('semester', this.formData) : null,
        gradeId: this.getValueByProp('grade', this.formData) ? this.getValueByProp('grade', this.formData) : null,
        name: this.getValueByProp('name', this.formData) ? this.getValueByProp('name', this.formData) : null,
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize
      }
      getCourseClazz(param).then((res) => {
        const { data } = res
        this.tableData = data
      })
    },

    // 添加
    handleAdd () {
      this.courseId = null
      this.drawerType = 'add'
      this.popVisibleEdit = true
    },

    // 修改
    handleEdit (row, drawerPath = false) {
      this.drawerPath = drawerPath
      if (row.id) {
        this.courseId = row.id
        console.log(this.courseId, 'courseId')
      }
      this.drawerTitle = '编辑班级课程'
      this.drawerType = 'edit'
      this.drawerVisible = true
    },

    // 删除
    handleDelete (row) {
      this.$etmTip.init({
        type: 'error',
        title: '确认删除该数据？',
        content: '删除后将无法撤销，是否继续操作？',
        confirmBtn: '删除',
        cancelBtn: '取消',
        cancel: () => {
          this.$etmTip.close()
        },
        confirm: () => {
          this.courseId = row.id
          delCourseClazz({ id: this.courseId }).then((res) => {
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
    handleDetail (row, drawerPath = false) {
      this.drawerPath = drawerPath
      if (row.id) {
        this.courseId = row.id
      }
      this.drawerTitle = '班级课程详情'
      this.drawerType = 'detail'
      this.drawerVisible = true
    },
    cancelDrawer (row) {
      if (this.drawerPath) {
        this.drawerVisible = false
        return
      }
      this.handleDetail(row)
    },

    // 弹窗关闭
    popCloseEdit () {
      this.popVisibleEdit = false
    },

    // 弹窗确定
    popConfirmEdit () {
      this.$refs.childPopForm.$refs.form.$children[0].validate(valid => {
        if (valid) {
          const formData = this.$refs.childPopForm.form
          // console.log(formData)
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
            gradeId: formData.grade,
            courseTermWeekId: formData.week,
            attachment: imageList,
            enable: enable,
            name: formData.courseTitle,
            courseTermId: formData.semester,
            introduction: formData.desc,
            courseSubjectId: formData.courseSubjects
          }

          if (this.drawerType === 'add') {
            postCourseClazz(param).then((res) => {
              this.popVisibleEdit = false
              this.$message({
                message: '已添加',
                type: 'success'
              })
              this.reset()
            })
          } else if (this.drawerType === 'edit') {
            param.id = this.courseId
            putCourseClazz(param).then((res) => {
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
