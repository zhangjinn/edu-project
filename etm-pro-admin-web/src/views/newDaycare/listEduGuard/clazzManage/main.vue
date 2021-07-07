<template>
  <div class="main-wrap">
    <etm-layout-split>
      <template slot="header">
        <etm-tabs v-model="activeName">
          <el-tab-pane label="班级管理" name="gradeManage">
            <etm-tool-bar v-show="show" v-model="formData" @search="search()" @reset="resetSearch">
              <el-form-item label="年级:">
                <el-select
                  ref="selection"
                  v-model="formDataSlot.value1"
                  filterable
                  placeholder="请选择年级"
                  @change="change"
                >
                  <el-option
                    v-for="item in options1"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <el-select
                  v-model="formDataSlot.value2"
                  filterable
                  placeholder="请选择班级"
                >
                  <el-option
                    v-for="item in options2"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>

            </etm-tool-bar>
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
            <el-button slot="right" v-has="{authId: 'guardcare.clazz.create'}" type="primary" @click="addGrade"><i class="el-icon-plus" />&nbsp;&nbsp;添加班级</el-button>
          </etm-table-tool-bar>
          <el-table-column slot="left" label="班级名称">
            <template v-slot="scoped">
              <etm-text v-if="!hasAuthOfBool('guardcare.clazz.query')" type="normal">{{ scoped.row.name }}</etm-text>
              <etm-text v-else type="primary" @click="handleDetail(scoped.row)">{{ scoped.row.name }}</etm-text>
            </template>
          </el-table-column>
          <el-table-column slot="right" label="操作">
            <template v-slot="scoped">
              <etm-text v-has="{authId: 'guardcare.clazz.update'}" type="primary" @click="handleEdit(scoped.row, true)">编辑</etm-text>
              <etm-text v-has="{authId: 'guardcare.clazz.remove'}" type="danger" @click="handleDelete(scoped.row)">删除</etm-text>
            </template>
          </el-table-column>
        </etm-table-page>
      </template>
    </etm-layout-split>

    <etm-pop
      :visible="popVisibleEdit"
      pop="complex"
      title="添加班级"
      confirm-btn="确定"
      cancel-btn="取消"
      @close="popCloseEdit"
      @cancel="popCloseEdit"
      @confirm="popConfirmEdit"
    >
      <div class="popContent">
        <add v-if="popVisibleEdit" ref="childPopForm" />
      </div>
    </etm-pop>

    <!--详情/编辑抽屉-->
    <etm-drawer :visible.sync="drawerVisible" type="big">
      <etm-layout-split line>
        <etm-title :title="drawerTitle" border size="big">
          <template v-if="drawerVisible && drawerType==='edit'" slot="tool">
            <el-button v-has="{authId: 'guardcare.clazz.query'}" plain size="mini" @click="cancelDrawer">取消</el-button>
            <el-button type="primary" size="mini" @click="handleSave">保存</el-button>
          </template>
          <template v-if="drawerVisible && drawerType==='detail'" slot="tool">
            <el-button v-has="{authId: 'guardcare.clazz.update'}" plain size="mini" @click="handleEdit">编辑</el-button>
          </template>
        </etm-title>
        <div class="drawerBody">
          <detail v-if="drawerVisible && drawerType==='detail' && clazzId" :item-id="clazzId" />
          <edit v-if="drawerVisible && drawerType==='edit' && clazzId" ref="childDrawerForm" :item-id="clazzId" />
          <enter-child v-if="drawerVisible && clazzId" :item-id="clazzId" @refresh="refresh" />
        </div>

      </etm-layout-split>
    </etm-drawer>

  </div>
</template>

<script>
import baseMixin from '@/layout/mixin/baseMixin'
import add from './add'
import edit from './edit'
import detail from './detail'
import enterChild from './enter'
import {
  getClazz,
  postClazz,
  putClazz,
  delClazz
} from '@/api/newDaycare/listEduGuardClazzManage'

import {
  getGrade
} from '@/api/newDaycare/listEduGuardGradeManage'

