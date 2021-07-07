<template>
  <div class="index-wrap">
    <div class="header">
      <div class="headerBg">
        <img src="../../../assets/images/guardcare/headerBg.png">
      </div>
      <div class="headerMsg">
        <div class="avatarBox">
          <div class="avatar">
            <img :src="organization.logo || defaultLogo">
          </div>
        </div>
        <div class="orgBox">
          <div class="organization" @click="switchOrg">
            <span>{{ organization.name }}</span>
            <span v-if="organizations.length > 1" class="iconfont iconright" />
          </div>
          <!--          <div class="taskBox">-->
          <!--            <div class="task">-->
          <!--              <div class="iconImg">-->
          <!--                <img src="../../../assets/images/guardcare/task.png">-->
          <!--              </div>-->
          <!--              <div class="taskCount">待办 06</div>-->
          <!--              <span class="iconfont iconright" />-->
          <!--            </div>-->
          <!--          </div>-->
        </div>
      </div>
    </div>
    <div class="content">
      <div class="appBox contentBox">
        <van-row>
          <van-col v-for="(app, index) in appData" :key="index" :span="6">
            <div class="app" @click="toPath(app.path)">
              <div class="appImg">
                <img :src="app.icon">
              </div>
              <div class="appText">{{ app.name }}</div>
            </div>
          </van-col>
        </van-row>
      </div>
      <div class="mainBox contentBox">
        <div class="top">
          <div class="topImg">
            <img src="../../../assets/images/guardcare/icon_income.png">
          </div>
          <div class="title">收入数据</div>
        </div>
        <div class="count">
          <van-row>
            <van-col :span="12">
              <div class="number">
                <span class="income">{{ formatNumber(currentData.incomeAmount) }}</span>
              </div>
              <div class="dateText">本月</div>
            </van-col>
            <van-col :span="12">
              <div class="number last">{{ formatNumber(lastData.incomeAmount) }}</div>
              <div class="dateText">上月</div>
            </van-col>
          </van-row>
        </div>
        <div class="mainBg">
          <img src="../../../assets/images/guardcare/bg_income.png">
        </div>
      </div>
      <div class="mainBox contentBox">
        <div class="top">
          <div class="topImg">
            <img src="../../../assets/images/guardcare/icon_outcome.png">
          </div>
          <div class="title">支出数据</div>
        </div>
        <div class="count">
          <van-row>
            <van-col :span="12">
              <div class="number">
                <span class="outcome">{{ formatNumber(currentData.outcomeAmount) }}</span>
              </div>
              <div class="dateText">本月</div>
            </van-col>
            <van-col :span="12">
              <div class="number last">{{ formatNumber(lastData.outcomeAmount) }}</div>
              <div class="dateText">上月</div>
            </van-col>
          </van-row>
        </div>
        <div class="mainBg">
          <img src="../../../assets/images/guardcare/bg_outcome.png">
        </div>
      </div>
      <div class="mainBox contentBox">
        <div class="top">
          <div class="topImg">
            <img src="../../../assets/images/guardcare/icon_cash.png">
          </div>
          <div class="title">净现金流</div>
        </div>
        <div class="count">
          <van-row>
            <van-col :span="12">
              <div class="number">
                <span class="cash">{{ formatNumber(currentData.cashFlow) }}</span>
              </div>
              <div class="dateText">本月</div>
            </van-col>
            <van-col :span="12">
              <div class="number last">{{ formatNumber(lastData.cashFlow) }}</div>
              <div class="dateText">上月</div>
            </van-col>
          </van-row>
        </div>
        <div class="mainBg">
          <img src="../../../assets/images/guardcare/bg_cash.png">
        </div>
      </div>
      <div class="mainBox contentBox">
        <div class="top">
          <div class="topImg">
            <img src="../../../assets/images/guardcare/icon_attendance.png">
          </div>
          <div class="title">幼儿考勤
            <span>(出勤/缺勤/请假)</span>
          </div>
        </div>
        <div class="count">
          <van-row>
            <van-col :span="12">
              <div class="number">
                <span>{{ currentData.arrivedNumber }}</span>
                <span class="attendance">/{{ currentData.notArrivedNumber }}/{{
                  currentData.requestForLeaveNumber
                }}</span>
              </div>
              <div class="dateText">本月</div>
            </van-col>
            <van-col :span="12">
              <div class="number last">{{ lastData.arrivedNumber }}/{{
                lastData.notArrivedNumber
              }}/{{ lastData.requestForLeaveNumber }}
              </div>
              <div class="dateText">上月</div>
            </van-col>
          </van-row>
        </div>
        <div class="mainBg">
          <img src="../../../assets/images/guardcare/bg_attendance.png">
        </div>
      </div>
      <div class="mainBox contentBox">
        <div class="top">
          <div class="topImg">
            <img src="../../../assets/images/guardcare/icon_check.png">
          </div>
          <div class="title">健康检查
            <span>（正常/异常）</span>
          </div>
        </div>
        <div class="count">
          <van-row>
            <van-col :span="12">
              <div class="number">
                <span class="normal">{{ currentData.checkCount }}</span>
                <span class="abnormal">/{{ currentData.abnormalCount }}</span>
              </div>
              <div class="dateText">本月</div>
            </van-col>
            <van-col :span="12">
              <div class="number last">{{ lastData.checkCount }}/{{ lastData.abnormalCount }}</div>
              <div class="dateText">上月</div>
            </van-col>
          </van-row>
        </div>
        <div class="mainBg">
          <img src="../../../assets/images/guardcare/bg_check.png">
        </div>
      </div>
      <div class="a_dBox contentBox">
        <img src="../../../assets/images/guardcare/banner.png">
      </div>
      <div v-for="(item, index) in chart" :key="index" class="chartBox contentBox">
        <div class="top">
          <div class="title">{{ item.name }}</div>
          <div class="titleRight">
            <div class="selectBox">
              <div class="selectItem" :class="item.active === 'week' ? 'active' : ''" @click="changeDate(item, 'week')">
                周
              </div>
              <div
                class="selectItem"
                :class="item.active === 'month' ? 'active' : ''"
                @click="changeDate(item, 'month')"
              >月
              </div>
            </div>
            <span class="iconfont iconmore" @click="openFixed(index)" />
          </div>
          <div v-show="index === fixedIndex" class="fixedTop">
            <div class="text" @click="fixedTop(index)">置顶</div>
            <div class="icon">
              <span class="iconfont iconyousanjiao" />
            </div>
          </div>
        </div>
        <div class="chartContent">
          <div class="scrollBox">
            <template v-if="item.type === 'cash'">
              <bar-chart :chart-data="cashData" />
            </template>
            <template v-if="item.type === 'flow'">
              <line-chart :chart-data="flowData" />
            </template>
            <template v-else-if="item.type === 'attendance'">
              <bar-chart :chart-data="attendanceData" />
            </template>
            <template v-else-if="item.type === 'check'">
              <bar-chart :chart-data="checkData" />
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import { getOrganization } from '@/js/localStore'
import { getOrgMsg } from '@/js/organization'
import barChart from './chart/barChart'
import lineChart from './chart/lineChart'
import { DateFormat } from '@/js/rules'
import {
  getWorkbenchAttendance,
  getWorkbenchCash,
  getWorkbenchCheck,
  getWorkBenchData,
  getWorkbenchFlow
} from '@/service/guardcare/homepage'

