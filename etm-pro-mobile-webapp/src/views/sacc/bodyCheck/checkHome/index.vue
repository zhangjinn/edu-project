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
          <span>检测统计</span>
        </div>
        <div class="right" @click="selectDate">
          <span class="time">{{ currentDate }}</span>
          <span class="iconfont iconarrow-down" />
        </div>
      </div>
      <div class="total">
        <div class="number">
          <span class="really">{{ checkData.actuallyNumber || 0 }}</span>
          <span>/</span>
          <span>{{ checkData.targetNumber || 0 }}</span>
        </div>
        <div class="text">
          <span>实检人次</span>
          <span>/</span>
          <span>应检人次</span>
        </div>
      </div>
      <div class="counts van-hairline--top">
        <van-row>
          <van-col :span="8">
            <div>
              <span class="icon">
                <img src="../../../../assets/images/iconTotal.png">
              </span>
            </div>
            <div class="num totalColor">{{ checkData.memberNumber || 0 }}</div>
            <div class="txt">总人数</div>
          </van-col>
          <van-col :span="8">
            <div>
              <span class="icon">
                <img src="../../../../assets/images/iconLeave.png">
              </span>
            </div>
            <div class="num lateColor">{{ checkData.abnormalNumber || 0 }}</div>
            <div class="txt">异常人数</div>
          </van-col>
          <van-col :span="8">
            <div>
              <span class="icon">
                <img src="../../../../assets/images/iconAbsence.png">
              </span>
            </div>
            <div class="num absenceColor">{{ checkData.leavingNumber || 0 }}</div>
            <div class="txt">离园人数</div>
          </van-col>
        </van-row>
      </div>
    </div>
    <div class="footer">
      <div class="btn" @click="beginMorning">
        <control-btn text="开始晨检" type="primary" size="large" />
      </div>
      <div v-if="showNoonCheck" class="btn" @click="beginNoon">
        <control-btn text="开始午检" type="info" size="large" />
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
import { getCheckStatistic, getCheckSetting } from '../../../../service/sacc/sacc'

export default {
  name: 'Attendance',
  components: {
    controlBtn
  },
  data() {
    return {
      checkData: {},
      showDatePicker: false,
      currentDate: '',
      checkDate: '',
      date: new Date(),
      maxDate: new Date(),
      showNoonCheck: false,
      morningCheckStart: '',
      morningCheckEnd: '',
      middleCheckStart: '',
      middleCheckEnd: ''
    }
  },
  // beforeRouteEnter(to, from, next) {
  //   next(vm => {
  //     if (from.path === '/babyCheck') {
  //       vm.getCheckData()
  //       return
  //     }
  //   })
  // },
  created() {
    this.currentDate = DateFormat(new Date(), 'yyyy.MM.dd')
    this.checkDate = DateFormat(new Date(), 'yyyy-MM-dd')
    this.getCheckData()
    this.getSetting()
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
      this.checkDate = DateFormat(time, 'yyyy-MM-dd')
      this.getCheckData()
    },
    getCheckData() {
      const param = {
        date: this.checkDate
      }
      getCheckStatistic(param).then(res => {
        this.checkData = res.data.data
      })
    },
    getSetting() {
      getCheckSetting().then(res => {
        const resData = res.data.data
        const checkMode = resData.checkMode
        this.morningCheckStart = resData.morningCheckStart
        this.morningCheckEnd = resData.morningCheckEnd
        if (checkMode === 'BOTH_CHECK') {
          this.showNoonCheck = true
          this.middleCheckStart = resData.middleCheckStart
          this.middleCheckEnd = resData.middleCheckEnd
        }
      })
    },
    beginMorning() {
      this.$router.push({
        path: '/morningCheck',
        query: {
          time: this.checkDate
        }
      })
    },
    beginNoon() {
      this.$router.push({
        path: '/noonCheck',
        query: {
          time: this.checkDate
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
