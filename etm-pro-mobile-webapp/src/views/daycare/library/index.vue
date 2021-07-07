<template>
  <div class="index-wrap">
    <setting-title to-path="/">
      <span>借阅管理</span>
    </setting-title>
    <div class="main-content">
      <item-card :borrow-data="borrowData" />
      <div class="manage">
        <div class="icon-txt">
          <div class="icon"><img :src="icon" alt=""></div>
          <span>图书管理</span>
        </div>
        <i class="iconfont iconright1" @click="$router.push('/libraryManage')" />
      </div>
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
          <line-chart
            v-else-if="item.type === 'line'"
            :chart-data="item"
          />
        </van-cell>
      </div>
    </div>
  </div>

</template>

<script>
/**
 * index create by 油麦菜
 * createTime 2020/11/27 9:27
 */
import lineChart from './charts/lineChart'
import barChart from './charts/barChart'
import itemCard from './components/itemCard'
import settingTitle from './components/settingTitle'
import { queryBorrowDetail } from '@/service/daycare/library'
export default {
  name: 'Index',
  components: {
    itemCard,
    lineChart,
    barChart,
    settingTitle
  },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      borrowData: {},
      icon: require('@/assets/images/daycare/book-manage-icon.png'),
      fixedIndex: null,
      chartData: [
        {
          type: 'line',
          title: '借书人数',
          legendData: ['借书人数'],
          color: ['#10C2C4'],
          data: []
        },
        {
          type: 'bar',
          title: '借还记录',
          legendData: ['归还', '借出'],
          color: ['#6CA5FF', '#FF7464'],
          data: []
        }
      ]
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      queryBorrowDetail().then(res => {
        if (res.data.message === '成功') {
          this.borrowData = res.data.data
          this.chartData[0].data = res.data.data.statisticsVOList
          this.chartData[1].data = res.data.data.statisticsVOList
        }
      })
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
  //height: 100vh;
  background: #F7F8FA;
  //padding: 14px;
  .main-content {
    padding: 14px;
  }
  .manage {
    display: flex;
    justify-content: space-between;
    margin: 15px 0;
    //padding-top: 14px;
    height: 49px;
    background: #FFFFFF;
    border-radius: 3px;
    .icon-txt {
      display: flex;
      margin-top: 14px;
      line-height: 19px;
      .icon {
        margin: 0 14px 0 12px;
        width: 20px;
        height: 20px;
        img {
          width: 100%;
          height: 100%;
        }
        .txt {
          font-size: 16px;
          font-weight: 400;
          color: #222222;
        }
      }
    }
    .iconright1 {
      margin-right: 17px;
      align-self: center;
    }
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
</style>
