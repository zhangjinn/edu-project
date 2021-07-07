<template>
  <div class="sign">
    <EtmCalendar @input="queryAttendanceContent">
      <template
        slot="dateCell"
        slot-scope="{date, data}"
      >
        <div class="cellwrap">
          <div class="day">
            {{ data.day.slice(-2) }}
          </div>
          <p
            v-show="getContentByDay(data.day).attendanceStatus === 'NON_ATTENDANCE_DAY'"
            class="rest"
          >无排课</p>
          <div
            v-show="getContentByDay(data.day).attendanceStatus === 'NORMAL'"
            class="attend"
          >
            <p>到园：{{ `${getContentByDay(data.day).enterTime}(${getContentByDay(data.day).enterRecord})` }}</p>
            <p>离园：{{ `${getContentByDay(data.day).leaveTime}(${getContentByDay(data.day).leaveRecord})` }}</p>
          </div>
          <p v-show="getContentByDay(data.day).attendanceStatus === 'ABSENCE'">缺勤</p>
          <p v-show="getContentByDay(data.day).attendanceStatus === 'REQUEST_FOR_LEAVE'">请假</p>
          <p v-show="getContentByDay(data.day).attendanceStatus === 'NOT_LEFT'">未离园</p>
        </div>
      </template>
    </EtmCalendar>
  </div>
</template>

<script>
import EtmCalendar from './components/EtmCalendar'
import transferDate from '@/utils/date'
import { getAttendance } from '@/api/neuroo/memberManage'
export default {
  components: {
    EtmCalendar
  },
  props: {
    // eslint-disable-next-line vue/require-default-prop
    id: {
      type: [String, Number]
    }
  },
  data() {
    return {
      current: null,
      attendanceData: []
    }
  },
  created() {
    // this.queryAttendanceContent()
  },
  methods: {
    refresh() {
      this.queryAttendanceContent()
    },
    getContentByDay(day) {
      if (this.attendanceData.length) {
        for (let i = 0; i < this.attendanceData.length; i++) {
          if (transferDate(this.attendanceData[i].date).time === day) {
            return this.attendanceData[i]
          }
        }
        return {}
      } else {
        return {}
      }
    },
    queryAttendanceContent(e) {
      if (e) {
        if (this.current && (e.getMonth() === this.current.getMonth())) {
          return
        }
      }
      this.current = e || new Date()
      getAttendance({
        customerId: this.id,
        date: transferDate(this.current).time
      }).then(res => {
        const { data } = res
        data.forEach(v => {
          if (v.enterTime) {
            v.enterTime = `${transferDate(v.enterTime).hours}:${transferDate(v.enterTime).miniutes}`
          }
          if (v.leaveTime) {
            v.leaveTime = `${transferDate(v.leaveTime).hours}:${transferDate(v.leaveTime).miniutes}`
          }
        })
        this.attendanceData = data
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped lang="scss">
.sign {
  /*height: calc(100vh - 206px);*/
  /*padding-bottom: 16px;*/
  /*overflow-y: auto;*/
  /*& /deep/ .el-calendar__header {*/
  /*  padding:0 0 16px;*/
  /*  border-bottom: none;*/
  /*}*/
  /*& >>> .el-calendar__body {*/
  /*  padding: 0;*/
  /*}*/
  & >>> .el-calendar-table {
    td.is-selected {
      @include bgc_white();
    }
    .el-calendar-day {
      min-height: 120px;
      padding: 10px!important;
      &:hover {
        cursor: default;
        @include bgc_white();
      }
    }
  }
  .cellwrap {
    height: 100%;
    position: relative;
    .day {
      @include c_secondary_color();
    }
    .rest {
      @include c_disabled_color();
    }
    .attend {
      p {
        line-height: 1.2;
      }
    }
    ul {
      margin: 0;
      padding: 0;
      list-style: none;
      li {
        i {
          font-size: 12px;
          &:hover {
            @include c_error_color();
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
