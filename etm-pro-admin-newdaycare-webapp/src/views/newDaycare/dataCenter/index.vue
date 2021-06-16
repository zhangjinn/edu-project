<template>
  <div
    ref="box"
    class="index-wrap"
  >
    <etm-main-body>
      <div class="bannerBox">
        <el-carousel
          :interval="5000"
          :indicator-position="topAd.length > 1 ? '' : 'none'"
          :arrow="topAd.length > 1 ? 'hover' : 'never'"
          height="270px"
        >
          <el-carousel-item
            v-for="item in topAd"
            :key="item.id"
          >
            <img
              :src="item.imageUrl"
              @click="toUrl(item.linkUrl)"
            >
          </el-carousel-item>
        </el-carousel>
      </div>
      <div
        ref="fixedParent"
        class="timeBox"
      >
        <div
          ref="fixed"
          class="fixedBox"
        >
          <span>选择时间：</span>
          <el-date-picker
            v-model="startTime"
            placeholder="开始时间"
            :clearable="false"
            :picker-options="startOptions"
            @change="confirmStartTime"
          />
          <span class="divide">-</span>
          <el-date-picker
            v-model="endTime"
            placeholder="结束时间"
            :clearable="false"
            :picker-options="endOptions"
            @change="confirmEndTime"
          />
        </div>
      </div>
      <div class="cardBox">
        <etm-title
          :show-line="false"
          border
        >
          早教
        </etm-title>
        <div class="cardList">
          <div class="list">
            <div class="iconBox">
              <svg
                class="icon"
                aria-hidden="true"
              >
                <use xlink:href="#iconshourujine" />
              </svg>
            </div>
            <div class="data">
              <div class="count">
                ￥{{ teachData.incomeAmount }}
              </div>
              <div class="label">
                收入金额
              </div>
            </div>
          </div>
          <div class="list">
            <div class="iconBox">
              <svg
                class="icon"
                aria-hidden="true"
              >
                <use xlink:href="#iconzhichujine" />
              </svg>
            </div>
            <div class="data">
              <div class="count">
                ￥{{ teachData.expendAmount }}
              </div>
              <div class="label">
                支出金额
              </div>
            </div>
          </div>
          <div class="list">
            <div class="iconBox">
              <svg
                class="icon"
                aria-hidden="true"
              >
                <use xlink:href="#iconqiandanjine" />
              </svg>
            </div>
            <div class="data">
              <div class="count">
                ￥{{ teachData.newSigningAmount }}
              </div>
              <div class="label">
                新增签单金额
              </div>
            </div>
          </div>
          <div class="list">
            <div class="iconBox">
              <svg
                class="icon"
                aria-hidden="true"
              >
                <use xlink:href="#iconqiandanshuliang" />
              </svg>
            </div>
            <div class="data">
              <div class="count">
                {{ teachData.newSigningQuantity }}
              </div>
              <div class="label">
                新增签单数量
              </div>
            </div>
          </div>
          <div class="list">
            <div class="iconBox">
              <svg
                class="icon"
                aria-hidden="true"
              >
                <use xlink:href="#iconzaojiaohuiyuan" />
              </svg>
            </div>
            <div class="data">
              <div class="count">
                {{ teachData.childQuantity }}
              </div>
              <div class="label">
                早教会员数
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="cardBox">
        <etm-title
          :show-line="false"
          border
        >
          托育
        </etm-title>
        <div class="cardList">
          <div class="list">
            <div class="iconBox">
              <svg
                class="icon"
                aria-hidden="true"
              >
                <use xlink:href="#iconshourujine" />
              </svg>
            </div>
            <div class="data">
              <div class="count">
                ￥{{ careData.incomeAmount }}
              </div>
              <div class="label">
                收入金额
              </div>
            </div>
          </div>
          <div class="list">
            <div class="iconBox">
              <svg
                class="icon"
                aria-hidden="true"
              >
                <use xlink:href="#iconzhichujine" />
              </svg>
            </div>
            <div class="data">
              <div class="count">
                ￥{{ careData.expendAmount }}
              </div>
              <div class="label">
                支出金额
              </div>
            </div>
          </div>
          <div class="list">
            <div class="iconBox">
              <svg
                class="icon"
                aria-hidden="true"
              >
                <use xlink:href="#iconqiandanjine" />
              </svg>
            </div>
            <div class="data">
              <div class="count">
                ￥{{ careData.newSigningAmount }}
              </div>
              <div class="label">
                新增签单金额
              </div>
            </div>
          </div>
          <div class="list">
            <div class="iconBox">
              <svg
                class="icon"
                aria-hidden="true"
              >
                <use xlink:href="#iconrutuorenshu" />
              </svg>
            </div>
            <div class="data">
              <div class="count">
                {{ careData.newSigningChildQuantity }}
              </div>
              <div class="label">
                新增入托人数
              </div>
            </div>
          </div>
          <div class="list">
            <div class="iconBox">
              <svg
                class="icon"
                aria-hidden="true"
              >
                <use xlink:href="#iconshengyutuowei" />
              </svg>
            </div>
            <div class="data">
              <div class="count">
                {{ careData.remainPosition }}
              </div>
              <div class="label">
                剩余托位
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--      <div class="cardBox">-->
      <!--        <etm-title :show-line="false" border>幼儿园</etm-title>-->
      <!--        <div class="cardList">-->
      <!--          <div class="list">-->
      <!--            <div class="iconBox">-->
      <!--              <svg class="icon" aria-hidden="true">-->
      <!--                <use xlink:href="#iconshourujine" />-->
      <!--              </svg>-->
      <!--            </div>-->
      <!--            <div class="data">-->
      <!--              <div class="count">￥6885</div>-->
      <!--              <div class="label">收入金额</div>-->
      <!--            </div>-->
      <!--          </div>-->
      <!--          <div class="list">-->
      <!--            <div class="iconBox">-->
      <!--              <svg class="icon" aria-hidden="true">-->
      <!--                <use xlink:href="#iconzhichujine" />-->
      <!--              </svg>-->
      <!--            </div>-->
      <!--            <div class="data">-->
      <!--              <div class="count">￥6885</div>-->
      <!--              <div class="label">支出金额</div>-->
      <!--            </div>-->
      <!--          </div>-->
      <!--          <div class="list">-->
      <!--            <div class="iconBox">-->
      <!--              <svg class="icon" aria-hidden="true">-->
      <!--                <use xlink:href="#iconzaojiaohuiyuan" />-->
      <!--              </svg>-->
      <!--            </div>-->
      <!--            <div class="data">-->
      <!--              <div class="count">6885</div>-->
      <!--              <div class="label">在园幼儿总数</div>-->
      <!--            </div>-->
      <!--          </div>-->
      <!--          <div class="list">-->
      <!--            <div class="iconBox">-->
      <!--              <svg class="icon" aria-hidden="true">-->
      <!--                <use xlink:href="#iconyouerchuqinshuai" />-->
      <!--              </svg>-->
      <!--            </div>-->
      <!--            <div class="data">-->
      <!--              <div class="count">9886</div>-->
      <!--              <div class="label">幼儿出勤率</div>-->
      <!--            </div>-->
      <!--          </div>-->
      <!--          <div class="list">-->
      <!--            <div class="iconBox">-->
      <!--              <svg class="icon" aria-hidden="true">-->
      <!--                <use xlink:href="#iconyouerqueqinshuai" />-->
      <!--              </svg>-->
      <!--            </div>-->
      <!--            <div class="data">-->
      <!--              <div class="count">986</div>-->
      <!--              <div class="label">幼儿缺勤率</div>-->
      <!--            </div>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </div>-->
      <div class="contentBox">
        <div class="contentLeft">
          <div class="dataBox">
            <etm-title :show-line="false">
              早教数据
              <div
                slot="tool"
                class="toDetail"
                @click="toDataDetail('teach')"
              >
                详情
              </div>
            </etm-title>
            <etm-table
              :columns="columns"
              :data="teachTableData"
            >
              <el-table-column
                slot="right"
                label="总收入（元）"
                align="right"
                prop="teachDataVO.incomeAmount"
              />
              <el-table-column
                slot="right"
                label="新增签单数"
                prop="teachDataVO.newSigningQuantity"
              />
              <el-table-column
                slot="right"
                label="总会员（人）"
                prop="teachDataVO.childQuantity"
              />
            </etm-table>
          </div>
          <div class="dataBox">
            <etm-title :show-line="false">
              托育数据
              <div
                slot="tool"
                class="toDetail"
                @click="toDataDetail('care')"
              >
                详情
              </div>
            </etm-title>
            <etm-table
              :columns="columns"
              :data="careTableData"
            >
              <el-table-column
                slot="right"
                label="总收入（元）"
                align="right"
                prop="careDataVO.incomeAmount"
              />
              <el-table-column
                slot="right"
                label="新增入托（人）"
                prop="careDataVO.newSigningChildQuantity"
              />
              <el-table-column
                slot="right"
                label="总入托（人）"
                prop="careDataVO.inBookChildQuantity"
              />
            </etm-table>
          </div>
          <!--          <div class="dataBox">-->
          <!--            <etm-title :show-line="false">幼儿园数据</etm-title>-->
          <!--            <etm-table :columns="columns" :data="tableData" />-->
          <!--          </div>-->
          <div
            v-if="teachChartData.xData.length"
            class="dataBox"
          >
            <etm-title
              :show-line="false"
              border
            >
              早教学员情况
            </etm-title>
            <bar-chart :chart-data="teachChartData" />
          </div>
          <div
            v-if="careChartData.xData.length"
            class="dataBox"
          >
            <etm-title
              :show-line="false"
              border
            >
              托育学员情况
            </etm-title>
            <bar-chart :chart-data="careChartData" />
          </div>
          <!--          <div class="dataBox">-->
          <!--            <etm-title :show-line="false" border>幼儿园情况</etm-title>-->
          <!--            <bar-chart :chart-data="chartData" />-->
          <!--          </div>-->
        </div>
        <div class="contentRight">
          <div class="chartBox">
            <div class="chartTitle">
              <etm-title :show-line="false">
                全国会员分布
              </etm-title>
            </div>
            <china-map :province-data="provinceData" />
            <vertical-bar-chart :province-data="provinceData" />
          </div>
          <div class="smallAdBox">
            <el-carousel
              :interval="5000"
              :indicator-position="smallAd.length > 1 ? '' : 'none'"
              :arrow="smallAd.length > 1 ? 'hover' : 'never'"
              height="200px"
            >
              <el-carousel-item
                v-for="item in smallAd"
                :key="item.id"
              >
                <img
                  :src="item.imageUrl"
                  @click="toUrl(item.linkUrl)"
                >
              </el-carousel-item>
            </el-carousel>
          </div>
          <div class="headlineBox">
            <etm-title
              :show-line="false"
              border
            >
              行业头条
            </etm-title>
            <div class="scrollBox">
              <el-scrollbar class="scrollbar">
                <div
                  v-for="(item, index) in headline"
                  :key="index"
                  class="headline"
                  @click="toUrl(item.linkUrl)"
                >
                  <div class="headlineImg">
                    <img :src="item.image">
                  </div>
                  <div class="headlineContent">
                    <div class="title">
                      {{ item.title }}
                    </div>
                    <div class="time">
                      {{ transferTime(item.createTime) }}
                    </div>
                  </div>
                </div>
                <etm-empty v-if="!headline.length" />
              </el-scrollbar>
            </div>
          </div>
        </div>
      </div>
    </etm-main-body>
  </div>
