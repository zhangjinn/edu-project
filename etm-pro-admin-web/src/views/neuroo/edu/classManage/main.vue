<template>
  <div class="index-wrap">
    <etm-layout-split>

      <div slot="header">
        <etm-tabs v-model="currentTab" @toggle="toggle">
          <el-tab-pane label="班级列表" name="first">
            <etm-tool-bar v-show="show" v-model="formData" @search="handleSearch" @reset="reset" />
          </el-tab-pane>
        </etm-tabs>
      </div>
      <div slot="body">
        <template v-if="currentTab === 'first'">
          <etm-table-page :columns="columns" :data="tableData" index-type="index" border @currentChange="currentChange">
            <etm-table-tool-bar slot="tool" v-model="toolBar">
              <!--<el-checkbox border>选中所有页(共100条)</el-checkbox>-->
              <div slot="right">
                <el-button type="primary" @click="addClazz"><i class="el-icon-plus" />&nbsp;&nbsp;新增班级</el-button>
              </div>
            </etm-table-tool-bar>
            <el-table-column slot="right" label="操作">
              <template v-slot="{row}">
                <etm-text type="primary" @click="edit(row)">修改</etm-text>
              </template>
            </el-table-column>
          </etm-table-page>
        </template>
      </div>
    </etm-layout-split>
  </div>
</template>

<script>
import baseMixin from '@/layout/mixin/baseMixin'
import { queryCanDeleteCourseByClazzId, queryClassPage, removeClazzByClazzId } from '@/api/neuroo/edu/clazzManage'
import { querySubOrganizationList } from '@/api/base/base'
import { parseTime } from '@/utils'

/**
 *  2020/4/17 9:26
 *  haijinsha
 */
export default {
  name: 'Index',
  filters: {},
  mixins: [baseMixin],
  props: {},
  data() {
    return {
      currentTab: 'first',
      show: true,
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
          label: '班级名称',
          type: 'input',
          prop: 'clazzName',
          value: '',
          props: {
            placeholder: '请输入班级名称'
          }
        },
        {
          label: '班主任',
          type: 'input',
          prop: 'headTeacherName',
          value: '',
          props: {
            placeholder: '请输入老师姓名'
          }
        },
        {
          label: '所属园区',
          type: 'select',
          prop: 'school',
          value: '',
          options: [
            {
              label: '天河园区',
              value: '1'
            },
            {
              label: '番禺园区',
              value: '2'
            }
          ],
          props: {
            placeholder: '请选择所属园区',
            clearable: true,
            filterable: true
          }
        }
      ],
      tableData: {
        content: []
      },
      columns: [
        {
          label: '所属园区',
          prop: 'schoolName'
        },
        {
          label: '班级名称',
          prop: 'clazzName'
        },
        {
          label: '班主任',
          prop: 'headTeacherName'
        },
        {
          label: '适用月龄',
          prop: 'month'
        },
        {
          label: '班级容量',
          prop: 'fullNumber'
        },
        {
          label: '备注',
          prop: 'remarks'
        }
      ]
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    querySubOrganizationList({ tagCode: 'SCHOOL' }).then(res => {
      this.getObjectByProp('school').options = this.convertDataToOptions(res.data, 'name', 'id')
    })
    this.init()
  },
  methods: {
    toggle(val) {
      this.show = val
    },
    setting() {

    },
    init() {
      queryClassPage({
        clazzName: this.getValueByProp('clazzName'),
        headTeacherName: this.getValueByProp('headTeacherName'),
        schoolId: this.getValueByProp('school'),
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize
      }).then(res => {
        this.tableData = res.data
        this.tableData.content.forEach(item => {
          item.month = ''
          if (item.monthAgeStart && item.monthAgeEnd) {
            item.month = item.monthAgeStart + '-' + item.monthAgeEnd
          }
        })
      })
    },
    handleSearch(e) {
      this.init()
    },
    reset() {
      this.formData.forEach(item => {
        item.value = item.default
      })
    },
    currentChange(pageNum, pageSize) {
      this.pageInfo = {
        pageNum, pageSize
      }
      this.init()
    },
    addClazz() {
      this.$store.commit('neuroo/classManage/set_clazz_id', '')
      this.$emit('switch', { target: 'addClass', index: 0 })
      // this.$router.push({ name: 'addclazz' })
    },
    edit(row) {
      console.log(row)
      this.$store.commit('neuroo/classManage/set_clazz_id', row.clazzId)
      this.$emit('switch', { target: 'editClass', index: 1 })
    },
    remove(row) {
      queryCanDeleteCourseByClazzId({ clazzId: row.clazzId }).then(res => {
        if (Array.isArray(res.data) && res.data.length) {
          // 已有排课，不能自动排课
          let li = ''
          res.data.forEach(v => {
            li += `<li>${v.courseName} ${parseTime(v.date, '{y}-{m}-{d}')}</li>`
          })
          const html = `<ul>${li}</ul><div>有预约学员不能删除</div>`
          this.$etmTip.init({
            type: 'warn',
            title: '排课冲突',
            html,
            confirmBtn: '确定',
            confirm: () => {
              this.$etmTip.close()
            }
          })
          this.$etmTip.open()
        } else {
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
              removeClazzByClazzId({ clazzId: row.clazzId }).then(res => {
                this.$message.success('操作成功')
                this.$etmTip.close()
                this.init()
              })
            }
          })
          this.$etmTip.open()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .index-wrap {

  }
</style>
