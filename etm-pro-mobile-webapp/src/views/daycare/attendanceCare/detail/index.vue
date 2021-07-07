<template>
  <div class="attendanceDetail">
    <div class="selectBox textLeft van-hairline--bottom">
      <div class="changeWeek textCenter">
        <popup
          :title="currentMonth"
          type="month"
          size="big"
          @select="selectMonth"
        />
      </div>
    </div>
    <div class="rowBox van-hairline--bottom">
      <van-row>
        <van-col :span="8">
          <div class="column greenColor">
            <p class="count">
              <span class="number">{{ child.onNum || 0 }}</span>
              <span>次</span>
            </p>
            <p class="label">出勤</p>
          </div>
        </van-col>
        <van-col :span="8">
          <div class="column mainColor">
            <p class="count">
              <span class="number">{{ child.askNum || 0 }}</span>
              <span>次</span>
            </p>
            <p class="label">请假</p>
          </div>
        </van-col>
        <van-col :span="8">
          <div class="column errorColor">
            <p class="count">
              <span class="number">{{ child.absentNum || 0 }}</span>
              <span>次</span>
            </p>
            <p class="label">缺勤</p>
          </div>
        </van-col>
      </van-row>
    </div>

    <div class="attendanceMsg textLeft">
      <div
        v-for="(item, index) in child.getTaattendanceDateList"
        :key="'date-list-' + index"
        class="card"
      >
        <div class="date">
          <span class="point">·</span>
          <span>{{ item.date | week }}</span>
        </div>
        <template v-if="item.getTaattendanceDateItemList.length">
          <div
            v-for="(it, idx) in item.getTaattendanceDateItemList"
            :key="'card-con-' + idx"
            class="card-con"
          >
            <div class="title">
              <span>{{ it.courseName }} {{ it.startTime }} - {{ it.endTime }}</span>
            </div>
            <div class="detail">
              <p>
                <span class="label">{{ it.clazzName }}</span>
                <span class="tag" :class="setClass(it.status)">{{
                  setState(it.status)
                }}</span>
              </p>
              <p>
                <span class="label">{{ it.courseName }}</span>
                <span class="text">{{ it.headTeacherName }}</span>
              </p>
              <p>
                <span class="label">到园：</span>
                <span class="text">{{ it.enterTime }}</span>
              </p>
              <p>
                <span class="label">离园：</span>
                <span class="text">{{ it.leaveTime }}</span>
                <span class="shuttle">接送人：{{ it.relationshipName }}</span><!--todo 改为接送人-->
              </p>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import popup from '../../components/popup'
import { getStartDateAndEndDateByMonth } from '@/utils/date'
import { queryChildTaattendance } from '@/service/daycare/attendanceCare'

