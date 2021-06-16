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
          <span v-if="clazzName">{{ clazzName }} </span>
          <span v-if="semesterName">{{ semesterName }}</span>
          <span v-if="weekName">{{ weekName }}</span>
        </span>
      </template>
      <template slot="toolRight">
        <el-button
          slot="right"
          v-has="{authId: 'guardcare.scheduleWeek.excelExport'}"
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
              @handleEdit="handleEdit(item)"
            />
          </div>

          <EtmCellAddBtn
            v-if="data.cellList.length>0 &&!data.cellList[0].courseName"
            v-has="{authId: 'guardcare.scheduleWeek.create'}"
            :name="'添加课程'"
            @click.native.stop="handleAdd(data.cellList[0])"
          />
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
          :cell-data="cellData"
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
            :cell-data="cellData"
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
//   getScheduleWeek,
//   postScheduleWeek,
//   putScheduleWeek,
//   delScheduleWeek
// } from '@/api/guardcare/edu/scheduleManage'

import {
  getScheduleWeek,
  postScheduleWeek,
  putScheduleWeek,
  delScheduleWeek
} from '@/api/newDaycare/listEduGuardScheduleManage'
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
        value2Label: null
      },
      tableData: {
        title: '上课时段',
        time: '',
        content: []
      },
      scheduleId: null,
      labelId: null,
      cellData: '',
      semesterName: null,
      semesterNameId: null,
      weekName: null,
      weekNameId: null,
      clazzName: null

    }
  },
  methods: {
    init () {
      this.semesterName = this.formData[0].name
      this.weekName = this.formData[1].name
      this.clazzName = this.formDataSlot.value2Label

      this.semesterNameId = this.getValueByProp('semester', this.formData) ? this.getValueByProp('semester', this.formData) : null
      this.weekNameId = this.getValueByProp('week', this.formData) ? this.getValueByProp('week', this.formData) : null
      const param = {
        courseTermId: this.semesterNameId,
        courseTermWeekId: this.weekNameId,
        clazzId: this.formDataSlot.value2
      }
      getScheduleWeek(param).then((res) => {
        console.log(res, 'week查询')
        const { data } = res
        this.tableData.content = data
      })
    },

    // 切换上下周
    upDate (val) {
      // this.init()
    },

    // 添加
    handleAdd (cell) {
      this.cellData = cell
      this.labelId = 29
      this.scheduleId = null
      this.drawerType = 'add'
      this.popVisibleEdit = true
    },

    // 修改
    handleEdit (item) {
      if (item.id) {
        this.cellData = item
        this.scheduleId = item.courseTermWeekScheduleId
      }
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
          this.scheduleId = item.courseTermWeekScheduleId
          delScheduleWeek({ id: this.scheduleId }).then((res) => {
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

          const param = {
            courseTermId: this.semesterNameId,
            courseTermWeekId: this.weekNameId,
            courseScheduleId: formData.courseScheduleId,
            courseId: formData.course
          }

          if (this.drawerType === 'add') {
            postScheduleWeek(param).then((res) => {
              this.popVisibleEdit = false
              this.$message({
                message: '已添加',
                type: 'success'
              })
              this.init()
            })
          } else if (this.drawerType === 'edit') {
            param.id = this.scheduleId
            putScheduleWeek(param).then((res) => {
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
        name: `${this.clazzName} ${this.weekName}计划`,
        sheetName: this.weekName,
        opt: {
          formatter: (key, cell, v) => {
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
