<template>
  <div class="recipesDetail">
    <EtmWeeklyCalendar
      v-if="customizeTime"
      ref="xlsxTable"
      :table-data="tableData"
      :add="false"
      :customize-time="customizeTime"
      @handleUpDate="handleUpDate"
    >
      <template slot="toolLeft">
        <span class="clazzName">{{ clazzName }}</span>&nbsp;&nbsp;
        <span>{{ scheduleName }}</span>
      </template>

      <span class="weekDayRange">
        <span>{{ weekDayRange.weekStartDay }}</span>至
        <span>{{ weekDayRange.weekEndDay }}</span>&nbsp;&nbsp;
        <span>{{ weekDayRange.yearName }}</span>&nbsp;&nbsp;
        第&nbsp;<span>{{ weekDayRange.weekName }}</span>&nbsp;周
      </span>

      <template slot="toolRight">
        <el-button
          slot="right"
          plain
          class="exportBtn"
          @click="exportTable"
        >
          导出Excel
        </el-button>
      </template>
      <template v-slot:cell="data">
        <div>
          <cellList
            type="scheduleDetail"
            :data="data.cellList"
            @handleEdit="handleEdit(data.cellList, data.labelName)"
            @handleDelete="handleDelete(data.cellList)"
          />
        </div>
        <EtmCellAddBtn
          v-if="data.cellList.scheduleTypeId && data.cellList.list.length===0"
          @click.native.stop="handleAdd(data.cellList, data.labelName)"
        />
      </template>
    </EtmWeeklyCalendar>

    <!--添加日程内容-->
    <etm-pop
      :visible="popVisible"
      pop="simple"
      :title="popTitle"
      confirm-btn="确定"
      cancel-btn="取消"
      append-to-body
      @close="popVisible = false"
      @cancel="popVisible = false"
      @confirm="popConfirm"
    >
      <div>
        <etm-form
          ref="form"
          :model="form"
          type="dialog"
        >
          <el-form-item
            label="时段"
          >
            <span>{{ form.timePeriod }}</span>
          </el-form-item>

          <el-form-item
            label="日程类目"
          >
            <span>{{ form.category }}</span>
          </el-form-item>

          <el-form-item
            label="日程内容"
            prop="content"
            :rules="formValidate.nullValueRule(true,'请输入日程内容')"
          >
            <el-input
              v-model="form.content"
              maxlength="20"
              placeholder="请输入日程内容"
            />
          </el-form-item>
        </etm-form>
      </div>
    </etm-pop>
  </div>
</template>

