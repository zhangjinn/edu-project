<template>
  <div class="index-wrap">
    <div class="custom-wrap">
      <etm-layout-split>
        <div slot="header">
          <etm-tabs v-model="activeName" :setting="false" :show-toggle="false">
            <el-tab-pane name="gradeManage" label="年级管理">
              <etm-tool-bar v-model="formData" @search="handleSearch" @reset="reset" />
            </el-tab-pane>
          </etm-tabs>
        </div>
        <div slot="body">
          <etm-table-page
            :data="tableData"
            :columns="columns"
            selection
            @currentChange="currentChange"
            @selection-change="handleSelectionChange"
          >
            <etm-table-tool-bar slot="tool">
              <div slot="right">
                <el-button type="primary" icon="el-icon-plus" @click="addGrade">添加年级
                </el-button>
              </div>
            </etm-table-tool-bar>
            <el-table-column slot="right" label="操作" fixed="left" width="180">
              <template slot-scope="scoped">
                <etm-text
                  type="primary"
                  @click="editGrade(scoped.row.id, true)"
                >编辑
                </etm-text>
                <etm-text
                  type="danger"
                  @click="remove(scoped.row.id, true)"
                >删除
                </etm-text>
              </template>
            </el-table-column>
          </etm-table-page>
        </div>
      </etm-layout-split>
    </div>

    <etm-pop
      :visible="isShowAddPopup"
      pop="complex"
      title="添加年级"
      confirm-btn="确定"
      cancel-btn="取消"
      @close="addGradeClose"
      @confirm="addGradeConfirm"
      @cancel="addGradeClose"
    >
      <addGrade
        v-if="isShowAddPopup"
        ref="addGrade"
        :add-grade-data="addGradeData"
      />
    </etm-pop>

    <etm-drawer
      :visible.sync="isShowEditPopup"
    >
      <etm-layout-split
        v-if="isShowEditPopup"
      >
        <template>
          <editGrade
            ref="editGrade"
            :edit-grade-data="editGradeData"
            @editCancel="editGradeCancel"
            @editConfirm="editGradeConfirm"
          />
        </template>
      </etm-layout-split>
    </etm-drawer>
  </div>
</template>

<script>
/**
 * index create by Administrator
 * createTime 2021/1/15 10:07
 */
import addGrade from '@/views/newDaycare/listEduGuard/gradeManage/components/addGrade'
import editGrade from '@/views/newDaycare/listEduGuard/gradeManage/components/editGrade'
import { createGrade, queryGradeDetail, getGrade, removeGrade, updateGrade } from '@/api/newDaycare/listEduGuardGradeManage'
import { parseTime } from '@/utils'

export default {
  name: 'Index',
  components: {
    addGrade,
    editGrade
  },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      activeName: 'gradeManage',
      search: {},
      pageInfo: {
        pageNum: 1,
        pageSize: 10
        // paged: true
      },
      addGradeData: {}, // 添加班级data
      editGradeData: {}, // 编辑班级data
      tableData: {
        content: []
      },
      columns: [
        {
          label: '年级名称',
          prop: 'name',
          fixed: 'left'
        },
        {
          label: '操作时间',
          prop: 'updateTime',
          fixed: 'left'
        }
      ],
      formData: [
        {
          label: '年级',
          type: 'input',
          value: '',
          prop: 'name',
          props: {
            placeholder: '请输入年级'
          }
        }
      ],
      isShowAddPopup: false,
      isShowEditPopup: false
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    this.init(this.search)
  },
  methods: {
    init(search = {}) {
      const params = Object.assign({
        name: ''
      }, search, this.pageInfo)
      console.log(params, 'params')
      getGrade(params).then(res => {
        this.tableData = res.data
        const result = this.tableData['content']
        result.forEach((cur, index) => {
          result[index].updateTime = parseTime(cur.updateTime)
          console.log(cur.updateTime, 'time')
        })
        this.tableData['content'] = result
      })
    },
    currentChange(pageNum, pageSize) {
      this.pageInfo = {
        pageNum,
        pageSize
      }
      this.init(this.search)
    },
    // 处理选择
    handleSelectionChange(e) {
      this.selected = e
    },

    // 查询
    handleSearch(event) {
      const result = {}
      this.pageInfo.pageNum = 1
      event.forEach(cur => {
        result[cur.prop] = cur.value
      })
      this.search = result
      // console.log(event, 'event')
      this.init(this.search)
    },
    // 添加年级
    addGrade() {
      this.isShowAddPopup = true
    },
    // 删除班级
    async remove(id) {
      await removeGrade({ id }).then(res => {
        if (res.code === 0) {
          this.$message.success('删除成功')
        } else {
          this.$message.error(res.detail)
        }
      })

      this.init()
    },
    // 编辑班级
    editGrade(id) {
      this.isShowEditPopup = true
      queryGradeDetail({ id }).then(res => {
        this.editGradeData = res.data
        this.editGradeData.id = id
      })
    },
    reset() {

    },

    // 关闭添加班级
    addGradeClose() {
      this.isShowAddPopup = false
    },

    // 确认添加班级
    async addGradeConfirm() {
      this.isShowAddPopup = false
      const params = this.$refs.addGrade.addGradeData
      console.log(params, 'params')
      await createGrade(params).then(res => {
        console.log(res, 'res')
        if (res.code === 0) {
          this.$message.success('新增成功')
        } else {
          this.$message.error(res.detail)
        }
      })

      this.addGradeData = {}
      this.init()
    },

    // 确认编辑班级
    async editGradeConfirm() {
      this.isShowEditPopup = false
      const params = this.$refs.editGrade.editGradeData
      console.log(params, 'params')
      await updateGrade(params).then(res => {
        console.log(res, '更新')
        if (res.code === 0) {
          this.$message.success('更新成功')
        } else {
          this.$message.error(res.detail)
        }
      })

      this.init()
    },

    // 取消编辑班级
    editGradeCancel() {
      this.isShowEditPopup = false
    }
  }

}
</script>
<style lang="scss" scoped>
  .index-wrap {

  }
</style>
