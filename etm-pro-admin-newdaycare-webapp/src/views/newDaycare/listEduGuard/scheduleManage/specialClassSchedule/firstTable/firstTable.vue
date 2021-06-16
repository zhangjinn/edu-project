<template>
  <div class="firstTable">
    <EtmWeeklyCalendar
      :table-data="tableData"
      :add="hasAuthOfBool('guardcare.scheduleCourseExtra.create')"
      :week-tag="false"
      @handleAdd="handleAdd"
      @handleUpDate="upDate"
    >
      <template slot="toolLeft">
        <etm-screen-tab
          v-model="categoryActive"
          title="视图"
          :options="categoryList"
          @change="changeView"
        />
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
              @handleDetail="handleDetail(item)"
            />
          </div>
        </div>
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
          :col-prop="colProp"
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
              plain
              @click="handleDetail"
            >
              取消
            </el-button>
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
          <detail
            v-if="drawerVisible && drawerType==='detail' && scheduleId"
            :item-id="scheduleId"
          />
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
import EtmWeeklyCalendar from '../../components/EtmWeeklyCalendar/index'
import EtmCell from './cell'
import edit from './edit'
import detail from './detail'

// import {
//   getScheduleTimeView,
//   postSchedule,
//   putSchedule,
//   delSchedule
// } from '@/api/guardcare/edu/scheduleManage'

import { getScheduleTimeView, postSchedule, putSchedule, delSchedule } from '@/api/newDaycare/listEduGuardScheduleManage'

export default {
  name: 'FirstTable',
  components: {
    edit,
    EtmWeeklyCalendar,
    EtmCell,
    detail
  },
  mixins: [baseMixin],
  data () {
    return {
      popVisibleEdit: false,
      drawerVisible: false,
      drawerType: 'add',
      drawerTitle: '添加课程安排',
      categoryActive: '1',
      categoryList: [
        {
          value: '1',
          name: '时间视图'
        },
        {
          value: '2',
          name: '班级视图'
        }
      ],
      formData: [],
      tableData: {
        title: '上课时段',
        content: []
      },
      scheduleId: null,
      labelId: null,
      colProp: null,
      semesterId: null

    }
  },

  methods: {
    // 改变视图
    changeView () {
      this.$emit('changeView', this.categoryActive)
    },
    init () {
      this.semesterId = this.getValueByProp('semester', this.formData) ? this.getValueByProp('semester', this.formData) : null
      const param = {
        specialCourseId: this.getValueByProp('courseName', this.formData) ? this.getValueByProp('courseName', this.formData) : null,
        roomId: this.getValueByProp('roomName', this.formData) ? this.getValueByProp('roomName', this.formData) : null,
        employeeId: this.getValueByProp('teacher', this.formData) ? this.getValueByProp('teacher', this.formData) : null,
        courseTermId: this.semesterId
      }
      getScheduleTimeView(param).then((res) => {
        const { data } = res
        this.tableData.content = data
      })
    },

    // 切换上下周
    upDate (val) {
      // this.init()
    },

    // 添加
    handleAdd (labelId, cellList, colProp) {
      this.labelId = labelId
      this.colProp = colProp
      this.scheduleId = null
      this.drawerType = 'add'
      this.popVisibleEdit = true
    },

    // 修改
    handleEdit (item) {
      if (item.specialCourseScheduleBatchId) {
        this.scheduleId = item.specialCourseScheduleBatchId
      }
      this.drawerTitle = '编辑课程安排'
      this.drawerType = 'edit'
      this.drawerVisible = true
    },

    // 详情
    handleDetail (item) {
      if (item.specialCourseScheduleBatchId) {
        this.scheduleId = item.specialCourseScheduleBatchId
      }
      this.drawerTitle = '课程安排详情'
      this.drawerType = 'detail'
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
          this.scheduleId = item.specialCourseScheduleBatchId
          delSchedule({ id: this.scheduleId }).then((res) => {
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
            scheduleTimeSettingId: formData.time,
            color: formData.color,
            childIds: formData.childIds,
            specialCourseId: formData.featuredPrograms,
            scheduleWeek: formData.schoolDay,
            roomId: formData.room,
            scheduleRoles: roles,
            courseTermId: this.semesterId
          }

          if (this.drawerType === 'add') {
            postSchedule(param).then((res) => {
              this.popVisibleEdit = false
              this.$message({
                message: '已添加',
                type: 'success'
              })
              this.init()
            })
          } else if (this.drawerType === 'edit') {
            param.id = this.scheduleId
            putSchedule(param).then((res) => {
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
    }
  }

}
</script>

<style scoped lang="scss">
.firstTable {
  ::v-deep .screenTab {
    margin-bottom: 0;
  }

  ::v-deep .EtmScreenTab-wrap {
    margin-bottom: 0;
  }
}
</style>
