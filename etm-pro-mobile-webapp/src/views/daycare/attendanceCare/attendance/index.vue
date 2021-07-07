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
          >
            {{ item }}
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
              <van-col :span="12" class="textCenter">
                <template v-if="tabActive === 0">
                  <popup
                    :title="currentDate"
                    type="date"
                    @select="confirmDate"
                  />
                </template>
                <template v-else>
                  <popup
                    :title="currentMonth"
                    type="month"
                    @select="confirmMonth"
                  />
                </template>
              </van-col>
              <van-col :span="12" class="textCenter">
                <dropdown
                  :type="(!tabActive ? 'DAY' : 'MONTH')"
                  :date="date"
                  @select="confirmGrade"
                />
              </van-col>
            </van-row>
          </div>
          <div class="scrollBox">
            <template v-if="tabActive === 0">
              <day-tabs :attendance-data="attendanceData" :date="currentDate" />
            </template>
            <template v-else>
              <month-tabs
                :month-data="monthData"
                :only-one="onlyOne"
                :month="currentMonth"
              />
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
import dropdown from '../../components/dropdownClazz'
import { getStartDateAndEndDateByMonth } from '@/utils/date'

import { queryDayCount, queryMonthCount } from '@/service/daycare/attendanceCare'

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
      id: null,
      currentDate: '',
      currentMonth: '',
      attendanceData: {
        rate: 0
      },
      onlyOne: false,
      monthData: [],
      date: ''
    }
  },
  created() {
    this.currentDate = DateFormat(new Date(), 'yyyy-MM-dd')
    this.currentMonth = DateFormat(new Date(), 'yyyy-MM')
    this.date = this.currentDate
  },
  methods: {
    tabChange(index) {
      this.tabActive = index
      if (index === 0) {
        this.date = this.currentDate
      } else {
        this.date = this.currentMonth
      }
    },
    // 园区切换
    confirmGrade(val, type) {
      this.id = val.value
      console.log(this.id)
      this.getData()
    },
    // 日期切换
    confirmDate(date) {
      if (this.currentDate === DateFormat(date, 'yyyy-MM-dd')) return
      this.currentDate = DateFormat(date, 'yyyy-MM-dd')
      this.date = this.currentDate
      // this.getDayData()
      // this.getData()
    },
    // 月份切换
    confirmMonth(date) {
      if (this.currentMonth === DateFormat(date, 'yyyy-MM')) return
      this.currentMonth = DateFormat(date, 'yyyy-MM')
      this.date = this.currentMonth
      // this.getMonthData()
      // this.getData()
    },
    getData() {
      if (this.tabActive === 0) {
        this.getDayData()
      } else {
        this.getMonthData()
      }
      // this.getDayData()
      // this.getMonthData()
    },
    // 获取日统计数据
    getDayData() {
      const date = this.currentDate.replace(/\./g, '-')
      const param = {
        date: date
      }
      if (this.id) {
        param.courseManagementId = this.id
      } else {
        param.courseManagementId = ''
      }
      this.attendanceData = {
        rate: 0
      }
      queryDayCount(param).then(res => {
        if (res.data.data) {
          this.attendanceData = res.data.data
          if (this.attendanceData.shouldNum) {
            this.attendanceData.rate =
                (this.attendanceData.actuallyNum /
                    this.attendanceData.shouldNum) *
                100
          } else {
            this.attendanceData.rate = 0
          }
          this.attendanceData.id = this.id
        }
      })
    },
    // 获取月统计数据
    getMonthData() {
      const { startDate, endDate } = getStartDateAndEndDateByMonth(
        new Date(this.date).getMonth() + 1
      )
      const ids = this.id.split('-')
      console.log(ids[1], ids[0])
      const courseId = ids[0] || null
      const clazzId = ids[1] || null
      console.log(ids)
      this.monthData = []
      queryMonthCount({
        courseId,
        clazzId,
        startDate,
        endDate
      }).then(res => {
        const data = res.data.data ? res.data.data : []
        this.monthData = data
        if (this.monthData.length === 1) {
          this.onlyOne = true
        } else {
          this.onlyOne = false
        }
      })
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
            content: "";
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