export default {
  name: 'Index',
  components: {
    popup
  },
  filters: {
    week(v) {
      if (v) {
        const time = new Date(v + 8 * 3600 * 1000)
        const date = time.toJSON().substr(0, 10)
        const week = [
          '星期日',
          '星期一',
          '星期二',
          '星期三',
          '星期四',
          '星期五',
          '星期六'
        ][time.getDay()]
        return date + ' ' + week
      }
    }
  },
  data() {
    return {
      statusList: {
        NOT_ATTENDANCE: '未考勤',
        IN_SCHOOL: '已入园',
        OUT_SCHOOL: '已离园',
        ABSENT_FROM_WORK: '缺勤',
        ASK_FOR_LEAVE: '请假',
        EFFECTIVE_ASK_FOR_LEAVE: '有效请假'
      },
      childId: '',
      hasImg: true,
      child: {},
      currentMonth: '',
      date: ''
    }
  },
  created() {
    this.childId = this.$route.query.childId
    this.currentMonth = this.getMonth(this.$route.query.date)
    this.date = this.$route.query.date
    this.getChild()
  },
  methods: {
    getChild() {
      const { startDate, endDate } = getStartDateAndEndDateByMonth(
        new Date(this.date).getMonth() + 1
      )
      queryChildTaattendance({
        childId: this.childId,
        startDate: startDate,
        endDate: endDate
      }).then(res => {
        this.child = res.data.data
      })
    },
    // 月份切换
    selectMonth(month) {
      this.currentMonth = this.getMonth(month)
      this.date = month
      this.getChild()
    },
    getMonth(date) {
      date = new Date(date)
      const year = date.getFullYear()
      let month = date.getMonth() + 1
      month = month < 10 ? '0' + month : month
      return year + '年' + month + '月'
    },
    setState(status) {
      // NORMAL :正常 NOT_LEFT :未离园 REQUEST_FOR_LEAVE :请假 ABSENCE :缺勤 NON_ATTENDANCE_DAY :非考勤日
      switch (status) {
        case 'SIGN_IN':
          return '正常'
        case 'ASK_FOR_LEAVE':
          return '请假'
        case 'NOT_ATTENDANCE':
          return '缺勤'
      }
    },
    setClass(status) {
      switch (status) {
        case 'SIGN_IN':
          return 'normal'
        case 'NOT_ATTENDANCE':
          return 'notLeft'
        case 'ASK_FOR_LEAVE':
          return 'leave'
        case 'ABSENCE':
          return 'absence'
      }
    }
  }
}
</script>

<style scoped lang="scss">
.attendanceDetail {
  min-height: calc(100vh - 50px);
  //background-color: $white;

  .header {
    display: flex;
    padding: 12px;
    background-color: $white;
    box-shadow: 0px 1px 0px 0px rgba(230, 230, 230, 1);

    .avatar {
      @include round(35px);
      overflow: hidden;

      .noImg {
        height: 35px;
        font-size: 13px;
        color: $white;
        line-height: 35px;
        background-color: $theme;
      }
    }

    .name {
      margin-left: 12px;
      height: 35px;
      line-height: 35px;
      font-size: 15px;
    }
  }

  .selectBox {
    position: relative;
    padding: 0 12px;
    font-size: 16px;
    background-color: $white;

    .back {
      position: absolute;
      top: 12px;
      right: 12px;
      height: 24px;
      line-height: 24px;
      font-size: 13px;
      color: $theme;
    }
  }

  .rowBox {
    padding: 15px 0;
    background-color: $white;
    margin: 12px;
    border-radius: 6px;

    .column {
      font-size: 12px;

      .number {
        font-size: 21px;
      }

      .label {
        margin-top: 8px;
        opacity: 0.8;
      }
    }
  }

  .attendanceMsg {
    margin: 12px;

    .date {
      span {
        height: 36px;
        line-height: 36px;
        font-size: 18px;
      }

      .point {
        color: #fba048;
        font-size: 40px;
        vertical-align: middle;
        position: absolute;
        left: 10px;
      }
    }

    .tag {
      display: inline-block;
      padding: 0 9px;
      //margin-left: 8px;
      height: 21px;
      line-height: 21px;
      font-size: 12px;
      @include border-radius(3px);

      &.normal {
        color: $green;
        background-color: $greenLight;
      }

      &.notLeft {
        color: $blue;
        background-color: $blueLight;
      }

      &.leave {
        color: $theme;
        background-color: $themeLight;
      }

      &.absence {
        color: $red;
        background-color: $redLight;
      }
    }

    .card {
      background-color: $white;
      padding: 20px;
      margin-bottom: 12px;
      border-radius: 6px;

      .card-con {
        margin: 12px 0;

        .detail {
          padding: 12px 20px;
          border-radius: 8px;
          background: #fafafa;
          margin: 12px 0 0 0;

          p {
            margin: 8px 0;
            font-size: 14px;

            .label {
              //color: #9A9A9A;
              display: inline-block;
              margin-right: 10px;
              width: 50px;
            }

            .text {
              margin-right: 10px;
            }

            .shuttle {
              color: #9a9a9a;
            }
          }
        }
      }
    }
  }
}
</style>
