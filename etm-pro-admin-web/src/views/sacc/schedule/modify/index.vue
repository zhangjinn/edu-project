<template>
  <div class="modify">
    <etm-layout-split>
      <div class="header">
        <h6>
          {{ $t('schedule.scheduelTimeTitle') }}：{{ week }} {{ startDay }}~{{ endDay }}
          <i style="margin-right: 10px;" />
          {{ $t('schedule.popLabelBelongClass') }}：{{ belongClass }}
        </h6>
      </div>
      <schedule-table
        v-if="dateArr.length"
        :table-data="tableData"
        :date-arr="dateArr"
        :edit-cell="handleCellEdit"
        :delete-issue="handleIssueDelete"
      />
    </etm-layout-split>

    <etm-pop
      :visible="pop"
      pop="simple"
      :title="$t('schedule.popTitleSelectSchedule')"
      :confirm-btn="$t('schedule.confirmBtnText')"
      :cancel-btn="$t('schedule.cancelBtnText')"
      @open="handlePopOpen"
      @close="handlePopClose"
      @confirm="handlePopConfirm"
      @cancel="handlePopCancel"
    >
      <modify-form ref="form" />
    </etm-pop>
  </div>
</template>
<script>
const dayArr = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
import scheduleTable from '../components/scheduleTable'
import etmPop from '@/layout/main/EtmPop'
import modifyForm from './form'
import { getScheduleDetail, deleteScheduleItem, addScheduleContent } from '@/api/schedule'
import { getDateObj, insertString } from '../util'

export default {
  components: {
    scheduleTable,
    etmPop,
    modifyForm
  },
  data() {
    return {
      tableData: [],
      dateArr: [],
      pop: false,
      belongClass: '',
      week: '',
      startDay: '',
      endDay: '',
      scheduleIdArr: [], // 保存横向日期相关的id
      scheduleTimeIdArr: [], // 保存纵向时间相关的id
      rowIndex: undefined, // 操作的表格的横坐标（从0开始）
      columnIndex: undefined, // 操作的表格的纵坐标（从0开始）
      scheduleTimeId: undefined,
      scheduleId: undefined
    }
  },
  created() {
    // 获取日程详情内容
    getScheduleDetail({ weekScheduleId: this.$store.state.schedule.handleScheduleId }).then(res => {
      const { data: { scheduleList, clazzName, weekNumber }} = res
      this.belongClass = clazzName
      this.week = insertString(this.$t('schedule.weekCountQuantityText'), weekNumber, 4)
      scheduleList.forEach((day, i) => {
        const dateObj = getDateObj(day.date)
        const weekday = dayArr[i]
        if (i === 0) {
          this.startDay = `${dateObj.month}-${dateObj.day}`
        }
        if (i === 6) {
          this.endDay = `${dateObj.month}-${dateObj.day}`
        }
        this.dateArr.push(`${dateObj.month}.${dateObj.day}`) // 处理表格横向的日期显示
        this.scheduleIdArr.push(day.scheduleId) // 保存表格横向日期的id
        day.scheduleTimeList.forEach((time, index) => {
          if (i === 0) {
            this.scheduleTimeIdArr.push(time.scheduleTimeId) // 保存表格纵向时间的id
            this.tableData.push({ // 处理表格纵向的时间显示
              date: `${time.startTime}-${time.endTime}`,
              rowIndex: index
            })
          }
          this.$set(this.tableData[index], weekday, time.contentList || []) // 插入每一个时间段的项目内容
        })
      })
    // eslint-disable-next-line handle-callback-err
    }).catch(err => {
      this.$message.error(this.$t('schedule.getScheduleDetailFailTip'))
      this.$emit('jump', 'manage')
    })
  },
  methods: {
    handleCellEdit(scope) {
      this.rowIndex = scope.row.rowIndex
      this.columnIndex = scope.column.index
      this.scheduleTimeId = this.scheduleTimeIdArr[scope.row.rowIndex]
      this.scheduleId = this.scheduleIdArr[scope.column.index]
      this.handlePopOpen()
    },
    handleIssueDelete(scope, index) {
      const deleteItem = scope.row[dayArr[scope.column.index]][index]
      deleteScheduleItem({ scheduleItemContentId: deleteItem.scheduleItemContentId }).then(res => {
        this.$message({
          type: 'success',
          message: this.$t('schedule.deleteSuccessTip')
        })
        this.refreshTableData()
      // eslint-disable-next-line handle-callback-err
      }).catch(err => {
        this.$message.error(this.$t('schedule.deleteFailTip'))
      })
    },
    handlePopOpen() {
      this.pop = true
    },
    handlePopClose() {
      this.pop = false
      this.$refs.form.clearForm() // 清空表单内容
    },
    handlePopConfirm() {
      const { type, inspectInfo, foodInfo, custom, courseTypeId, courseInfo } = this.$refs.form.form
      let scheduleItemContentName
      let courseId = 0
      let typeStr = ''
      switch (type) {
        case 1: // 课程类型
          typeStr = this.$t('schedule.scheduleTypeCourse')
          scheduleItemContentName = courseInfo
          courseId = courseTypeId
          break
        case 2: // 餐食类型
          typeStr = this.$t('schedule.scheduleTypeFood')
          scheduleItemContentName = foodInfo
          break
        case 3: // 检查类型
          typeStr = this.$t('schedule.scheduleTypeInspect')
          scheduleItemContentName = inspectInfo
          break
        case 4: // 自定义类型
          typeStr = this.$t('schedule.scheduleTypeCustom')
          scheduleItemContentName = custom
      }
      addScheduleContent({
        scheduleTimeId: this.scheduleTimeId,
        type: typeStr,
        scheduleItemContentName,
        courseId,
        scheduleId: this.scheduleId
      }).then(res => {
        this.$message({
          type: 'success',
          message: this.$t('schedule.addScheduleContentSuccessTip')
        })
        this.refreshTableData()
      // eslint-disable-next-line handle-callback-err
      }).catch(err => {
        this.$message.error(this.$t('schedule.addScheduleContentFailTip'))
      })
      this.handlePopClose()
    },
    handlePopCancel() {
      this.handlePopClose()
    },
    refreshTableData() {
      getScheduleDetail({ weekScheduleId: this.$store.state.schedule.handleScheduleId }).then(res => {
        const { data: { scheduleList }} = res
        scheduleList.forEach((day, index) => {
          const weekday = dayArr[index]
          day.scheduleTimeList.forEach((time, i) => {
            this.$set(this.tableData[i], weekday, time.contentList || [])
          })
        })
      // eslint-disable-next-line handle-callback-err
      }).catch(err => {
        this.$message.error(this.$t('schedule.queryScheduleListFailTip'))
      })
    }
  }
}
</script>

<style scoped lang="scss">
.modify {
  /*height: 100%;*/
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    /*padding: 0 24px;*/
    height: 56px;
    h6 {
      font-size: 14px;
      margin: 0;
      @include c_text_color();
      font-weight: normal;
    }
    & >>> .el-button {
      width: 80px;
    }
  }
}
</style>
