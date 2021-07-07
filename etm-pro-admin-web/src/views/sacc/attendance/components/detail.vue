<template>
  <div class="index-wrap">
    <etm-title>{{ editData.customerInfo.customerName }}宝宝的会员考勤</etm-title>
    <!--<div>-->
    <!--  <div class="desc">-->
    <!--    说明: &nbsp;&nbsp;准时 &nbsp; 准时出勤 / 准时离园 &nbsp;&nbsp;&nbsp;&nbsp; <span class="chi">迟</span> &nbsp;迟到<span class="chi">&nbsp;&nbsp;&nbsp;&nbsp;-->
    <!--      退</span>&nbsp;早退<span-->
    <!--      class="yan"-->
    <!--    >&nbsp;&nbsp;&nbsp;&nbsp;延</span>&nbsp;延长签出 &nbsp;&nbsp;&nbsp;&nbsp;- &nbsp;无记录-->
    <!--  </div>-->
    <!--</div>-->

    <el-calendar v-model="currentDate">
      <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
      <!--@click="handleClick(date, data)"-->
      <template
        slot="dateCell"
        slot-scope="{date, data}"
      >
        <div
          :class="[
            isWeekEnd(date, data) ? 'weekEnd': '',
            isEdit(date, data) ? 'no-edit' : '',
            isCurrentMonth(date, data) ? 'current-month' : '',
            isNextMonth(date, data) ? 'next-month' : '',
            isPreMonth(date, data) ? 'pre-month' : ''
          ]"
          class="box"
          @mouseenter="mouseEnter(data,date)"
          @mouseleave="mouseLeave(data,date)"
        >
          <!--日期-->
          <div class="calendar-day">{{ data.day.split('-')[1] }}-{{ data.day.split('-')[2] }}</div>
          <!--日期对应的考勤日志-->
          <template v-for="(item, index) in dateData">
            <template v-if="data.day.split('-')[0] === item.year">
              <template v-if="data.day.split('-')[1] === item.month">
                <div
                  v-if="data.day.split('-')[2] === item.day"
                  :key="index"
                  class="item-box"
                >
                  <!--<div v-for="(record, idx) of item.records" :key="idx">-->
                  <!--  {{ record.type }}: {{ record.time }}-->
                  <!--</div>-->
                  <div v-if="item.enterStatus" class="item">
                    <div class="title">送园：</div>
                    <div class="content" :class="[hasBeLate(item.enterStatus) && 'chi']">{{ item.enterStatusZH }} {{
                      item.enterStatusDescriptionZH
                    }}
                    </div>
                  </div>
                  <div v-if="item.leaveStatus" class="item">
                    <div class="title">离园：</div>
                    <div class="content" :class="[hasBeLate(item.leaveStatus) && 'chi']">{{ item.leaveStatusZH }} {{
                      item.leaveStatusDescription
                    }}
                    </div>
                  </div>
                  <div :class="[{'active': item.visible && hasEdit(data,date)}]" class="btn-edit" @click="handleClick(item)">修改</div>
                </div>
              </template>
            </template>
          </template>
        </div>
      </template>
    </el-calendar>

    <etm-pop
      :title="`修改考勤(${editData.date})`"
      :visible="visible"
      cancel-btn="取消"
      width="800px"
      @cancel="cancel"
      @close="cancel"
      @confirm="confirm"
    >
      <edit-attendance ref="edit" :edit-data="editData" />
    </etm-pop>
  </div>
</template>

<script>
import EtmTitle from '@/layout/main/EtmTitle/src/EtmTitle'
import EtmPop from '@/layout/main/EtmPop/src/EtmPop'
import EditAttendance from '@/views/sacc/attendance/components/edit'
import { queryAttendanceCalendarById, updateAttendanceCalendarById } from '@/api/attendance'
import { parseTime } from '@/utils'
import { getEnumKeyByValue, getEnumValueByKey } from '@/enums'

/**
   *  2020/4/14 10:54
   *  haijinsha
   */