</template>

<script>
import ChinaMap from '@/views/newDaycare/dataCenter/component/chinaMap'
import verticalBarChart from '@/views/newDaycare/dataCenter/component/verticalBarChart'
import barChart from '@/views/newDaycare/dataCenter/component/barChart'
import { queryAdByPosition, queryIndustryHeadlinesList } from '@/api/base/dashboard'
import { parseTime } from '@/utils'
import {
  queryCareChartData,
  queryCareTableData,
  queryEnterpriseData,
  queryMapData, queryTeachChartData,
  queryTeachTableData
} from '@/api/newDaycare/dataCenter'
import { getProvinceAbbreviation } from '@/utils/province'
import { mapGetters } from 'vuex'

/**
 * index create by Administrator
 * createTime 2020/11/19 14:36
 */
export default {
  name: 'Index',
  components: {
    ChinaMap,
    verticalBarChart,
    barChart
  },
  filters: {},
  mixins: [],
  props: {},
  data () {
    return {
      topAd: [],
      smallAd: [],
      startTime: '',
      endTime: '',
      startOptions: {},
      endOptions: {},
      teachData: {},
      careData: {},
      provinceData: [],
      teachTableData: [],
      careTableData: [],
      columns: [
        {
          label: '校区名称',
          prop: 'organizationName'
        },
        {
          label: '所属省份',
          prop: 'areaName'
        }
      ],
      teachChartData: {
        xData: [],
        content: []
      },
      careChartData: {
        xData: [],
        content: []
      },
      headline: [],
      fixedWidth: 0,
      fixedLeft: 0,
      fixedTop: 0
    }
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ])
  },
  watch: {
    sidebar: {
      handler () { // 监听侧边栏收起展开
        this.getDomRect()
      },
      deep: true
    }
  },
  created () {
    this.getAdImg()
    this.getHeadline()
    this.getMapData()
  },
  mounted () {
    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    const nextMonth = new Date(new Date().getFullYear(), (new Date().getMonth() + 1), 1)
    const monthEnd = new Date(nextMonth.getTime() - (1000 * 60 * 60 * 24))
    this.startTime = monthStart
    this.confirmStartTime(this.startTime)
    this.endTime = monthEnd
    this.confirmEndTime(this.endTime)

    // 滚动定位
    setTimeout(() => {
      const rect = this.$refs.fixed.getBoundingClientRect()
      this.fixedWidth = rect.width
      this.fixedLeft = rect.left
      this.fixedTop = rect.top
    }, 500)
    window.addEventListener('scroll', this.scrollEvent, true)

    // 窗口大小拉伸
    window.addEventListener('resize', this.getDomRect)
  },
  destroyed () {
    window.removeEventListener('scroll', this.scrollEvent, false)
  },
  methods: {
    getDomRect () { // 滚动定位信息暂存
      setTimeout(() => {
        const rect = this.$refs.fixedParent.getBoundingClientRect()
        this.fixedWidth = rect.width
        this.fixedLeft = rect.left
        const el = document.getElementById('app')
        const top = el.scrollTop
        const left = el.scrollLeft
        if (this.fixedTop - 97 < top) {
          this.$refs.fixed.style.width = this.fixedWidth + 'px'
          this.$refs.fixed.style.left = (this.fixedLeft - left) + 'px'
        }
      }, 500)
    },
    scrollEvent () {
      const el = document.getElementById('app')
      const top = el.scrollTop // 滚动距离
      const left = el.scrollLeft
      if (this.fixedTop - 97 < top) { // 滚动一定距离固定定位时间选择块元素
        this.$refs.fixed.classList.add('fixed')
        this.$refs.fixed.style.width = this.fixedWidth + 'px'
        this.$refs.fixed.style.left = (this.fixedLeft - left) + 'px'
      } else {
        this.$refs.fixed.classList.remove('fixed')
        this.$refs.fixed.style.width = ''
        this.$refs.fixed.style.left = ''
      }
    },
    confirmStartTime (date) { // 限制结束日期的选择
      this.endOptions = {
        disabledDate (time) {
          return time.getTime() < new Date(date).getTime()
        }
      }
      this.getData()
    },
    confirmEndTime (date) { // 限制开始日期的选择
      this.startOptions = {
        disabledDate (time) {
          return time.getTime() > new Date(date).getTime()
        }
      }
      this.getData()
    },
    getData () {
      if (this.startTime && this.endTime) {
        this.getEnterpriseData()
        this.getTableData()
        this.getChartData()
      }
    },
    getEnterpriseData () {
      const param = {
        startDate: parseTime(this.startTime, '{y}-{m}-{d}'),
        endDate: parseTime(this.endTime, '{y}-{m}-{d}')
      }
      queryEnterpriseData(param).then(res => {
        this.teachData = res.data.teachDataVO
        this.careData = res.data.careDataVO
      })
    },
    getTableData () { // 表格数据请求
      const param = {
        startDate: parseTime(this.startTime, '{y}-{m}-{d}'),
        endDate: parseTime(this.endTime, '{y}-{m}-{d}')
      }
      queryTeachTableData(param).then(res => {
        const data = res.data.content
        this.teachTableData = []
        if (data) {
          data.forEach((item, index) => {
            if (index < 5) {
              this.teachTableData.push(item)
            }
          })
        }
      })
      queryCareTableData(param).then(res => {
        const data = res.data.content
        this.careTableData = []
        if (data) {
          data.forEach((item, index) => {
            if (index < 5) {
              this.careTableData.push(item)
            }
          })
        }
      })
    },
    getChartData () { // 图表数据请求
      const param = {
        startDate: parseTime(this.startTime, '{y}-{m}-{d}'),
        endDate: parseTime(this.endTime, '{y}-{m}-{d}')
      }
      queryTeachChartData(param).then(res => {
        const data = res.data
        const teachChartData = {
          xData: [],
          content: [
            {
              color: '#5F97FF',
              data: [],
              title: '全部'
            },
            {
              color: '#FFA359',
              data: [],
              title: '意向'
            },
            {
              color: '#15C5EF',
              data: [],
              title: '会员'
            }
          ]
        }
        data.forEach(item => {
          teachChartData.xData.push(item.organizationName)
          teachChartData.content[0].data.push(item.allChildQuantity)
          teachChartData.content[1].data.push(item.intentionChildQuantity)
          teachChartData.content[2].data.push(item.dealChildQuantity)
        })
        this.teachChartData = teachChartData
      })
      queryCareChartData(param).then(res => {
        const data = res.data
        const careChartData = {
          xData: [],
          content: [
            {
              color: '#5F97FF',
              data: [],
              title: '全部'
            },
            {
              color: '#FFA359',
              data: [],
              title: '意向'
            },
            {
              color: '#15C5EF',
              data: [],
              title: '在托'
            }
          ]
        }
        data.forEach(item => {
          careChartData.xData.push(item.organizationName)
          careChartData.content[0].data.push(item.allChildQuantity)
          careChartData.content[1].data.push(item.intentionChildQuantity)
          careChartData.content[2].data.push(item.dealChildQuantity)
        })
        this.careChartData = careChartData
      })
    },
    getMapData () { // 地图数据请求
      queryMapData().then(res => {
        const data = res.data
        const provinceData = []
        data.forEach(item => {
          item.areaName = getProvinceAbbreviation(item.areaName)
          const province = {
            name: item.areaName,
            value: item.inBookQuantity
          }
          provinceData.push(province)
        })
        this.provinceData = provinceData
      })
    },
    getHeadline () { // 行业头条数据请求
      queryIndustryHeadlinesList({}).then(res => {
        this.headline = res.data.content
      })
    },
    transferTime (time) {
      if (!time) {
        return time
      } else {
        return parseTime(time, '{y}-{m}-{d} {h}:{i}:{s}')
      }
    },
    getAdImg () { // 广告位图片请求
      const param1 = { // 顶部广告位
        position: 'DATA_CENTER_TOP_BANNER',
        displayScope: 'HEADQUARTERS'
      }
      queryAdByPosition(param1).then(res => {
        this.topAd = res.data
      })
      const param2 = { // 右侧广告位
        position: 'ADVERTISEMENT_ON_THE_RIGHT_SIDE_OF_DATA_CENTER',
        displayScope: 'HEADQUARTERS'
      }
      queryAdByPosition(param2).then(res => {
        this.smallAd = res.data
      })
    },
    toDataDetail (type) {
      this.$router.push({
        path: '/newdaycare_dataCenterList_list',
        query: {
          startDate: parseTime(this.startTime, '{y}-{m}-{d}'),
          endDate: parseTime(this.endTime, '{y}-{m}-{d}'),
          type: type
        }
      })
    },
    toUrl (url) {
      if (url) {
        window.open(url)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.index-wrap {
  .bannerBox {
    background-color: #fff;
    border-radius: 10px;
    height: 270px;
    overflow: hidden;

    img {
      height: 100%;
      object-fit: cover;
      width: 100%;
    }
  }

  .timeBox {
    height: 64px;
    margin-top: 16px;

    .fixedBox {
      align-items: center;
      background-color: #fff;
      border-radius: 10px;
      display: flex;
      height: 64px;
      overflow: hidden;
      padding: 16px 24px;

      &.fixed {
        box-shadow: 0 0 10px rgba(34, 34, 34, 0.15);
        position: fixed;
        top: 84px;
        z-index: 11;
      }

      .el-date-editor {
        width: 140px;
      }

      .divide {
        margin: 0 6px;
      }
    }
  }

  .cardBox {
    background-color: #fff;
    border-radius: 10px;
    margin-top: 16px;
    overflow: hidden;
    padding: 16px;

    .cardList {
      display: flex;

      .list {
        align-items: center;
        display: flex;
        padding-left: 48px;
        width: 20%;

        &:not(:first-child) {
          padding-left: 64px;
          position: relative;

          &::before {
            @include bgc_divide_color();
            content: '';
            display: inline-block;
            height: 40px;
            left: 0;
            position: absolute;
            top: 8px;
            width: 1px;
          }
        }

        .iconBox {
          height: 56px;

          .icon {
            height: 56px;
            width: 56px;
          }
        }

        .data {
          margin-left: 24px;

          .count {
            @include c_title_color();
            font-size: 24px;
            font-weight: bold;
            height: 24px;
            line-height: 24px;
          }

          .label {
            @include c_secondary_color();
            font-size: 16px;
            height: 16px;
            line-height: 16px;
            margin-top: 8px;
          }
        }
      }
    }
  }

  .contentBox {
    display: flex;
    padding: 16px 0;

    .contentLeft {
      padding-right: 16px;
      width: calc(100% - 400px);

      .dataBox {
        background-color: #fff;
        border-radius: 10px;
        padding: 16px;

        &:not(:first-child) {
          margin-top: 16px;
        }

        .toDetail {
          @include c_secondary_color();
          cursor: pointer;
          width: 32px;

          &:hover {
            @include etm-color();
          }
        }
      }
    }

    .contentRight {
      width: 400px;

      .chartBox {
        background-color: #fff;
        border-radius: 10px;
        overflow: hidden;

        .chartTitle {
          padding: 16px 16px 0;
        }
      }

      .smallAdBox {
        background-color: #fff;
        border-radius: 10px;
        height: 200px;
        margin-top: 16px;
        overflow: hidden;

        img {
          height: 100%;
          object-fit: cover;
          width: 100%;
        }
      }

      .headlineBox {
        background-color: #fff;
        border-radius: 10px;
        margin-top: 16px;
        overflow: hidden;
        padding: 16px;

        .scrollBox {
          height: 300px;
          margin-right: -8px;

          .scrollbar {
            height: 300px;
            overflow-y: scroll;
          }

          .headline {
            align-items: center;
            cursor: pointer;
            display: flex;

            &:not(:first-child) {
              margin-top: 16px;
            }

            .headlineImg {
              border-radius: 4px;
              flex: 0 0 auto;
              height: 60px;
              overflow: hidden;
              width: 60px;

              img {
                height: 100%;
                object-fit: cover;
                width: 100%;
              }
            }

            .headlineContent {
              margin-left: 16px;

              .title {
                height: 14px;
                line-height: 14px;
              }

              .time {
                @include c_secondary_color();
                height: 14px;
                line-height: 14px;
                margin-top: 16px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
