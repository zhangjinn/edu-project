<template>
  <div class="courseType-wrap">
    <etm-title>课程类型设置</etm-title>
    <etm-table-page :columns="columns" :data="tableData" :show-page="false">
      <etm-table-tool-bar slot="tool">
        <div slot="right">
          <el-button type="primary" @click="addType">添加类型</el-button>
        </div>
      </etm-table-tool-bar>
      <el-table-column slot="right" label="状态">
        <template slot-scope="scoped">
          <etm-status v-if="scoped.row.enable" type="active">启用</etm-status>
          <etm-status v-else type="inactive">禁用</etm-status>
          <!--<el-switch v-model="scoped.row.enable" disabled />-->
        </template>
      </el-table-column>
      <el-table-column slot="right" label="操作">
        <template v-slot="scoped">
          <etm-text v-if="scoped.row.editable" type="primary" @click="edit(scoped.row)">编辑</etm-text>
          <etm-text type="danger" @click="remove(scoped.row)">删除</etm-text>
        </template>
      </el-table-column>
    </etm-table-page>

    <etm-pop :visible="visible" :title="status === 'create' ? '新增类型' : '修改类型'" pop="simple" @confirm="confirm" @close="cancel">
      <add-type ref="addType" v-model="formData" />
    </etm-pop>
  </div>
</template>

<script>
import { addCategory, deleteCourseTypeByCourseCategoryId, queryCourseCategorySelect, updateCategoryByCourseCategoryId } from '@/api/course'
import EtmPop from '@/layout/main/EtmPop/src/EtmPop'
import AddType from '@/views/sacc/course/components/addType'

/**
   *  2020/4/16 14:57
   *  haijinsha
   */
export default {
  name: 'CourseType',
  components: {
    AddType,
    EtmPop
  },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      options: {
        firstDayOfWeek: 4
      },
      value1: '',
      columns: [
        {
          label: '名称',
          prop: 'courseCategoryName'
        }

      ],
      tableData: {
        totalPages: 1,
        totalElements: 0,
        pageNum: 1,
        pageSize: 10,
        content: []
      },
      visible: false,
      formData: {
        courseCategoryName: '',
        enable: false
      }
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    this.init()
    this.$etmTip.init()
  },
  methods: {
    init() {
      queryCourseCategorySelect({ showAll: true }).then(res => {
        this.tableData.content = res.data
      })
    },
    edit(row) {
      this.status = 'edit'
      this.visible = true
      this.formData = Object.assign({}, row)
    },
    remove(row) {
      this.currentRow = row
      this.$etmTip.init({
        type: 'error',
        title: `确认删除该课程？`,
        content: `删除后将无法撤销，是否继续操作？`,
        confirmBtn: '删除',
        cancelBtn: '取消',
        confirm: () => {
          this.handleRemove()
        },
        cancel: () => {
          this.$etmTip.close()
        }
      })
      this.$etmTip.open()
    },
    handleRemove() {
      deleteCourseTypeByCourseCategoryId({ courseCategoryId: this.currentRow.courseCategoryId }).then(res => {
        this.$message.success('删除成功')
        this.handleCancel()
        this.init()
      })
    },
    handleCancel() {
      this.$etmTip.close()
    },
    change(val) {
    },
    addType() {
      this.formData = {}
      this.visible = true
      this.status = 'create'
    },
    confirm() {
      this.$refs['addType'].validator().then(res => {
        const { courseCategoryId, courseCategoryName, enable } = this.formData
        if (this.status === 'edit') {
          updateCategoryByCourseCategoryId({ courseCategoryId, courseCategoryName, enable }).then(res => {
            this.$message.success('更新成功')
            this.init()
          })
        } else if (this.status === 'create') {
          addCategory({ courseCategoryId, courseCategoryName, enable }).then(res => {
            this.$message.success('创建成功')
            this.init()
          })
        }
        this.cancel()
      })
    },
    cancel() {
      this.visible = false
      this.$refs['addType'].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
  .courseType-wrap {

  }
</style>