/**
 * index create by Administrator
 * createTime 2020/9/21 11:36
 */
export default {
  name: 'Index',
  components: {
    barChart,
    lineChart
  },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      organizations: [],
      organization: {},
      defaultLogo: require('../../../assets/images/guardcare/etm.png'),
      appData: [
        {
          name: '宝宝表现',
          icon: require('../../../assets/images/guardcare/app_review.png'),
          path: '/guardcare_comment'
        },
        {
          name: '幼儿请假',
          icon: require('../../../assets/images/guardcare/app_leave.png'),
          path: '/guardcare_leave'
        },
        {
          name: '幼儿考勤',
          icon: require('../../../assets/images/guardcare/app_attendance.png'),
          path: '/guardcare_attendance'
        },
        {
          name: '健康检查',
          icon: require('../../../assets/images/guardcare/app_check.png'),
          path: '/guardcare_bodyCheck'
        },
        {
          name: '每周计划',
          icon: require('../../../assets/images/guardcare/app_plan.png'),
          path: '/guardcare_weekPlan'
        },
        {
          name: '交代事宜',
          icon: require('../../../assets/images/guardcare/app_mark.png'),
          path: '/guardcare_matterList'
        },
        {
          name: '幼儿食谱',
          icon: require('../../../assets/images/guardcare/app_recipe.png'),
          path: '/guardcare_recipesManage'
        },
        {
          name: '云视频',
          icon: require('../../../assets/images/guardcare/app_video.png'),
          path: '/guardcare_monitorEquipment'
        },
        {
          name: '班级动态',
          icon: require('../../../assets/images/guardcare/app_clazz.png'),
          path: '/guardcare_clazzPost'
        },
        {
          name: '萌宝成长',
          icon: require('../../../assets/images/guardcare/app_daily.png'),
          path: '/guardcare_dailyManage'
        }
      ],
      currentData: {
        incomeAmount: 0,
        outcomeAmount: 0,
        cashFlow: 0,
        arrivedNumber: 0,
        notArrivedNumber: 0,
        requestForLeaveNumber: 0,
        checkCount: 0,
        abnormalCount: 0
      },
      lastData: {
        incomeAmount: 0,
        outcomeAmount: 0,
        cashFlow: 0,
        arrivedNumber: 0,
        notArrivedNumber: 0,
        requestForLeaveNumber: 0,
        checkCount: 0,
        abnormalCount: 0
      },
      fixedIndex: null,
      chart: [
        {
          name: '收入/支出',
          type: 'cash',
          active: 'week'
        },
        {
          name: '净现金流',
          type: 'flow',
          active: 'week'
        },
        {
          name: '幼儿考勤',
          type: 'attendance',
          active: 'week'
        },
        {
          name: '健康检查',
          type: 'check',
          active: 'week'
        }
      ],
      cashData: {
        content: []
      },
      flowData: {
        content: []
      },
      checkData: {
        content: []
      },
      attendanceData: {
        content: []
      }
    }
  },
  computed: {},
  watch: {},
  created() {
    this.organizations = getOrganization()
    this.organization = getOrgMsg()
  },
  mounted() {
    this.getCountData()
    this.getCashData('week')
    this.getFlowData('week')
    this.getCheckData('week')
    this.getAttendanceData('week')
  },
  methods: {
    toPath(path) {
      this.$router.push(path)
    },
    switchOrg() {
      if (this.organizations.length > 1) {
        this.$router.push({
          path: '/switchOrganization'
        })
      }
    },
    changeDate(data, active) {
      this.chart.forEach((item, index) => {
        if (data.name === item.name && item.active !== active) {
          this.chart[index].active = active
          if (item.type === 'cash') {
            this.getCashData(active)
          } else if (item.type === 'flow') {
            this.getFlowData(active)
          } else if (item.type === 'attendance') {
            this.getAttendanceData(active)
          } else if (item.type === 'check') {
            this.getCheckData(active)
          }
        }
      })
    },
    getCountData() {
      getWorkBenchData().then(res => {
        const data = res.data.data
        this.currentData = data.overview.thisMonth
        this.lastData = data.overview.lastMonth
        this.currentData.cashFlow = this.currentData.incomeAmount - this.currentData.outcomeAmount
        this.lastData.cashFlow = this.lastData.incomeAmount - this.lastData.outcomeAmount
      })
    },
    getCashData(type) {
      const param = {}
      if (type === 'week') {
        param.type = 'USE_WEEK'
        param.date = DateFormat(new Date(), 'yyyy-MM-dd')
      } else if (type === 'month') {
        param.type = 'USE_MONTH'
        param.date = DateFormat(new Date(), 'yyyy-MM')
      }
      getWorkbenchCash(param).then(res => {
        const data = res.data.data
        const cashData = {
          xData: [],
          content: [
            {
              color: '#15CD96',
              data: [],
              title: '收入'
            },
            {
              color: '#569EFF',
              data: [],
              title: '支出'
            }
          ]
        }
        data.forEach(item => {
          cashData.xData.push(item.date)
          cashData.content[0].data.push(item.incomeSum)
          cashData.content[1].data.push(item.outcomeSum)
        })
        this.cashData = cashData
      })
    },
    getFlowData(type) {
      const param = {}
      if (type === 'week') {
        param.type = 'USE_WEEK'
        param.date = DateFormat(new Date(), 'yyyy-MM-dd')
      } else if (type === 'month') {
        param.type = 'USE_MONTH'
        param.date = DateFormat(new Date(), 'yyyy-MM')
      }
      getWorkbenchFlow(param).then(res => {
        const data = res.data.data
        const flowData = {
          xData: [],
          content: [
            {
              color: '#FFA336',
              data: [],
              title: '现金'
            }
          ]
        }
        data.forEach(item => {
          flowData.xData.push(item.date)
          flowData.content[0].data.push(item.netSum)
        })
        this.flowData = flowData
      })
    },
    getCheckData(type) {
      const param = {}
      if (type === 'week') {
        param.type = 'USE_WEEK'
        param.date = DateFormat(new Date(), 'yyyy-MM-dd')
      } else if (type === 'month') {
        param.type = 'USE_MONTH'
        param.date = DateFormat(new Date(), 'yyyy-MM')
      }
      getWorkbenchCheck(param).then(res => {
        const data = res.data.data
        const checkData = {
          xData: [],
          content: [
            {
              color: '#15C692',
              data: [],
              title: '正常'
            },
            {
              color: '#FF696A',
              data: [],
              title: '异常'
            }
          ]
        }
        data.forEach(item => {
          checkData.xData.push(item.date)
          checkData.content[0].data.push(item.checkCount)
          checkData.content[1].data.push(item.abnormalCount)
        })
        this.checkData = checkData
      })
    },
    getAttendanceData(type) {
      const param = {}
      if (type === 'week') {
        param.type = 'USE_WEEK'
        param.date = DateFormat(new Date(), 'yyyy-MM-dd')
      } else if (type === 'month') {
        param.type = 'USE_MONTH'
        param.date = DateFormat(new Date(), 'yyyy-MM')
      }
      getWorkbenchAttendance(param).then(res => {
        const data = res.data.data
        const attendanceData = {
          xData: [],
          content: [
            {
              color: '#15C692',
              data: [],
              title: '出勤'
            },
            {
              color: '#FF696A',
              data: [],
              title: '缺勤'
            }
          ]
        }
        data.forEach(item => {
          attendanceData.xData.push(item.date)
          attendanceData.content[0].data.push(item.arrivedNumber)
          attendanceData.content[1].data.push(item.notArrivedNumber)
        })
        this.attendanceData = attendanceData
      })
    },
    formatNumber(number) {
      if (!number) {
        return number
      } else {
        return number.toFixed(2)
      }
    },
    openFixed(index) {
      if (index === this.fixedIndex) {
        this.fixedIndex = null
      } else {
        this.fixedIndex = index
      }
    },
    fixedTop(index) {
      this.fixedIndex = null
      const item = this.chart[index]
      this.chart.splice(index, 1)
      this.chart.unshift(item)
    }
  }
}
</script>
<style lang="scss" scoped>
.index-wrap {
  .header {
    position: relative;
    padding: 22.5px 12px;

    .headerBg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
    }

    .headerMsg {
      display: flex;
      align-items: center;
      position: relative;
      z-index: 1;

      .avatarBox {
        padding: 1.5px;
        width: 55px;
        height: 55px;
        background-color: $white;
        border: 1px solid $text-e;
        border-radius: 50%;

        .avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          overflow: hidden;
        }
      }

      .orgBox {
        margin-left: 20px;
        text-align: left;

        .organization {
          font-size: 19px;
          font-weight: bold;

          span {
            margin-right: 6px;
          }

          .iconright {
            font-size: 12px;
            font-weight: normal;
            color: $text-6;
          }
        }

        .taskBox {
          display: inline-block;
          margin-top: 12px;

          .task {
            display: flex;
            align-items: center;
            padding: 5px 8.5px;
            background-color: $white;
            border-radius: 13px;

            .iconImg {
              width: 16px;
              height: 16px;
            }

            .taskCount {
              margin: 0 4px;
              font-size: 12px;
            }

            .iconfont {
              font-size: 12px;
              transform: scale(0.7);
              color: $text-9;
            }
          }
        }
      }
    }
  }

  .content {
    padding: 0 12px 12px;

    .contentBox {
      background-color: $white;
      border-radius: 6px;

      &:not(:first-child) {
        margin-top: 12px;
      }
    }

    .appBox {
      padding: 20px 0;

      .van-col:nth-child(n+5) {
        margin-top: 15px;
      }

      .app {
        display: inline-block;

        .appImg {
          margin: 0 auto;
          width: 28px;
          height: 28px;
        }

        .appText {
          margin-top: 10px;
          font-size: 12px;
        }
      }
    }

    .mainBox {
      position: relative;
      padding: 12px;

      .top {
        display: flex;

        .topImg {
          width: 20px;
          height: 20px;
        }

        .title {
          margin-left: 8px;
          font-size: 14px;

          span {
            font-size: 11px;
            color: $text-9;
          }
        }
      }

      .count {
        margin-top: 12px;
        text-align: left;

        .number {
          display: flex;
          font-size: 18px;
          font-weight: bold;

          &.last {
            color: $text-5;
          }

          .income {
            color: #FFAD45;
          }

          .outcome {
            color: #FF5252;
          }

          .cash {
            color: #5297FF;
          }

          .attendance {
            color: $text-5;
          }

          .normal {
            color: #29CE9D;
          }

          .abnormal {
            color: #FF5555;
          }
        }

        .dateText {
          margin-top: 6px;
          font-size: 11px;
          color: $text-9;
        }
      }

      .mainBg {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 44px;
      }
    }

    .chartBox {
      padding: 15px 12px;

      .top {
        display: flex;
        justify-content: space-between;
        position: relative;
        padding-bottom: 16px;

        .title {
          height: 24px;
          line-height: 24px;
          font-size: 14px;
        }

        .titleRight {
          display: flex;

          .selectBox {
            display: flex;
            justify-content: space-between;
            padding: 2px;
            margin-right: 15px;
            width: 70px;
            height: 24px;
            border-radius: 12px;
            background-color: $bg-5;

            .selectItem {
              width: 32.5px;
              height: 20px;
              text-align: center;
              font-size: 13px;
              line-height: 20px;
              border-radius: 10px;

              &.active {
                background-color: $white;
              }
            }
          }
        }

        .iconmore {
          height: 24px;
          line-height: 24px;
          font-size: 14px;
          color: $text-b;
        }

        .fixedTop {
          display: flex;
          position: absolute;
          right: 16px;
          top: -5px;
          background-color: $white;

          .text {
            padding: 6px 12px;
            font-size: 12px;
            box-shadow: 0px 3px 10px 0px rgba(222, 222, 222, .6);
          }

          .icon {
            .iconfont {
              position: relative;
              left: -3px;
              font-size: 12px;
              color: $bg-4;
            }
          }
        }
      }
    }
  }
}
</style>
