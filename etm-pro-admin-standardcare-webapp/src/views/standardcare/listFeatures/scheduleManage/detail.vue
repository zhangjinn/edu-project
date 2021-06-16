<template>
  <!--  <etm-main-body>-->
  <div class="detail">
    <EtmWeeklyCalendar
      ref="xlsxTable"
      :table-data="tableData"
      :week-tag="false"
      :add="false"
    >
      <template slot="toolLeft">
        <span class="tooLeft">
          <span v-if="scheduleName">{{ scheduleName }}</span>
        </span>
      </template>
      <template slot="toolRight">
        <el-button
          slot="right"
          type="primary"
          @click="handleBatchAdd"
        >
          批量添加内容
        </el-button>
      </template>
      <template v-slot:cell="data">
        <!--          <div v-if="!data.cellList" class="noSchedule">休</div>-->
        <template>
          <cell-list
            v-if="data.cellList.scheduleType"
            :data="data.cellList"
            @handleDelete="handleDelete(data.cellList)"
            @handleEdit="handleEdit(data.cellList, data.colProp, data.labelId, data.labelName)"
          />
          <EtmCellAddBtn
            v-if="!data.cellList.scheduleType"
            @click.native.stop="handleAdd(data.cellList, data.colProp, data.labelId, data.labelName)"
          />
        </template>
      </template>
    </EtmWeeklyCalendar>

    <!--添加弹框-->
    <etm-pop
      :visible="popVisible"
      pop="complex"
      :title="popTitle"
      confirm-btn="确定"
      cancel-btn="取消"
      @close="popVisible = false"
      @cancel="popVisible = false"
      @confirm="popConfirm"
    >
      <div class="popContent">
        <cell-edit
          v-if="popVisible"
          ref="childPopForm"
          :type="proType"
          :label-id="labelId"
          :label-name="labelName"
          :cell-list="cellList"
          :time-period-options="timePeriodOptions"
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
            v-if="drawerVisible && proType==='edit'"
            slot="tool"
          >
            <el-button
              size="mini"
              type="primary"
              @click="popConfirm"
            >
              保存
            </el-button>
          </template>
          <template
            v-if="drawerVisible && proType==='detail'"
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
          <cell-edit
            v-if="drawerVisible && proType==='edit'"
            ref="childPopForm"
            :type="proType"
            :label-id="labelId"
            :label-name="labelName"
            :cell-list="cellList"
          />
        </div>
      </etm-layout-split>
    </etm-drawer>
  </div>
<!--  </etm-main-body>-->
</template>

<script>
// import etmMainBody from '@/components/EtmMainBody'
import baseMixin from '@/layout/mixin/baseMixin'
import EtmWeeklyCalendar from '@/components/EtmWeeklyCalendar'
import cellList from './cellList'
import cellEdit from './cellEdit'
import EtmCellAddBtn from '@/components/EtmCellAddBtn'

import {
  updateGridWeekScheduleTemplate,
  queryGridWeekScheduleTemplate,
  updateBatchGridWeekScheduleTemplate
} from '@/api/standardcare/listFeatures/scheduleManage'
export default {
  name: 'Index',
  components: {
    cellEdit,
    EtmWeeklyCalendar,
    cellList,
    EtmCellAddBtn
  },
  mixins: [baseMixin],
  data () {
    return {
      popVisible: false,
      drawerVisible: false,
      proType: 'add',
      popTitle: '批量添加内容',
      drawerTitle: '编辑内容',

      formData: [],
      tableData: {
        title: '时段',
        content: []
      },
      timePeriodOptions: [],
      scheduleName: null,
      scheduleId: null,
      labelId: null,
      labelName: null,
      colProp: null,
      cellList: {}

    }
  },

  // 监听,当路由发生变化的时候执行
  watch: {
    $route: {
      handler: function (val, oldVal) {
        if (val.name === 'standardcare_scheduleDetail') {
          this.scheduleId = parseInt(val.query.scheduleId)
          this.scheduleName = val.query.scheduleName
          this.init()
        }
      },
      // 深度观察监听
      immediate: true,
      deep: true
    }
  },

  methods: {
    init () {
      queryGridWeekScheduleTemplate({
        weekScheduleTemplateId: this.scheduleId
      }).then((res) => {
        this.tableData.content = res.data

        this.timePeriodOptions = []
        res.data.map(item => {
          this.timePeriodOptions.push(
            {
              label: item.label.name,
              value: item.label.id
            }
          )
        })
      })
    },

    // 添加内容
    handleAdd (item, colProp, labelId, labelName) {
      this.cellList = item
      this.labelId = labelId
      this.labelName = labelName
      this.colProp = colProp
      this.proType = 'add'
      this.popTitle = '添加内容'
      this.popVisible = true
    },

    // 批量添加内容
    handleBatchAdd () {
      this.proType = 'batchAdd'
      this.popTitle = '批量添加内容'
      this.popVisible = true
    },

    // 修改内容
    handleEdit (item, colProp, labelId, labelName) {
      this.cellList = item
      this.labelId = labelId
      this.labelName = labelName
      this.colProp = colProp
      this.proType = 'edit'
      this.drawerVisible = true
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
          updateGridWeekScheduleTemplate({
            scheduleItemTemplateId: item.scheduleItemId,
            scheduleType: null,
            scheduleTypeId: item.scheduleTypeId,
            bgcolor: item.bgcolor
          }).then((res) => {
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
    popConfirm () {
      this.$refs.childPopForm.$refs.form.$children[0].validate(valid => {
        if (valid) {
          const formData = this.$refs.childPopForm.form

          let param = {}
          if (this.proType === 'batchAdd') {
            param = {
              scheduleId: this.scheduleId,
              intervalId: formData.timePeriod,
              weeks: formData.repeatDay,
              scheduleType: formData.subjectName,
              scheduleTypeId: formData.subject,
              bgcolor: formData.color
            }
            updateBatchGridWeekScheduleTemplate(param).then((res) => {
              this.$message({
                message: '已添加',
                type: 'success'
              })

              this.popVisible = false
              this.init()
            })
          } else {
            param = {
              scheduleItemTemplateId: this.cellList.scheduleItemId,
              scheduleType: formData.subjectName,
              scheduleTypeId: formData.subject,
              bgcolor: formData.color
            }
            updateGridWeekScheduleTemplate(param).then((res) => {
              this.$message({
                message: '已添加',
                type: 'success'
              })

              this.popVisible = false
              this.drawerVisible = false
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
.detail {
  background: #fff;
  padding: 24px;
}

.tooLeft {
  span {
    margin-right: 8px;
  }
}

.noSchedule {
  color: #999;
  font-size: 14px;
  text-align: center;
}
</style>
