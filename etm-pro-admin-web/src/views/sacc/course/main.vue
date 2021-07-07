<template>
  <div class="index-wrap">
    <etm-layout-split>
      <div slot="header">
        <etm-tabs v-model="currentTab" setting @toggle="toggle" @setting="setting">
          <el-tab-pane label="课程列表" name="first">
            <etm-tool-bar v-show="show" v-model="formData" @search="handleSearch" @reset="reset" />
          </el-tab-pane>
        </etm-tabs>
      </div>
      <div slot="body">
        <template v-if="currentTab === 'first'">
          <etm-table-page
            ref="etmTable"
            :data="tableData"
            :columns="columns"
            @currentChange="currentChange"
          >
            <etm-table-tool-bar slot="tool" v-model="toolBar">
              <div slot="right">
                <el-button type="primary" icon="el-icon-plus" @click="addCourse">新增课程</el-button>
              </div>
            </etm-table-tool-bar>
            <el-table-column slot="right" label="状态">
              <template slot-scope="scoped">
                <etm-status v-if="scoped.row.enable" type="active">启用</etm-status>
                <etm-status v-if="!scoped.row.enable" type="inactive">禁用</etm-status>
                <!--<etm-text v-if="scoped.row.enable" style="cursor:text" type="primary">启用</etm-text>-->
                <!--<etm-text v-else style="cursor:text" type="danger">禁用</etm-text>-->
              </template>
            </el-table-column>
            <el-table-column slot="right" label="操作">
              <template v-slot="{row}">
                <etm-text type="primary" @click="edit(row)">修改</etm-text>
                <!--<etm-text type="danger" @click="remove(row)">删除</etm-text>-->
              </template>
            </el-table-column>
          </etm-table-page>
        </template>
      </div>
    </etm-layout-split>

  </div>
</template>

<script>
import { queryCourseCategorySelect, queryCourseListPage } from '@/api/course'
import baseMixin from '@/layout/mixin/baseMixin'

/**
   *  2020/4/15 15:22
   *  haijinsha
   */
export default {
  name: 'Main',
  components: {},
  filters: {},
  mixins: [baseMixin],
  props: {},
  data() {
    return {
      currentTab: 'first',
      show: true,
      course: {
        type: '1'
      },
      toolBar: [
        {
          label: '在园人数',
          type: 'input',
          prop: 'in',
          value: '',
          props: {
            placeholder: '请输入会员姓名'
          }
        },
        {
          label: '在园人数',
          type: 'input',
          prop: 'customerName',
          value: '',
          props: {
            placeholder: '请输入会员姓名'
          }
        }
      ],
      formData: [
        {
          label: '课程名称',
          type: 'input',
          prop: 'courseName',
          value: '',
          props: { placeholder: '请输入课程名称' }
        },
        {
          label: '课程类型',
          type: 'select',
          prop: 'courseType',
          value: '',
          props: { placeholder: '请选择课程分类' },
          events: {},
          options: []
        }
      ],
      tableData: {
        content: []
      },
      columns: [
        {
          label: '课程名称',
          prop: 'courseName'
        },
        {
          label: '分类',
          prop: 'categoryName'
        },
        {
          label: '适用月龄',
          prop: 'suitable'
        }
      ],
      pageInfo: {}
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    queryCourseCategorySelect({ showAll: false }).then(res => {
      this.formData.find(item => item.prop === 'courseType').options = res.data.map(item => {
        return {
          label: item.courseCategoryName,
          value: item.courseCategoryId
        }
      })
    })
    this.init()
  },
  methods: {
    toggle(val) {
      this.show = val
    },
    init() {
      queryCourseListPage({
        courseName: this.getValueByProp('courseName'),
        categoryId: this.getValueByProp('courseType'),
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize
      }).then(res => {
        res.data.content.forEach(item => {
          item.suitable = item.monthAgeStart + '-' + item.monthAgeEnd
        })
        this.tableData = res.data
      })
    },
    currentChange(pageNum, pageSize) {
      this.pageInfo = { pageNum, pageSize }
      this.init()
    },
    handleSearch(e) {
      this.init()
    },
    reset() {
      this.formData.forEach(item => {
        item.value = item.default
      })
    },
    addCourse() {
      this.$store.dispatch('course/set_course_id', '')
      this.$emit('switch', { target: 'addCourse', index: 0 })
    },
    edit(row) {
      this.$store.dispatch('course/set_course_id', row.courseId)
      this.$emit('switch', { target: 'editCourse', index: 1 })
    },
    remove(row) {
    },
    setting() {
      this.$emit('switch', { target: 'setting', index: 2 })
    }
  }
}
</script>

<style lang="scss" scoped>
  .index-wrap {

  }
</style>
