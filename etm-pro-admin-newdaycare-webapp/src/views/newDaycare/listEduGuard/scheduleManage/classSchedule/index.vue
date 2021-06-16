<template>
  <div>
    <EtmWeeklyCalendar
      ref="xlsxTable"
      :table-data="tableData"
      :week-tag="false"
      :add="false"
      :title-time="false"
      @handleUpDate="upDate"
    >
      <template slot="toolLeft">
        <span class="tooLeft">
          <span v-if="semesterName">{{ semesterName }}</span>
          <span v-if="clazzName">{{ clazzName }} </span>
          <span v-if="semesterName || clazzName">课表</span>
        </span>
      </template>
      <template slot="toolRight">
        <el-button
          slot="right"
          v-has="{authId: 'guardcare.scheduleCourseClazz.excelExport'}"
          type="primary"
          @click="exportTable"
        >
          导出Excel
        </el-button>
      </template>
      <template v-slot:cell="data">
        <div v-if="data.cellList">
          <div
            v-for="(item,index) in data.cellList"
            :key="index"
          >
            <EtmCell
              :data="item"
              @handleDelete="handleDelete(item)"
              @handleEdit="handleEdit(item, data.colProp)"
            />
          </div>
        </div>
        <EtmCellAddBtn
          v-if="!data.cellList || data.cellList.length<1"
          v-has="{authId: 'guardcare.scheduleCourseClazz.update'}"
          @click.native.stop="handleAdd(data.labelId, data.colProp)"
        />
      </template>
    </EtmWeeklyCalendar>

    <!--添加弹框-->
    <etm-pop
      :visible="popVisibleEdit"
      pop="complex"
      title="添加课程安排"
      confirm-btn="确定"
      cancel-btn="取消"
      @close="popCloseEdit"
      @cancel="popCloseEdit"
      @confirm="popConfirmEdit"
    >
      <div class="popContent">
        <edit
          v-if="popVisibleEdit && drawerType==='add'"
          ref="childPopForm"
          :type="drawerType"
          :label-id="labelId"
          :semester-id="semesterId"
          :grade-id="gradeId"
          :clazz-id="clazzId"
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
              size="mini"
              type="primary"
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
              size="mini"
              plain
              @click="handleEdit"
            >
              编辑
            </el-button>
          </template>
        </etm-title>
        <div class="drawerBody">
          <edit
            v-if="drawerVisible && drawerType==='edit' && scheduleId"
            ref="childPopForm"
            :type="drawerType"
            :item-id="scheduleId"
          />
        </div>
      </etm-layout-split>
    </etm-drawer>
  </div>
</template>

<script>
import baseMixin from '@/layout/mixin/baseMixin'
import EtmWeeklyCalendar from '../components/EtmWeeklyCalendar/index'
import EtmCell from './cell'
import edit from './edit'
import EtmCellAddBtn from '../components/EtmWeeklyCalendar/components/EtmCellAddBtn'

// import {
//   getScheduleClazz,
//   postScheduleClazz,
//   putScheduleClazz,
//   delScheduleClazz
// } from '@/api/guardcare/edu/scheduleManage'

// import {
//   getScheduleClazz,
//   postScheduleClazz,
//   putScheduleClazz,
//   delScheduleClazz
// } from '@/api/newDaycare/listEduGuardScheduleManage'

import { getScheduleClazz, postScheduleClazz, putScheduleClazz, delScheduleClazz } from '@/api/newDaycare/listEduGuardScheduleManage'

