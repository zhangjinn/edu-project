<template>
  <div class="index-wrap">
    <div class="header">
      <div class="headerBg">
        <img src="../../../assets/images/homeBg.png">
      </div>
      <div class="headerMsg">
        <div class="headerLeft">
          <div class="avatarBox">
            <div class="avatar">
              <img :src="organization.logo || defaultLogo">
            </div>
          </div>
          <div class="orgBox">
            <div class="organization" @click="switchOrg">
              <span>{{ organization.name }}</span>
              <span class="iconfont iconright" />
            </div>
          </div>
        </div>
        <div class="headerRight">
          <div class="toDoBox" @click="editToDo">
            <div class="toDoImg">
              <img src="../../../assets/images/todoIcon.png">
            </div>
            <div class="toDoCount">{{ toDoCount }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="homeContent">
      <div class="quickBox">
        <van-row>
          <van-col v-for="(app, index) in appData" :key="index" :span="6">
            <div class="app" @click="toPath(app.detailUri)">
              <div class="appIcon">
                <svg class="icon" aria-hidden="true">
                  <use :xlink:href="`#${app.config.icon}`" />
                </svg>
              </div>
              <div class="appText">{{ app.displayName }}</div>
            </div>
          </van-col>
          <van-col :span="6">
            <div class="app" @click="editQuickApp">
              <div class="appIcon">
                <img src="../../../assets/images/moreQuick.png">
              </div>
              <div class="appText">更多</div>
            </div>
          </van-col>
        </van-row>
      </div>
      <div class="headlineBox">
        <div class="headlineImg">
          <img src="../../../assets/images/headline.png">
        </div>
        <div class="dot" />
        <div class="headlineList">
          <van-swipe vertical :show-indicators="false" style="height: 0.44rem;" :autoplay="3000">
            <van-swipe-item v-for="(list, index) in headlineData" :key="index">
              <div class="item" @click="toUrl(list.linkUrl)">
                <div class="text">{{ list.title }}</div>
              </div>
            </van-swipe-item>
          </van-swipe>
        </div>
      </div>
    </div>
    <div class="dataCardBox">
      <div class="scrollBox">
        <div v-for="(item, index) in dataCard" :key="index" class="dataCard">
          <div class="icons">
            <svg class="icon" aria-hidden="true">
              <use :xlink:href="`#${item.config.icon}`" />
            </svg>
          </div>
          <div class="count">{{ item.config.unit }}{{ item.dataCount }}</div>
          <div class="labelText">{{ item.displayName }}</div>
        </div>
        <div class="dataCard" @click="editDataCard">
          <div class="iconBox">
            <span class="iconfont iconplus" />
          </div>
          <div class="text">添加更多</div>
        </div>
      </div>
    </div>
    <div class="homeAdBox">
      <div class="imgBox">
        <van-swipe style="height: 2rem;" :autoplay="3000" indicator-color="white">
          <van-swipe-item v-for="(list, index) in adList" :key="index">
            <img :src="list.imageUrl" @click="toUrl(list.linkUrl)">
          </van-swipe-item>
        </van-swipe>
      </div>
    </div>
    <div class="chartBox">
      <div v-for="(item, index) in chartData" :key="index" class="contentBox">
        <div class="top">
          <div class="title">{{ item.displayName }}</div>
          <div class="titleRight">
            <!--            <div class="selectBox">-->
            <!--              <div class="selectItem" :class="item.active === 'week' ? 'active' : ''" @click="changeDate(item, 'week')">-->
            <!--                周-->
            <!--              </div>-->
            <!--              <div-->
            <!--                class="selectItem"-->
            <!--                :class="item.active === 'month' ? 'active' : ''"-->
            <!--                @click="changeDate(item, 'month')"-->
            <!--              >月-->
            <!--              </div>-->
            <!--            </div>-->
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
          <template v-if="item.config.chartType === 'line'">
            <line-chart :chart-data="item.data" />
          </template>
          <template v-else-if="item.config.chartType === 'bar'">
            <bar-chart :chart-data="item.data" />
          </template>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import { getOrganization } from '@/js/localStore'
import { getOrgMsg } from '@/js/organization'
import {
  queryAdvertisement,
  queryDashboardResource,
  queryDashboardSetting,
  queryHeadlineList,
  queryHomepageData
} from '@/service/base/basic'
import ad_banner from '@/assets/images/ad_banner.png'
import lineChart from './component/lineChart'
import barChart from './component/barChart'
import dayjs from 'dayjs'

/**
 * index create by Administrator
 * createTime 2020/11/20 14:02
 */
export default {
  name: 'Index',
  components: {
    lineChart,
    barChart
  },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      organizations: [],
      organization: {},
      defaultLogo: require('../../../assets/images/etm.png'),
      resourceData: [],
      toDoCount: 0,
      settingData: {},
      appData: [],
      headlineData: [],
      dataCard: [],
      adList: [],
      defaultAd: ad_banner,
      chartData: [],
      fixedIndex: null
    }
  },
  computed: {},
  watch: {},
  created() {
    this.organizations = getOrganization()
    this.organization = getOrgMsg()
  },
  mounted() {
    this.getData()
    this.getHeadline()
    this.getAdImg()
  },
  methods: {
    switchOrg() {
      this.$router.push({
        path: '/switchOrganization'
      })
    },
    getHeadline() {
      const param = {
        paged: false
      }
      queryHeadlineList(param).then(res => {
        this.headlineData = res.data.data.content
      })
    },
    getAdImg() {
      const param = {
        position: 'FRONT_PAGE_MIDDLE_ADVERTISEMENT_ONE',
        displayScope: 'MOBILE_MANAGEMENT_SCOPE'
      }
      queryAdvertisement(param).then(res => {
        this.adList = res.data.data
        if (res.data.data.length === 0) {
          this.adList = [
            {
              imageUrl: this.defaultAd
            }
          ]
        }
      })
    },
    getData() {
      const param = {
        terminalType: 'MOBILE'
      }
      queryDashboardResource(param).then(res => {
        this.resourceData = res.data.data
        this.getMyData()
      })
    },
    getMyData() {
      queryDashboardSetting({ terminalType: 'MOBILE', type: null }).then(res => {
        this.settingData = res.data.data.resourceConfig
        // this.toDoCount = this.filterData('TODO')
        this.appData = this.filterData('QUICK_OPERATION')
        const dataCard = this.filterData('DATA_CARD')
        this.getCardData(dataCard)
        const chartData = this.filterData('STATISTIC_CHART_ONE')
        this.getEchartData(chartData)
      })
    },
    getCardData(dataCard) {
      this.dataCard = []
      dataCard.forEach(data => {
        const param = {
          type: data.dataApi.params.type
        }
        queryHomepageData(data.dataApi.url, param).then(res => {
          const resData = res.data.data.currentMonth
          let count = ''
          resData.forEach((item, index) => {
            if (index === 0) {
              count += item
            } else {
              count += '/' + item
            }
          })
          data.dataCount = count
          this.dataCard.push(data)
        })
      })
    },
    getEchartData(chartData) {
      const startTime = dayjs(new Date()).startOf('month').format('YYYY-MM-DD')
      const endTime = dayjs(new Date()).endOf('month').format('YYYY-MM-DD')
      this.chartData = []
      chartData.forEach(data => {
        const param = {
          type: data.dataApi.params.type,
          status: 'MONTH',
          startTime: startTime,
          endTime: endTime
        }
        queryHomepageData(data.dataApi.url, param).then(res => {
          const chart = res.data.data
          chart.forEach(item => {
            data.data.xData.push(item.date)
            data.data.content[0].data.push(item.theLordValues)
            if (item.timesValues) {
              data.data.content[1].data.push(item.timesValues)
            }
          })
          this.chartData.push(data)
        })
      })
    },
    filterData(type) {
      const data = []
      let count = 0
      if (type === 'STATISTIC_CHART_ONE') {
        this.resourceData.forEach(item => {
          if (item.type === type) {
            item.config = JSON.parse(item.config)
            item.dataApi = JSON.parse(item.dataApi)
            item.active = 'week'
            item.chartData = []
            item.data = {
              xData: [],
              content: []
            }
            item.config.labels.forEach(label => {
              const obj = {
                color: label.color,
                data: [],
                title: label.label
              }
              item.data.content.push(obj)
            })
            data.push(item)
          }
        })
        return data
      } else if (type === 'TODO') {
        this.resourceData.forEach(item => {
          if (item.type === type) {
            count++
          }
        })
        return count
      } else {
        if (this.settingData[type]) {
          const list = this.settingData[type]
          this.resourceData.forEach(item => {
            for (let i = 0; i < list.length; i++) {
              if (item.dashboardResourceId === list[i]) {
                item.config = JSON.parse(item.config)
                if (item.dataApi) {
                  item.dataApi = JSON.parse(item.dataApi)
                }
                data.push(item)
              }
            }
          })
          return data
        } else {
          for (let i = 0; i < this.resourceData.length; i++) {
            const item = this.resourceData[i]
            if (item.type === type) {
              item.config = JSON.parse(item.config)
              if (item.dataApi) {
                item.dataApi = JSON.parse(item.dataApi)
              }
              data.push(item)
              if (type === 'DATA_CARD' && data.length === 4) {
                return data
              } else if (type === 'QUICK_OPERATION' && data.length === 8) {
                return data
              }
            }
          }
          return data
        }
      }
    },
    editToDo() {
      this.$router.push({
        path: '/toDoList'
      })
    },
    toPath(path) {
      if (path) {
        path = '/' + path
        this.$router.push({
          path: path
        })
      }
    },
    editQuickApp() {
      this.$router.push({
        path: '/editQuick'
      })
    },
    editDataCard() {
      this.$router.push({
        path: '/editData'
      })
    },
    toUrl(url) {
      if (url) {
        location.href = url
      }
    },
    changeDate(data, active) {

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
    }
  }
}
</script>
<style lang="scss" scoped>
.index-wrap {
  .header {
    position: relative;
    padding: 15px 12px;

    .headerBg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
    }

    .headerMsg {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      z-index: 1;

      .headerLeft {
        display: flex;
        align-items: center;

        .avatarBox {
          width: 60px;
          height: 60px;
          background-color: $white;
          border: 1px solid $text-e;
          border-radius: 50%;

          .avatar {
            width: 58px;
            height: 58px;
            border-radius: 50%;
            overflow: hidden;
          }
        }

        .orgBox {
          margin-left: 12px;
          text-align: left;

          .organization {
            font-size: 19px;
            font-weight: bold;
            color: $white;

            span {
              margin-right: 6px;
            }

            .iconright {
              display: inline-block;
              height: 25px;
              line-height: 25px;
              font-size: 12px;
              font-weight: normal;
              color: $white;
            }
          }
        }
      }

      .headerRight {
        .toDoBox {
          position: relative;
          padding: 8px 8px 8px 0;

          .toDoImg {
            width: 20px;
          }

          .toDoCount {
            position: absolute;
            top: 0;
            right: 0;
            width: 16px;
            height: 16px;
            font-size: 10px;
            color: $white;
            line-height: 14px;
            border: .5px solid $white;
            border-radius: 50%;
            background-color: $red;
          }
        }
      }
    }
  }

  .homeContent {
    position: relative;
    padding: 0 12px 16px;

    .quickBox {
      padding: 24px 0;
      background-color: $white;
      border-radius: 6px;

      .van-col:nth-child(n+5) {
        margin-top: 24px;
      }

      .app {
        display: inline-block;

        .appIcon {
          margin: 0 auto;
          width: 41px;
          height: 41px;

          .icon {
            width: 41px;
            height: 41px;
          }
        }

        .appText {
          margin-top: 10px;
          font-size: 12px;
        }
      }
    }

    .headlineBox {
      display: flex;
      align-items: center;
      margin-top: 12px;
      padding: 22px 17px;
      background-color: $white;
      border-radius: 6px;

      .headlineImg {
        width: 34.5px;
      }

      .dot {
        margin: 0 5px 0 18px;
        width: 3px;
        height: 3px;
        border-radius: 50%;
        background-color: $text-2;
      }

      .headlineList {
        .item {
          .text {
            width: 240px;
            height: 16.5px;
            line-height: 16.5px;
            font-size: 14px;
            color: $black;
            text-align: left;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }

  .dataCardBox {
    .scrollBox {
      padding: 0 12px;
      overflow-x: auto;
      text-align: left;
      white-space: nowrap;

      .dataCard {
        display: inline-block;
        padding: 32px 20px 0;
        width: 140px;
        height: 155px;
        background-color: $white;
        border-radius: 6px;
        vertical-align: middle;

        & + .dataCard {
          margin-left: 12px;
        }

        .icons {
          height: 24px;

          .icon {
            width: 24px;
            height: 24px;
          }
        }

        .count {
          margin-top: 20px;
          font-size: 20px;
          font-weight: bold;
        }

        .labelText {
          margin-top: 12px;
          color: $text-9;
          font-size: 12px;
        }

        .iconBox {
          padding-top: 20px;
          text-align: center;

          .iconplus {
            font-size: 26px;
            color: $theme;
          }
        }

        .text {
          margin-top: 12px;
          font-size: 14px;
          text-align: center;
        }
      }
    }
  }

  .homeAdBox {
    padding: 12px;

    .imgBox {
      border-radius: 6px;
      overflow: hidden;
    }
  }

  .chartBox {
    padding: 0 12px 12px;

    .contentBox {
      padding: 15px 12px;
      background-color: $white;
      border-radius: 6px;

      & + .contentBox {
        margin-top: 12px;
      }

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
