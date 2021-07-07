<template>
  <div class="attendance">
    <div class="top">
      <div class="square" />
      <div class="round" />
    </div>
    <div class="attendBox">
      <div class="title">
        <div class="left">
          <span class="iconfont iconfilesearch" />
          <span>考勤统计</span>
        </div>
        <div class="right" @click="selectDate">
          <span class="time">{{ currentDate }}</span>
          <span class="iconfont iconarrow-down" />
        </div>
      </div>
      <div class="total">
        <div class="number">
          <span class="really">{{ attendanceData.arrivedNumber || 0 }}</span>
          <span>/</span>
          <span>{{ attendanceData.shouldArriveNumber || 0 }}</span>
        </div>
        <div class="text">
          <span>实到人数</span>
          <span>/</span>
          <span>应到人数</span>
        </div>
      </div>
      <div class="counts van-hairline--top">
        <van-row>
          <van-col :span="6">
            <div>
              <span class="icon">
                <img src="../../../../assets/images/iconTotal.png">
              </span>
            </div>
            <div class="num totalColor">{{ attendanceData.shouldArriveNumber || 0 }}</div>
            <div class="txt">总人数</div>
          </van-col>
          <van-col :span="6">
            <div>
              <span class="icon">
                <img src="../../../../assets/images/iconLeave.png">
              </span>
            </div>
            <div class="num lateColor">{{ attendanceData.requestForLeaveNumber || 0 }}</div>
            <div class="txt">请假人数</div>
          </van-col>
          <van-col :span="6">
            <div>
              <span class="icon">
                <img src="../../../../assets/images/iconLate.png">
              </span>
            </div>
            <div class="num lateColor">{{ attendanceData.arriveLateNumber || 0 }}</div>
            <div class="txt">迟到人数</div>
          </van-col>
          <van-col :span="6">
            <div>
              <span class="icon">
                <img src="../../../../assets/images/iconAbsence.png">
              </span>
            </div>
            <div class="num absenceColor">{{ attendanceData.missingArriveNumber || 0 }}</div>
            <div class="txt">缺勤人数</div>
          </van-col>
        </van-row>
      </div>
    </div>
    <div class="footer">
      <div class="btn" @click="signIn">
        <control-btn text="送园签入" type="primary" size="large" />
      </div>
      <div class="btn" @click="signOut">
        <control-btn text="离园签出" type="info" size="large" />
      </div>
    </div>
    <van-popup
      v-model="showDatePicker"
      position="bottom"
      get-container="#app"
    >
      <van-datetime-picker
        v-model="date"
        type="date"
        :max-date="maxDate"
        @cancel="closePicker"
        @confirm="confirmDate"
      />
    </van-popup>
  </div>
</template>

<script>
import controlBtn from '../../../../components/common/controlBtn'
import { DateFormat } from '../../../../js/rules'
import { getStatistics } from '../../../../service/sacc/sacc'

export default {
  name: 'Attendance',
  components: {
    controlBtn
  },
  data() {
    return {
      showDatePicker: false,
      currentDate: null,
      attendanceDate: null,
      date: new Date(),
      maxDate: new Date(),
      attendanceData: {}
    }
  },
  created() {
    this.currentDate = DateFormat(new Date(), 'yyyy.MM.dd')
    this.attendanceDate = DateFormat(new Date(), 'yyyy-MM-dd')
    this.getAttendance()
  },
  methods: {
    selectDate() {
      this.showDatePicker = true
    },
    closePicker() {
      this.showDatePicker = false
    },
    confirmDate(time) {
      this.closePicker()
      this.currentDate = DateFormat(time, 'yyyy.MM.dd')
      this.attendanceDate = DateFormat(time, 'yyyy-MM-dd')
      this.getAttendance()
    },
    getAttendance() {
      const param = {
        attendanceDate: this.attendanceDate
      }
      getStatistics(param).then(res => {
        this.attendanceData = res.data.data
      })
    },
    signIn() {
      this.$router.push({
        path: '/signIn',
        query: {
          time: this.attendanceDate
        }
      })
    },
    signOut() {
      this.$router.push({
        path: '/signOut',
        query: {
          time: this.attendanceDate
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

    .attendance {
        position: relative;

        .top {
            position: relative;
            width: 100%;
            height: 160px;
            overflow: hidden;

            .square {
                height: 120px;
                background-color: $theme;
            }

            .round {
                position: absolute;
                left: -50px;
                bottom: 0;
                width: calc(100% + 100px);
                height: 160px;
                background-color: $theme;
                @include border-radius(50%);
            }
        }

        .attendBox {
            position: absolute;
            top: 40px;
            left: 12px;
            padding: 15px;
            width: calc(100% - 24px);
            background-color: $white;
            @include border-radius(3px);
            box-shadow: 0px 3px 5px 0px rgba(34, 34, 34, 0.06);

            .title {
                overflow: hidden;

                .left {
                    font-size: 15px;

                    .iconfont {
                        margin-right: 4px;
                        font-size: 15px;
                        color: $theme;
                    }
                }

                .right {
                    font-size: 13px;
                    color: $text-5;

                    .iconfont {
                        margin-left: 4px;
                        font-size: 12px;
                        color: $text-6;
                    }
                }
            }

            .total {
                margin-top: 36px;

                .number {
                    font-size: 36px;

                    .really {
                        color: $theme;
                    }
                }

                .text {
                    line-height: 28px;
                    font-size: 14px;
                    color: $text-5;
                }
            }

            .counts {
                margin-top: 24px;
                padding: 40px 0 25px;

                .icon {
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                }

                .num {
                    margin: 12px 0;
                    font-size: 24px;

                    &.totalColor {
                        color: $theme;
                    }

                    &.lateColor {
                        color: $red;
                    }

                    &.absenceColor {
                        color: $text-6;
                    }
                }

                .txt {
                    font-size: 13px;
                    color: $text-5;
                }
            }
        }

        .footer {
            margin: 300px auto 20px;
            width: 322px;

            .btn:last-child {
                margin-top: 20px;
            }
        }
    }
</style>
