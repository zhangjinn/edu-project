<template>
  <div class="attendance">
    <div>
      <div class="header">
        <div class="tabs">
          <div
            v-for="(item, index) in tabList"
            :key="index"
            :class="tabActive === index ? 'tab active' : 'tab'"
            @click="tabChange(index)"
          >{{ item }}
          </div>
        </div>
      </div>
      <div class="container">
        <div class="backBox">
          <div class="top" />
          <div class="bottom" />
        </div>
        <div class="innerBox">
          <div class="selectBox">
            <van-row>
              <van-col :span="8" class="textLeft">
                <dropdown
                  ref="grade"
                  type="grade"
                  @open="openGrade"
                  @select="confirmGrade"
                />
              </van-col>
              <van-col :span="8" class="textCenter">
                <dropdown
                  ref="clazz"
                  :grade-id="gradeId"
                  type="clazz"
                  @open="openClazz"
                  @select="confirmClazz"
                />
              </van-col>
              <van-col :span="8" class="textRight">
                <template v-if="tabActive === 0">
                  <popup :title="currentDate" type="date" @select="confirmDate" />
                </template>
                <template v-else>
                  <popup :title="currentMonth" type="month" @select="confirmMonth" />
                </template>
              </van-col>
            </van-row>
          </div>
          <div class="scrollBox">
            <template v-if="tabActive === 0">
              <day-tabs :attendance-data="attendanceData" :date="currentDate" />
            </template>
            <template v-else>
              <month-tabs :month-data="monthData" :only-one="onlyOne" :month="currentMonth" />
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { DateFormat } from '../../../../js/rules'
import dayTabs from './dayTabs'
import monthTabs from './monthTabs'
import popup from '../../components/popup'
import dropdown from '../../components/dropdown'
import { getAttendanceDay, getAttendanceMonth } from '../../../../service/guardcare/attendance'

export default {
  name: 'Index',
  components: {
    dayTabs,
    monthTabs,
    popup,
    dropdown
  },
  data() {
    return {
      tabActive: 0,
      tabList: ['日统计', '月统计'],
      gradeId: null,
      clazzId: null,
      currentDate: '',
      currentMonth: '',
      attendanceData: {
        rate: 0
      },
      onlyOne: false,
      monthData: []
    }
  },
  created() {
    this.currentDate = DateFormat(new Date(), 'yyyy.MM.dd')
    this.currentMonth = DateFormat(new Date(), 'yyyy.MM')
  },
  methods: {
    tabChange(index) {
      this.tabActive = index
    },
    // 园区切换
    confirmGrade(val, type) {
      this.gradeId = val.value
      if (type === 'load') return
      this.clazzId = 0
      this.getData()
    },
    // 班级切换
    confirmClazz(val) {
      this.clazzId = val.value
      this.getData()
    },
    // 日期切换
    confirmDate(date) {
      if (this.currentDate === DateFormat(date, 'yyyy.MM.dd')) return
      this.currentDate = DateFormat(date, 'yyyy.MM.dd')
      this.getDayData()
    },
    // 月份切换
    confirmMonth(date) {
      if (this.currentMonth === DateFormat(date, 'yyyy.MM')) return
      this.currentMonth = DateFormat(date, 'yyyy.MM')
      this.getMonthData()
    },
    getData() {
      this.getDayData()
      this.getMonthData()
    },
    // 获取日统计数据
    getDayData() {
      const date = this.currentDate.replace(/\./g, '-')
      const param = {
        date: date
      }
      if (this.gradeId) {
        param.gradeId = this.gradeId
      } else {
        param.gradeId = undefined
      }
      if (this.clazzId) {
        param.clazzId = this.clazzId
      } else {
        param.clazzId = undefined
      }
      this.attendanceData = {
        rate: 0
      }
      getAttendanceDay(param).then(res => {
        if (res.data.data) {
          this.attendanceData = res.data.data
          if (this.attendanceData.shouldArriveNumber) {
            this.attendanceData.rate = this.attendanceData.arrivedNumber / this.attendanceData.shouldArriveNumber * 100
          } else {
            this.attendanceData.rate = 0
          }
        }
      })
    },
    // 获取月统计数据
    getMonthData() {
      const date = this.currentMonth.replace(/\./g, '-') + '-01'
      const param = {
        date: date
      }
      if (this.gradeId) {
        param.gradeId = this.gradeId
      } else {
        param.gradeId = undefined
      }
      if (this.clazzId) {
        param.clazzId = this.clazzId
      } else {
        param.clazzId = undefined
      }
      this.monthData = []
      getAttendanceMonth(param).then(res => {
        const data = res.data.data ? res.data.data.gradeList : []
        this.monthData = []
        data.forEach(item => {
          if (item.clazzList.length) {
            this.monthData.push(item)
          }
        })
        if (this.monthData.length === 1 && this.monthData[0].clazzList.length === 1) {
          this.onlyOne = true
        } else {
          this.onlyOne = false
        }
      })
    },
    openGrade(val) {
      if (val) {
        this.$refs.clazz.opendropdown(false)
      }
    },
    openClazz(val) {
      if (val) {
        this.$refs.grade.opendropdown(false)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
    .attendance {
        .header {
            padding-bottom: 5px;
            background-color: $theme;

            .tabs {
                display: flex;

                .tab {
                    flex: 1;
                    height: 50px;
                    line-height: 50px;
                    color: $white;
                    opacity: 0.8;

                    &.active {
                        position: relative;
                        opacity: 1;

                        &::after {
                            display: inline-block;
                            position: absolute;
                            left: 0;
                            right: 0;
                            bottom: 5px;
                            margin: 0 auto;
                            content: '';
                            @include wh(30px, 2px);
                            background-color: $white;
                        }
                    }
                }
            }
        }

        .container {
            position: relative;

            .backBox {
                position: relative;
                @include wh(100%, 100px);
                overflow: hidden;

                .top {
                    @include wh(100%, 50px);
                    background-color: $theme;
                }

                .bottom {
                    position: absolute;
                    top: -100px;
                    left: -50px;
                    width: calc(100% + 100px);
                    height: 200px;
                    background-color: $theme;
                    border-radius: 50%;
                }
            }

            .innerBox {
                position: absolute;
                top: 0;
                left: 12px;
                right: 12px;
                background-color: $white;
                @include border-radius(3px);

                .selectBox {
                    padding: 0 12px;
                }

                .scrollBox {
                    max-height: calc(100vh - 160px);
                    overflow-y: auto;
                }
            }
        }

    }
</style>