export default {
  name: 'Index',
  components: { EditAttendance, EtmPop, EtmTitle },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      currentDate: new Date(),
      dateData: [],
      visible: false,
      editData: {
        customerInfo: this.$store.state.attendance.attendanceCustomInfo,
        attendanceDate: '',
        enterStatus: '',
        enterStatusDescription: '',
        leaveStatus: '',
        leaveStatusDescription: ''
      },
      currentData: {}
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    this.init()
  },
  methods: {
    // 大于当前日期时不可以编辑
    hasEdit(data, date) {
      return date.getTime() < Date.now()
    },
    hasBeLate(status) {
      return getEnumKeyByValue('准时') !== status
    },
    changeVisible(data, date) {
      const result = this.dateData.find(item => {
        return item.date === data.day
      })
      if (result) {
        result.visible = data.visible
      } else {
        this.dateData.push({
          date: data.day,
          year: data.day.split('-')[0],
          month: data.day.split('-')[1],
          day: data.day.split('-')[2],
          visible: false
        })
      }
    },
    mouseEnter(data, date) {
      data.visible = true
      this.changeVisible(data, date)
    },
    mouseLeave(data, date) {
      data.visible = false
      this.changeVisible(data, date)
    },
    init() {
      if (!this.editData.customerInfo.id) {
        return this.$emit('switch', 'attendance')
      }
      const startTime = parseTime(new Date(new Date().setMonth(new Date().getMonth() - 1)), '{y}-{m}-{d}')
      const endTime = parseTime(new Date(new Date().setMonth(new Date().getMonth() + 1)), '{y}-{m}-{d}')
      queryAttendanceCalendarById({ customerId: this.$store.state.attendance.attendanceCustomInfo.id, startTime, endTime }).then(res => {
        this.dateData = res.data.map(item => {
          item.date = parseTime(item.attendanceDate, '{y}-{m}-{d}')
          item.year = item.date.split('-')[0]
          item.month = item.date.split('-')[1]
          item.day = item.date.split('-')[2]
          item.visible = false
          item.enterStatusZH = getEnumValueByKey(item.enterStatus)
          item.leaveStatusZH = getEnumValueByKey(item.leaveStatus)
          if (getEnumValueByKey(item.enterStatus) === '请假') {
            item.enterStatusDescription = item.enterStatusDescription.split('~')
            item.enterStatusDescriptionZH = item.enterStatusDescription.join('-')
          }

          return item
        })
      })
    },
    isWeekEnd(date) {
      const weekDay = new Date(date).getDay()
      // return weekDay === 0 || weekDay === 6 || false
      return [0, 6].includes(weekDay)
    },
    isPreMonth(date, data) {
      return data.type === 'prev-month'
    },
    isCurrentMonth(date, data) {
      return data.type === 'current-month'
    },
    isNextMonth(date, data) {
      return data.type === 'next-month'
    },
    isEdit(date, data) {
      // 如果是当前月, 并且数据大于当日的话,就返回true, 禁用操作
      return data.type === 'current-month' && new Date(data.day).getTime() > new Date().getTime()
    },
    changeData(data) {
      console.log(data)
    },
    handleEnter(data) {
      data.visible = true
    },
    handleLeave(data) {
      // console.log(data)
      data.visible = false
    },
    handleClick(data) {
      console.log(data)
      this.editData = Object.assign(this.editData, data)
      // this.editData.enterStatusDescription = '08:00:00-09:00:00'
      this.visible = true
    },
    confirm() {
      this.$refs.edit.validator().then(res => {
        const { date, enterStatus, leaveStatus, enterDate, leaveDate, leaveSurrogate } = this.$refs.edit.$data.model
        let { leaveStatusDescription, enterStatusDescription } = this.$refs.edit.$data.model
        this.editData = this.$refs.edit.$data.model
        // let { enterStatusDescription, leaveStatusDescription } = this.editData
        if (enterStatus === getEnumKeyByValue('请假')) {
          if (!enterStatusDescription) {
            return this.$message.error('请选择请假时间')
          }
          // 请假时时间控件是一个数组, 需要转成str给后台
          enterStatusDescription = this.editData.date + ' ' + enterStatusDescription[0] + '~' + this.editData.date + ' ' + enterStatusDescription[1]
        } else {
          enterStatusDescription = ''
        }
        if (leaveStatus === getEnumKeyByValue('延长签出')) {
          if (!leaveStatusDescription) {
            return this.$message.error('请选择延迟签出时间')
          }
        } else {
          leaveStatusDescription = ''
        }

        updateAttendanceCalendarById({
          customerId: this.editData.customerInfo.id,
          attendanceDate: date,
          enterStatus,
          enterStatusDescription: enterStatusDescription,
          leaveStatus,
          leaveStatusDescription,
          enterDate,
          leaveDate,
          leaveSurrogate
        }).then(res => {
          this.$message.success('更新成功')
          this.cancel()
          this.init()
        })
      })
    },
    cancel() {
      this.visible = false
      this.$refs['edit'].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
  .index-wrap {
    font-size: 14px;
    background-color: #fff;
    height: calc(100vh - 155px);
    overflow: auto;

    & /deep/ .current {
      position: relative;
    }

    & /deep/ .el-calendar__header {
      border-bottom: none;
      padding: 16px 24px 0 24px;
    }

    & /deep/ .el-calendar__body {
      padding: 16px 24px;

      .el-calendar-table thead th {
        background-color: #fafafa;
      }
    }

    & /deep/ .el-calendar-day {
      /*height: 120px;*/
      height: auto;
      padding: 0;
    }

    .weekEnd {
      /*background-color: red;*/
      /*user-select: none;*/
      /*pointer-events: none;*/
    }

    .no-edit {
      background-color: #fdfcff;
    }

    & /deep/ .el-calendar-table__row {
      td:not(.current) {
        pointer-events: none;
      }

      td.next {
        display: none;
      }

      td.prev {
        .el-calendar-day {
          display: none;
        }
      }
    }

    // 上一个月
    .pre-month {
    }

    // 当前月
    .current-month {
    }

    // 下一个月
    .next-month {

    }

    .box {
      /*position: relative;*/
      min-height: 120px;
      display: flex;
      flex-direction: column;

      .calendar-day {
        font-size: 16px;
        margin-bottom: 8px;
        padding: 8px 0 0 8px;
      }

      .item-box {
        padding: 8px;
        flex: 1;
        overflow: auto;

        & > div {
          line-height: 1.5;
        }

        .item {
          display: flex;

          .title {
            white-space: nowrap;
          }

          .content {
          }
        }

        .btn-edit {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          width: 100%;
          height: 34px;
          line-height: 34px;
          text-align: center;
          background-color: $main-color;
          color: #fff;
          display: none;
        }
      }
    }

    .active {
      display: block !important;
    }

    .desc {
      padding: 10px 20px;
      color: $secondary-color;
    }

    .chi {
      color: #FF3F2A;
    }
  }
</style>