export default {
  name: 'Index',
  components: {
    add,
    edit,
    detail,
    enterChild
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

      formData: [],
      formDataSlot: {
        value1: null,
        value2: null
      },
      options1: [],
      options2: [],

      // 表格数据
      tableData: {
        content: []
      },
      columns: [ // 表格的列表头传值
        {
          label: '所属年级',
          prop: 'grade',
          align: 'left'
        },
        {
          label: '幼儿人数（人）',
          prop: 'clazzChildNum',
          align: 'left'
        },
        {
          label: '班主任',
          prop: 'headTeacher',
          align: 'left'
        },
        {
          label: '教师',
          prop: 'teacher',
          align: 'left'
        }
      ],
      clazzId: null

    }
  },
  created() {
    this.getGradeList()
    this.init()
  },
  activated() {
    if (this.$store.state.guardcareDashboard.pageEntry === 'addClazz') {
      this.$nextTick(() => {
        this.addGrade()
        this.$store.commit('guardcareDashboard/SET_PAGEENTRY', null)
      })
    }
  },
  methods: {
    refresh() {
      this.init()
    },
    getGradeList() {
      const param = {
        paged: false
      }
      getGrade(param).then((res) => {
        this.options1 = this.convertDataToOptions(res.data, 'name', 'id')
      })
    },
    getClazzList(id) {
      const param = {
        gradeId: id,
        paged: false
      }
      getClazz(param).then((res) => {
        this.options2 = this.convertDataToOptions(res.data, 'name', 'id')
      })
    },
    change(id) {
      this.formDataSlot.value2 = null
      this.getClazzList(id)
    },
    toggle(val) {
      this.show = val
    },
    search() {
      this.reset()
    },
    resetSearch() {
      this.formDataSlot.value1 = null
      this.formDataSlot.value2 = null
      this.reset()
    },
    reset() {
      this.pageInfo.pageNum = 1
      this.options2 = []
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
        gradeId: this.formDataSlot.value1,
        clazzId: this.formDataSlot.value2,
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize
      }
      getClazz(param1).then((res) => {
        const { data } = res
        this.tableData = data
        this.tableData.content.map((val, index) => {
          const headTeacher = []
          const teacher = []
          if (val.headTeachers) {
            val.headTeachers.map((v, i) => {
              headTeacher.push(v.name)
            })
            val.headTeacher = headTeacher.toString()
          }
          if (val.teachers) {
            val.teachers.map((v, i) => {
              teacher.push(v.name)
            })
            val.teacher = teacher.toString()
          }
        })
      })
    },
    cancelDrawer() {
      if (this.drawerPath) {
        this.drawerVisible = false
        return
      }
      this.drawerType = 'detail'
    },

    // 添加班级
    addGrade() {
      this.popVisibleEdit = true
    },

    // 修改班级
    handleEdit(row, drawerPath = false) {
      this.drawerPath = drawerPath
      if (row.id) {
        this.clazzId = row.id
      }
      this.drawerType = 'edit'
      this.drawerTitle = '修改班级'
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
          this.clazzId = row.id
          delClazz({ id: this.clazzId }).then((res) => {
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
        this.clazzId = row.id
      }
      this.drawerType = 'detail'
      this.drawerTitle = '班级详情'
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

          const clazzs = []
          formData.domains.map((val, index) => {
            const obj = {}
            obj.name = val.clazzName
            obj.clazzRoles = []
            val.headTeacherInfo.map((v, i) => {
              const role = {}
              role.employeeName = v.label
              role.employeeId = v.value
              role.type = 'HEADTEACHER'
              obj.clazzRoles.push(role)
            })
            val.teacherInfo.map((v, i) => {
              const role = {}
              role.employeeName = v.label
              role.employeeId = v.value
              role.type = 'TEACHER'
              obj.clazzRoles.push(role)
            })
            clazzs.push(obj)
          })

          const param = {
            gradeId: formData.gradeName,
            clazzes: clazzs
          }

          postClazz(param).then((res) => {
            this.popVisibleEdit = false
            this.$message({
              message: '已添加',
              type: 'success'
            })
            this.reset()
          })
        }
      })
    },

    // 抽屉保存编辑
    handleSave() {
      this.$refs['childDrawerForm'].$refs['form'].$children[0].validate(valid => {
        if (valid) {
          const formData = this.$refs['childDrawerForm'].form

          const clazzRoles = []
          formData.headTeacherInfo.map((v, i) => {
            const role = {}
            if (v.id) {
              role.id = v.id
            }
            role.employeeName = v.label
            role.employeeId = v.value
            role.type = 'HEADTEACHER'
            clazzRoles.push(role)
          })
          formData.teacherInfo.map((v, i) => {
            const role = {}
            if (v.id) {
              role.id = v.id
            }
            role.employeeName = v.label
            role.employeeId = v.value
            role.type = 'TEACHER'
            clazzRoles.push(role)
          })

          const param = {
            gradeId: formData.gradeName,
            name: formData.clazzName,
            clazzRoles: clazzRoles,
            id: this.clazzId
          }

          putClazz(param).then((res) => {
            // this.drawerVisible = false
            this.drawerType = 'detail'
            this.$message({
              message: '已修改',
              type: 'success'
            })
            this.reset()
          })
        }
      })
    }

  }
}
</script>

<style scoped>

</style>
