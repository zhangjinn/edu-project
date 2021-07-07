<template>
  <div class="index-wrap">
    <div class="header">
      <div class="headerBg">
        <img src="../../../assets/images/daycare/headerBg.png">
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
      <!-- 工作台各个项目入口模块 -->
      <item-card />
      <!-- 数据卡片模块 -->
      <data-card />
      <!-- 广告位 -->
      <div class="adBox">
        <!--        <img src="../../../assets/images/guardcare/banner.png">-->
        广告位
      </div>
      <!-- echarts图表 -->
      <div v-for="(item, index) in chartData" :key="index" class="chart">
        <van-cell>
          <div class="top">
            <div class="title">{{ item.title }}</div>
            <span class="iconfont iconmore" @click="openFixed(index)" />
            <div v-show="index === fixedIndex" class="fixedTop">
              <div class="text" @click="fixedTop(index)">置顶</div>
            </div>
          </div>
          <bar-chart v-if="item.type === 'bar'" :chart-data="item" />
          <line-chart v-else-if="item.type === 'line'" :chart-data="item" />
        </van-cell>
      </div>
    </div>
  </div>
</template>
<script>
import { getOrganization } from '@/js/localStore'
import { getOrgMsg } from '@/js/organization'
import { findHistogram } from '@/service/daycare/homePage'
import itemCard from './components/itemCard'
import dataCard from './components/dataCard'
import barChart from './charts/barChart'
import lineChart from './charts/lineChart'

export default {
  name: 'Index',
  components: {
    itemCard,
    dataCard,
    barChart,
    lineChart
  },
  data() {
    return {
      organizations: [],
      organization: {},
      defaultLogo: require('../../../assets/images/daycare/etm.png'),
      chartData: [
        {
          type: 'line',
          title: '净现金流',
          legendData: ['净现金流'],
          color: ['#FFA336'],
          data: []
        },
        {
          type: 'bar',
          title: '客户转化',
          legendData: ['跟进', '成交'],
          color: ['#7FBB42', '#FF5252'],
          data: []
        },
        {
          type: 'line',
          title: '消课金额',
          legendData: ['消课金额'],
          color: ['#FFAD45', '#FF696A'],
          data: []
        },
        {
          type: 'bar',
          title: '消课课时',
          legendData: ['消课课时'],
          color: ['#FFA336'],
          data: []
        },
        {
          type: 'bar',
          title: '健康检查',
          legendData: ['正常', '异常'],
          color: ['#5297FF', '#FFB852'],
          data: []
        },
        {
          type: 'bar',
          title: '考勤统计',
          legendData: ['出勤', '缺勤'],
          color: ['#5297FF', '#FFB852'],
          data: []
        }

      ],
      fixedIndex: null
    }
  },
  created() {
    this.organizations = getOrganization()
    this.organization = getOrgMsg()
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const types = ['INCOME_AND_EXPENSES', 'CUSTOMER_CONVERSION', 'CONSUME_COURSE_AMOUNT', 'CONSUME_COURSE_LESSON', 'HEALTH_EXAMINATION', 'ATTENDANCE']
      types.forEach((item, index) => {
        const obj = {
          type: item,
          status: 'MONTH',
          startTime: this.firstDayAndLastDay().fistDay,
          endTime: this.firstDayAndLastDay().lastDay
        }
        findHistogram(obj).then(res => {
          if (res.data.message === '成功') {
            this.chartData[index].data = res.data.data
          }
        })
      })
    },
    switchOrg() {
      if (this.organizations.length > 1) {
        this.$router.push({
          path: '/switchOrganization'
        })
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
      const item = this.chartData[index]
      this.chartData.splice(index, 1)
      this.chartData.unshift(item)
    },
    firstDayAndLastDay() {
      const nowDate = new Date()
      const firstDate = new Date(nowDate.getFullYear(), nowDate.getMonth(), 1)
      const lastDate = new Date(nowDate.getFullYear(), nowDate.getMonth() + 1, 0)
      return {
        fistDay: `${firstDate.getFullYear()}-${(firstDate.getMonth() + 1 + '').padStart(2, 0)}-${(firstDate.getDate() + '').padStart(2, 0)}`,
        lastDay: `${lastDate.getFullYear()}-${(lastDate.getMonth() + 1 + '').padStart(2, 0)}-${(lastDate.getDate() + '').padStart(2, 0)}`
      }
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
    /deep/ .van-cell {
      border-radius: 6px;
    }

    .adBox {
      margin-bottom: 12px;
      height: 65px;
      line-height: 65px;
      font-weight: 700;
      color: #FDB34A;
      background: #FCE4C3;
    }

    .chart {
      margin-top: 12px;

      .top {
        display: flex;
        justify-content: space-between;
        position: relative;
        padding-bottom: 16px;

        .title {
          color: #222222;
          font-size: 14px;
        }

        .iconmore {
          height: 19px;
          line-height: 19px;
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