<script>
import formValidate from '@/utils/rules'
import baseMixin from '@/layout/mixin/baseMixin'
// import etmMainBody from '@/components/EtmMainBody'
import EtmWeeklyCalendar from '@/components/EtmWeeklyCalendar/index'
import EtmCellAddBtn from '@/components/EtmCellAddBtn'
import cellList from './cellList'
import {
  queryWeekScheduleDetail,
  addScheduleItemList,
  updateScheduleItemList,
  removeScheduleItemList
} from '@/api/standardcare/clazzScheduleCare'
export default {
  name: 'ScheduleDetail',
  components: {
    EtmWeeklyCalendar,
    cellList,
    EtmCellAddBtn
  },
  mixins: [baseMixin],
  data () {
    return {
      formValidate,
      popVisible: false,
      popTitle: '添加内容',
      popType: 'add',
      form: {
        timePeriod: '',
        category: '',
        content: ''
      },
      tableData: {
        title: '时段',
        content: []
      },
      weekDayRange: {
        weekStartDay: '',
        weekEndDay: '',
        tuesday: '', // 和element-ui 周日历默认周二同步
        weekName: '',
        yearName: ''
      },
      clazzId: null,
      clazzName: null,
      scheduleName: null,
      customizeTime: null,
      scheduleItemId: null,
      scheduleItemListId: null

    }
  },

  // 监听,当路由发生变化的时候执行
  watch: {
    $route: {
      handler: function (val, oldVal) {
        this.clazzId = null
        this.scheduleName = null
        this.customizeTime = null
        if (val.name === 'standardcare_clazzScheduleDetail') {
          this.clazzId = this.$route.query.clazzId
          this.clazzName = this.$route.query.clazzName
          this.scheduleName = this.$route.query.scheduleName
          this.customizeTime = this.$route.query.weekStartDate
        }
      },
      // 深度观察监听
      immediate: true,
      deep: true
    }
  },

  methods: {
    // 切换周食谱
    handleUpDate (dateObj) {
      // console.log('handleUpDate=====')
      this.weekDayRange.weekStartDay = dateObj.weekStartDay
      this.weekDayRange.weekEndDay = dateObj.weekEndDay
      this.weekDayRange.tuesday = dateObj.tuesday
      this.weekDayRange.yearName = new Date(this.weekDayRange.tuesday).getFullYear()
      this.weekDayRange.weekName = getWeek(new Date(this.weekDayRange.tuesday))
      this.init()
      function getWeek (date) {
        let time = null
        let week = null
        const checkDate = new Date(date)
        checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7))
        time = checkDate.getTime()
        checkDate.setMonth(0)
        checkDate.setDate(1)
        week = Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1
        return week
      }
    },
    init () {
      queryWeekScheduleDetail({
        startDate: this.weekDayRange.weekStartDay,
        endDate: this.weekDayRange.weekEndDay,
        clazzId: this.clazzId
      }).then((res) => {
        this.tableData.content = res.data
      })
    },
    handleEdit (cell, timePeriod) {
      this.form.timePeriod = timePeriod
      this.form.category = cell.scheduleType
      this.form.content = cell.list.length ? cell.list[0].content : ''
      this.scheduleItemId = cell.scheduleItemId
      this.scheduleItemListId = cell.list.length ? cell.list[0].id : ''
      this.popType = 'edit'
      this.popTitle = '编辑内容'
      this.popVisible = true
    },
    handleDelete (cell) {
      this.scheduleItemListId = cell.list.length ? cell.list[0].id : ''
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
          removeScheduleItemList({
            scheduleItemListId: this.scheduleItemListId
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
    handleAdd (cell, timePeriod) {
      this.form.timePeriod = timePeriod
      this.form.category = cell.scheduleType
      this.form.content = cell.list.length ? cell.list[0].content : ''
      this.scheduleItemId = cell.scheduleItemId

      this.popType = 'add'
      this.popTitle = '添加内容'
      this.popVisible = true
    },
    // 导出
    exportTable () {
      this.exportTableToExcel({
        ref: this.$refs.xlsxTable.$refs.weeklyCalendarTable.$el,
        name: `${this.clazzName} (${this.scheduleName})`,
        sheetName: this.scheduleName,
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
    },
    popConfirm () {
      this.$refs.form.$children[0].validate(valid => {
        if (valid) {
          if (this.popType === 'add') {
            addScheduleItemList({
              scheduleItemId: this.scheduleItemId,
              content: this.form.content
            }).then((res) => {
              this.$message.success('已添加')
              this.init()
              this.popVisible = false
            })
          } else if (this.popType === 'edit') {
            updateScheduleItemList({
              scheduleItemListId: this.scheduleItemListId,
              scheduleItemId: this.scheduleItemId,
              content: this.form.content
            }).then((res) => {
              this.$message.success('已修改')
              this.init()
              this.popVisible = false
            })
          }
        }
      })
    }
  }

}
</script>

<style scoped lang="scss">
.recipesDetail {
  background-color: $white;
  padding: 24px;

  .weekDayRange {
    margin-right: 24px;
  }
}

.exportBtn {
  margin-left: 24px;
}

.nonSchoolDay {
  color: #999;
  font-size: 14px;
  text-align: center;
}

.showIngredients {
  margin-left: 24px;
  margin-right: 24px;
}

</style>