export default {
  name: 'Index',
  components: {
    edit,
    EtmWeeklyCalendar,
    EtmCell,
    EtmCellAddBtn
  },
  mixins: [baseMixin],
  data () {
    return {
      popVisibleEdit: false,

      drawerVisible: false,
      drawerType: 'add',
      drawerTitle: '添加课程安排',

      formData: [],
      formDataSlot: {
        value1: null,
        value2: null,
        value1Label: null,
        value2Label: null
      },
      tableData: {
        title: '上课时段',
        content: []
      },
      scheduleId: null,
      labelId: null,
      colProp: null,
      semesterName: null,
      semesterId: null,
      gradeId: null,
      clazzName: null,
      clazzId: null

    }
  },

  methods: {
    init () {
      this.semesterName = this.formData[0].name
      this.semesterId = this.getValueByProp('semester', this.formData) ? this.getValueByProp('semester', this.formData) : null
      this.gradeName = this.formDataSlot.value1Label
      this.gradeId = this.formDataSlot.value1
      this.clazzName = this.formDataSlot.value2Label
      this.clazzId = this.formDataSlot.value2

      const param = {
        courseTermId: this.semesterId,
        clazzId: this.clazzId
      }
      getScheduleClazz(param).then((res) => {
        const { data } = res
        this.tableData.content = data
      })
    },

    // 切换上下周
    upDate (val) {
      // this.init()
    },

    // 添加
    handleAdd (labelId, colProp) {
      this.labelId = labelId
      this.colProp = colProp
      this.scheduleId = null
      this.drawerType = 'add'
      this.popVisibleEdit = true
    },

    // 修改
    handleEdit (item, colProp) {
      if (item.id) {
        this.scheduleId = item.id
      }
      this.colProp = colProp
      this.drawerTitle = '编辑课程安排'
      this.drawerType = 'edit'
      this.drawerVisible = true
    },

    // 弹窗关闭
    popCloseEdit () {
      this.popVisibleEdit = false
    },

    // 删除
    handleDelete (item) {
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
          this.scheduleId = item.id
          delScheduleClazz({ id: this.scheduleId }).then((res) => {
            this.$etmTip.close()
            this.$message.success('已删除')
            this.init()
          }).catch(() => {
            this.$etmTip.close()
          })
        }
      })
      this.$etmTip.open()
    },

    // 弹窗确定
    popConfirmEdit () {
      this.$refs.childPopForm.$refs.form.$children[0].validate(valid => {
        if (valid) {
          const formData = this.$refs.childPopForm.form

          const roles = []
          formData.headTeacherInfo.map((v, i) => {
            const role = {}
            if (v.id) {
              role.id = v.id
            }
            role.employeeName = v.label
            role.employeeId = v.value
            role.type = 'LECTURER'
            roles.push(role)
          })
          formData.teacherInfo.map((v, i) => {
            const role = {}
            if (v.id) {
              role.id = v.id
            }
            role.employeeName = v.label
            role.employeeId = v.value
            role.type = 'ASSISTANT'
            roles.push(role)
          })
          const param = {
            week: this.colProp,
            gradeId: formData.grade,
            scheduleTimeSettingId: formData.time,
            color: formData.color,
            clazzId: formData.clazz,
            courseTermId: formData.semester,
            courseSubjectId: formData.subject,
            courseScheduleRoleList: roles
          }

          if (this.drawerType === 'add') {
            postScheduleClazz(param).then((res) => {
              this.popVisibleEdit = false
              this.$message({
                message: '已添加',
                type: 'success'
              })
              this.init()
            })
          } else if (this.drawerType === 'edit') {
            param.id = this.scheduleId
            putScheduleClazz(param).then((res) => {
              this.drawerVisible = false
              this.$message({
                message: '已修改',
                type: 'success'
              })
              this.init()
            })
          }
        }
      })
    },
    // 导出班级课表
    exportTable () {
      // console.log('ref', this.$refs.xlsxTable.$children[2].$el)
      this.exportTableToExcel({
        ref: this.$refs.xlsxTable.$children[2].$el,
        name: `${this.clazzName}课表`,
        sheetName: this.weekName,
        opt: {
          formatter: (key, cell, v) => {
            console.log('v:')
            console.log(v)
            if (v && typeof v === 'string') {
              if (key.replace(/[^0-9]/ig, '') === '1') {
                return v.replaceAll(' ', '\n')
              } else {
                return v.replaceAll('编辑删除', '\n')
              }
            }
            return v
          }
        }
      })
    }
  }

}
</script>

<style scoped lang="scss">
  .tooLeft {
    span {
      margin-right: 8px;
    }
  }
</style>
