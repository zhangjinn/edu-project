<template>
  <div class="attendance-wrap">
    <el-form>
      <el-form-item label="日期筛选">
        <el-date-picker
          v-model="monthValue"
          type="month"
          placeholder="选择月"
        />
      </el-form-item>
    </el-form>
    <div class="statistics">
      <etm-field-label label="出勤天数">
        <span class="number main">{{ statisticsData.arrivedNumber }}</span>
      </etm-field-label>
      <etm-field-label label="缺勤天数">
        <span class="number error">{{ statisticsData.notArrivedNumber }}</span>
      </etm-field-label>
      <etm-field-label label="请假天数">
        <span class="number blue">{{ statisticsData.requestForLeaveNumber }}</span>
      </etm-field-label>
    </div>
    <el-timeline>
      <el-timeline-item
        v-for="(attendance, index) in attendanceData"
        :key="index"
        :timestamp="attendance.timestamp"
        placement="top"
      >
        <div class="timeBox">
          <div v-if="attendance.status === 'NORMAL' || attendance.status === 'NOT_LEFT'">
            <etm-field-label type="left" label="到园">{{ attendance.enterTime }}</etm-field-label>
            <etm-field-label type="left" label="离园">{{ attendance.leaveTime }}</etm-field-label>
            <etm-field-label type="left" label="接送人">{{ attendance.surrogate }}</etm-field-label>
          </div>
          <div v-else>
            <div v-if="attendance.status === 'REQUEST_FOR_LEAVE'" class="leave">已请假</div>
            <div v-else-if="attendance.status === 'ABSENCE'" class="absence">缺勤</div>
            <div class="noneAttendance">今日无打卡记录</div>
          </div>
        </div>
      </el-timeline-item>
    </el-timeline>
    <template v-if="!attendanceData.length">
      <etm-empty />
    </template>
  </div>

</template>

<script>/**
 * attendance create by Administrator
 * createTime 2020/9/2 17:22
 */

import { parseTime } from '@/utils'
import { getAttendanceList, getAttendanceStatistics } from '@/api/guardcare/childManage/childManage'

export default {
  name: 'Attendance',
  components: {},
  filters: {},
  mixins: [],
  props: {
    childId: {
      type: Number,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      monthValue: new Date(),
      statisticsData: {
        arrivedNumber: 0,
        notArrivedNumber: 0,
        requestForLeaveNumber: 0
      },
      attendanceData: []
    }
  },
  computed: {},
  watch: {
    monthValue() {
      this.getStatistics()
      this.getData()
    },
    childId() {
      this.monthValue = new Date()
      this.getStatistics()
      this.getData()
    }
  },
  created() {
  },
  mounted() {
    this.getStatistics()
    this.getData()
  },
  methods: {
    getStatistics() {
      if (this.childId) {
        const param = {
          childId: this.childId
        }
        param.date = parseTime(this.monthValue, '{y}-{m}-{d}')
        getAttendanceStatistics(param).then(res => {
          if (res.data) {
            this.statisticsData = res.data
          }
        })
      }
    },
    getData() {
      if (this.childId) {
        const param = {
          childId: this.childId
        }
        param.date = parseTime(this.monthValue, '{y}-{m}-{d}')
        getAttendanceList(param).then(res => {
          const data = res.data
          this.attendanceData = []
          data.forEach(item => {
            const time = parseTime(item.date, '{m}-{d}') + ' 星期' + parseTime(item.date, '{a}')
            const surrogate = item.surrogateName ? item.surrogateName + '（' + this.getRelation(item.surrogateRelationship) + '）' : '--'
            const attendance = {
              timestamp: time,
              status: item.status,
              enterTime: item.enterTime ? parseTime(item.enterTime, '{h}:{i}') : '--',
              leaveTime: item.leaveTime ? parseTime(item.leaveTime, '{h}:{i}') : '--',
              surrogate: surrogate
            }
            this.attendanceData.push(attendance)
          })
        })
      }
    },
    getRelation(relation) {
      // MOTHER :妈妈 FATHER :爸爸 GRANDFATHER :爷爷 GRANDMOTHER :奶奶 GRANDPA :外公 GRANDMA :外婆 OTHER :其他
      switch (relation) {
        case 'MOTHER':
          return '妈妈'
        case 'FATHER':
          return '爸爸'
        case 'GRANDFATHER':
          return '爷爷'
        case 'GRANDMOTHER':
          return '奶奶'
        case 'GRANDPA':
          return '外公'
        case 'GRANDMA':
          return '外婆'
        case 'OTHER':
          return '其他'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.attendance-wrap {
.statistics{
  display: flex;
  margin-bottom: 24px;
  border-bottom: 1px solid $divide-color;
  ::v-deep .EtmFieldLabel-wrap{
    margin-right: 24px;
    align-items: center;
  }
  .number{
    font-size: 18px;
    font-weight: bold;
    &.main{
      @include c_main_color();
    }
    &.error{
      @include c_error_color();
    }
    &.blue{
      color: $tip-color;
    }
  }
}
  .el-timeline{
    ::v-deep .el-timeline-item{
      position: relative;
      padding-bottom: 8px;
      .el-timeline-item__node{
        @include bgc_main_color();
      }
      .el-timeline-item__timestamp{
        margin-bottom: 24px;
        font-size: 16px;
        @include c_title_color();
      }
    }
  }
  .timeBox{
    .leave{
      position: absolute;
      top: 0;
      left: 135px;
      padding: 0 5px;
      height: 20px;
      line-height: 20px;
      font-size: 12px;
      color: $tip-color;
      border: 1px solid $tip-color;
      border-radius: 2px;
    }
    .absence{
      position: absolute;
      top: 0;
      left: 135px;
      padding: 0 5px;
      height: 20px;
      line-height: 20px;
      font-size: 12px;
      @include c_error_color();
      border: 1px solid;
      @include bc_error_color();
      border-radius: 2px;
    }
    .noneAttendance{
      padding-bottom: 16px;
      @include c_secondary_color();
    }
  }
}
</style>
