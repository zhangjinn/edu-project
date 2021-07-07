<template>
  <div class="index-wrap">

    <!--广告轮播-->
    <el-row>
      <div class="ad-panel">
        <div class="headBgc">
          <el-carousel height="270px" trigger="click">
            <el-carousel-item v-for="item in bannerBgc" :key="item">
              <!--            <img :src="item" alt="" >-->
              <div :style="{background:'url(' + item + ') no-repeat center center/cover'}" class="bgcImg" />
            </el-carousel-item>
          </el-carousel>
        </div>
        <div class="search">
          <img alt="" src="../../../assets/dashboard/NewText.png">
          <div class="search-input">
            <!--            <el-select slot="prepend" v-model="search.type" size="large" style="width: 100px;" placeholder="全部">-->
            <!--              <el-option label="菜单" value="menu" />-->
            <!--            </el-select>-->
            <el-autocomplete
              ref="autocomplete"
              v-model="search.childName"
              size="large"
              clearable
              placeholder="请输入菜单名称，如：我的学员"
              class="input-with-select"
              :fetch-suggestions="querySearchAsync"
              @select="handleSelect"
            >
              <template slot-scope="{ item }">
                <div>{{ item.value }}</div>
              </template>
              <!--            <div slot="append" class="el-icon-right" @click="navigateTo" />-->
            </el-autocomplete>
          </div>

          <div class="marquee-box">
            <span>行业资讯：</span>
            <vue-roll-up
              :duration="5000"
              :roll-list="industryHeadLineList"
              :speed="500"
              color="white"
              use-slot
              width="100%"
            >
              <template v-slot="{ marquee }">
                <span style="cursor:pointer;" @click="navigateTo(marquee)">{{ marquee.title }}</span>
              </template>
            </vue-roll-up>
          </div>

        </div>
        <!--        <div class="banner">-->
        <!--          <el-carousel indicator-position="outside">-->
        <!--            <el-carousel-item v-for="item in 4" :key="item">-->
        <!--              <img src="../../../assets/dashboard/banner.png" alt="">-->
        <!--            </el-carousel-item>-->
        <!--          </el-carousel>-->
        <!--        </div>-->
      </div>
    </el-row>

    <!--快捷面板-->
    <el-row style="margin-top: 16px;">
      <div class="quick-panel">
        <div
          v-for="(item) of quickPanelSelectList"
          :key="item.dashboardResourceId"
          class="quick-item"
          @click="$router.push({path: '/' + item.detailUri})"
        >
          <svg class="icon" aria-hidden="true">
            <use :xlink:href="`#${item.config.icon}`" />
          </svg>
          <span style="margin-left: 8px;">{{ item.displayName }}</span>
        </div>
        <div class="quick-item" @click="handleAddQuick">
          <i class="iconfont iconplus" />
          添加更多
        </div>
      </div>
    </el-row>

    <el-row class="data-panel-content">
      <!--数据看板-->
      <el-col :span="16" class="data-left-panel">
        <div class="data-panel">
          <div class="data-card">
            <ItemCard
              v-for="(item,index) of dataCardSelectList"
              :key="item.dashboardResourceId"
              :background-image="backgrounds[index]"
              :prop="item"
              @click="$router.push({path: '/' + item.detailUri})"
              @close="closeCard(item)"
            />
            <div
              v-if="dataCardSelectList.length <= 4"
              class="add-card"
              @click="handleAddCard"
            >
              <i class="iconfont iconplus" />
              添加更多
            </div>
          </div>
        </div>

        <!--图表-->
        <div class="chart-panel">
          <dashboard-chart
            v-for="(item) of dataChartSelectList"
            :key="item.dashboardResourceId"
            :chart-config="item"
            class="chart-item"
          />
        </div>
      </el-col>

      <!--通知动态-->
      <el-col :span="8" class="data-right-panel">
        <div class="notify-panel">
          <div class="todo-panel notify-panel-item">
            <etm-title title="待办事项" :show-line="false" :border="false">
              <!--              <span slot="tool" style="white-space: nowrap;cursor: pointer">-->
              <!--                更多-->
              <!--                <i class="el-icon-arrow-right" />-->
              <!--              </span>-->
            </etm-title>
            <div class="content-box">
              <item-todo
                v-for="(item, index) of todoList"
                :key="index"
                :prop="item"
              />
              <etm-empty v-if="todoList.length === 0" />
            </div>

          </div>
          <div class="ad1-panel notify-panel-item">
            <!--            <img src="../../../assets/dashboard/banner-ad.png" alt="">-->
            <el-carousel
              v-if="adBanner1.length"
              :indicator-position="adBanner1.length > 1 ? '' : 'none'"
              arrow="never"
              height="200px"
            >
              <el-carousel-item v-for="(item,index) in adBanner1" :key="index">
                <img :src="item.imageUrl" alt="" :class="item.linkUrl ? 'behover' : ''" @click="openUrl(item)">
              </el-carousel-item>
            </el-carousel>
            <etm-empty v-else />
          </div>
          <div class="headlines-panel notify-panel-item">
            <etm-title title="行业头条" :show-line="false" :border="false">
              <span slot="tool" class="moreText" @click="toMoreHeadline">
                更多
                <i class="el-icon-arrow-right" />
              </span>
            </etm-title>
            <div class="content-box">
              <el-scrollbar>
                <div
                  v-for="(item,index) of industryHeadLineList"
                  :key="index"
                  class="headline-item"
                  @click="navigateTo(item)"
                >
                  <img :src="item.image" alt="">
                  <div class="item-content">
                    <div class="item-title">{{ item.title }}</div>
                    <div class="item-date">{{ item.createTime }}</div>
                  </div>
                </div>
              </el-scrollbar>
              <etm-empty v-if="industryHeadLineList.length === 0" />
            </div>
          </div>
          <div class="product-panel notify-panel-item">
            <etm-title title="产品动态" :show-line="false" :border="false">
              <span slot="tool" class="moreText" @click="toMoreProduct">
                更多
                <i class="el-icon-arrow-right" />
              </span>
            </etm-title>
            <div class="content-box">
              <item-news
                v-for="(item,index) of productAll"
                :key="index"
                v-bind="{...item}"
                @click="navigateTo(item)"
              />
              <etm-empty v-if="productAll.length === 0" />
            </div>

          </div>
          <div class="ad1-panel notify-panel-item">
            <!--            <img src="../../../assets/dashboard/product.png" alt="">-->
            <el-carousel
              v-if="adBanner2.length"
              :indicator-position="adBanner2.length > 1 ? '' : 'none'"
              arrow="never"
              height="200px"
            >
              <el-carousel-item v-for="(item,index) in adBanner2" :key="index">
                <img :src="item.imageUrl" alt="" :class="item.linkUrl ? 'behover' : ''" @click="openUrl(item)">
              </el-carousel-item>
            </el-carousel>
            <etm-empty v-else />
          </div>
        </div>
      </el-col>
    </el-row>

    <!--添加快捷操作-->
    <etm-pop
      :visible.sync="addQuickVisible"
      pop="complex"
      title="设置快捷操作"
      class="add-card"
      :append-to-body="false"
      @close="() => addQuickVisible = false"
      @cancel="addQuickVisible = false"
      @confirm="handleQuickConfirm"
    >
      <div class="card-tip">
        最多可选8个快捷操作 {{ quickPanelOperationAll.filter(i => i.isActive).length }}/8
      </div>
      <item-btn
        v-for="(item,index) of quickPanelOperationAll"
        :key="index"
        :active="item.isActive"
        @click="toggleItemStatus(quickPanelOperationAll, item, 8)"
      >
        {{ item.displayName }}
      </item-btn>
    </etm-pop>

    <!--添加数据卡-->
    <etm-pop
      :visible="addCardVisible"
      pop="complex"
      title="设置数据卡"
      class="add-card"
      :append-to-body="false"
      @close="addCardVisible = false"
      @cancel="addCardVisible = false"
      @confirm="handleCardConfirm"
    >
      <div class="card-tip">
        最多可选5个数据卡 {{ dataCardAll.filter(i => i.isActive).length }}/5
      </div>
      <item-btn
        v-for="(item,index) of dataCardAll"
        :key="index"
        :active="item.isActive"
        @click="toggleItemStatus(dataCardAll, item, 5)"
      >
        本月{{ item.displayName }}
      </item-btn>
    </etm-pop>
  </div>

</template>

<script>
/**
 * index create by haijinsha
 * createTime 2020/11/23 09:43
 */
import {
  queryAdByPosition,
  queryCurrentEmployeeDashboardRecourseAll,
  queryCurrentEmployeeDashboardResource,
  queryDashboardProductDynamicList,
  queryIndustryHeadlinesList,
  updateCurrentEmployeeDashboardResource
} from '@/api/base/dashboard'
import DashboardChart from '@/views/base/dashboardV2/components/barChart'
import ItemBtn from '@/views/base/dashboardV2/components/ItemBtn'
import ItemCard from '@/views/base/dashboardV2/components/ItemCard'
import ItemTodo from '@/views/base/dashboardV2/components/ItemTodo'
import { parseTime } from '@/utils'
import { removeAllInfo } from '@/utils/auth'
import VueRollUp from 'vue-roll-up'
import ItemNews from '@/views/base/dashboardV2/components/ItemNews'

const pinyin = require('pinyin')
export default {
  name: 'Index',
  components: { ItemNews, ItemTodo, ItemCard, ItemBtn, DashboardChart, VueRollUp },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      search: {
        childName: '',
        type: 'menu'
      },
      solution: [],
      menus: [],
      result: [],
      bannerBgc: [
        require('../../../assets/dashboard/banner2.jpg'),
        require('../../../assets/dashboard/banner.png'),
        require('../../../assets/dashboard/banner1.jpg')
      ],
      backgrounds: [
        require('../../../assets/dashboard/1.png'),
        require('../../../assets/dashboard/2.png'),
        require('../../../assets/dashboard/3.png'),
        require('../../../assets/dashboard/4.png'),
        require('../../../assets/dashboard/5.png')
      ],
      addCardVisible: false,
      // 所有的资源
      dataCardAll: [],
      // 选中的资源
      dataCardSelectList: [],
      // 快捷面板
      addQuickVisible: false,
      quickPanelOperationAll: [],
      quickPanelAll: [],
      quickPanelSelectList: [],
      // 图表
      dataChartAll: [],
      dataChartSelectList: [],
      // 代办事项
      dataTodoAll: {},
      todoList: [],
      // 产品动态
      productAll: [],
      // 行业头条
      industryHeadLineList: [],
      // 广告位1
      adBanner1: [],
      // 广告位2
      adBanner2: []
    }
  },
  computed: {},
  watch: {},
  created() {
    this.init()
  },
  activated() {
    this.autocompleteFocus()
  },
  mounted() {
    this.autocompleteFocus()
    queryIndustryHeadlinesList({}).then(res => {
      this.industryHeadLineList = res.data.content.map((item, index) => {
        item.createTime = parseTime(item.createTime, '{y}-{m}-{d}')
        return item
      })
      this.industryHeadLineList = this.industryHeadLineList.slice(0, 3)
    })

    queryAdByPosition({
      position: 'ADVERTISEMENT_ONE_ON_THE_RIGHT_SIDE_OF_WORKBENCH',
      displayScope: 'BPC_MANAGEMENT_SCOPE'
    }).then(res => {
      this.adBanner1 = res.data
    })

    queryAdByPosition({
      position: 'ADVERTISEMENT_TWO_ON_THE_RIGHT_SIDE_OF_WORKBENCH',
      displayScope: 'BPC_MANAGEMENT_SCOPE'
    }).then(res => {
      this.adBanner2 = res.data
    })

    queryDashboardProductDynamicList().then(res => {
      this.productAll = res.data.map(item => {
        item.crateTime = parseTime(item.createTime, '{y}-{m}-{d}')
        return item
      })
      this.productAll = this.productAll.slice(0, 6)
    })
  },
  methods: {
    autocompleteFocus() {
      // this.$refs.autocomplete.focus()
    },
    clear() {
      this.dataCardAll = []
      this.dataCardSelectList = []
      this.dataCardSelectIdList = []

      this.quickPanelOperationAll = []
      this.quickPanelAll = []
      this.quickPanelSelectList = []

      this.dataChartAll = []
      this.dataChartSelectList = []
    },
    init() {
      this.clear()
      queryCurrentEmployeeDashboardRecourseAll().then(res => {
        this.dataCardAll = res.data.filter(item => item.type === 'DATA_CARD')
        this.quickPanelOperationAll = res.data.filter(item => item.type === 'QUICK_OPERATION')
        this.dataChartAll = res.data.filter(item => item.type === 'STATISTIC_CHART_ONE')
        this.todoList = res.data.filter(item => item.type === 'TODO')
        // updateCurrentEmployeeDashboardResource({ dashboardResourceIdList: [12, 13, 14, 15], type: 'DATA_CARD' })
        // updateCurrentEmployeeDashboardResource({ dashboardResourceIdList: [3, 4, 5], type: 'QUICK_OPERATION' })
        // updateCurrentEmployeeDashboardResource({ dashboardResourceIdList: [7, 8, 9, 10], type: 'STATISTIC_CHART_ONE' })

        queryCurrentEmployeeDashboardResource({ type: '' }).then(res => {
          // 获取各类型选中的资源ID
          let dataCardSelectIdList = res.data.resourceConfig['DATA_CARD']
          // 默认没有key值, 默认设置为初始化所拥有的最大个数
          if (!dataCardSelectIdList) {
            if (this.dataCardAll.length >= 5) {
              dataCardSelectIdList = this.dataCardAll.slice(0, 5).map(i => i.dashboardResourceId)
            } else {
              dataCardSelectIdList = this.dataCardAll.map(i => i.dashboardResourceId)
            }
          }
          let quickPanelSelectList = res.data.resourceConfig['QUICK_OPERATION']
          if (!quickPanelSelectList) {
            if (this.quickPanelOperationAll.length >= 8) {
              quickPanelSelectList = this.quickPanelOperationAll.slice(0, 8).map(i => i.dashboardResourceId)
            } else {
              quickPanelSelectList = this.quickPanelOperationAll.map(i => i.dashboardResourceId)
            }
          }

          let dataChartSelectList = res.data.resourceConfig['STATISTIC_CHART_ONE']
          if (!dataChartSelectList) {
            // if (this.dataChartAll.length >= 5) {
            //   dataChartSelectList = this.dataChartAll.slice(0, 5).map(i => i.dashboardResourceId)
            // } else {
            //   dataChartSelectList = this.dataChartAll.map(i => i.dashboardResourceId)
            // }
            dataChartSelectList = this.dataChartAll.map(i => i.dashboardResourceId)
          }
          // 混入数据
          // 数据卡
          for (const dataElement of this.dataCardAll) {
            const findIndex = dataCardSelectIdList.includes(dataElement.dashboardResourceId)
            if (findIndex) {
              this.$set(dataElement, 'isActive', true)
              this.dataCardSelectList.push(dataElement)
            }
          }
          // 快捷操作
          for (const dataElement of this.quickPanelOperationAll) {
            const findIndex = quickPanelSelectList.includes(dataElement.dashboardResourceId)
            if (findIndex) {
              try {
                dataElement.config = JSON.parse(dataElement.config)
              } catch (e) {
                console.error('quickPanel配置解析出错', e)
              }
              this.$set(dataElement, 'isActive', true)
              this.quickPanelSelectList.push(dataElement)
            }
          }
          // 图表
          for (const dataElement of this.dataChartAll) {
            const findIndex = dataChartSelectList.includes(dataElement.dashboardResourceId)
            if (findIndex) {
              this.$set(dataElement, 'isActive', true)
              this.dataChartSelectList.push(dataElement)
            }
          }
          this.$forceUpdate()
        })
      })
    },
    updateSelfResource(type) {
      queryCurrentEmployeeDashboardResource({ type: type }).then(res => {
        if (type === 'DATA_CARD') { // 数据卡
          const dataCardSelectIdList = res.data.resourceConfig['DATA_CARD']
          this.dataCardSelectList = []
          for (const dataElement of this.dataCardAll) {
            const findIndex = dataCardSelectIdList.includes(dataElement.dashboardResourceId)
            if (findIndex) {
              this.$set(dataElement, 'isActive', true)
              this.dataCardSelectList.push(dataElement)
            }
          }
        } else if (type === 'QUICK_OPERATION') { // 快捷操作
          const quickPanelSelectList = res.data.resourceConfig['QUICK_OPERATION']
          this.quickPanelSelectList = []
          for (const dataElement of this.quickPanelOperationAll) {
            const findIndex = quickPanelSelectList.includes(dataElement.dashboardResourceId)
            if (findIndex) {
              try {
                dataElement.config = JSON.parse(dataElement.config)
              } catch (e) {
                console.error('quickPanel配置解析出错', e)
              }
              this.$set(dataElement, 'isActive', true)
              this.quickPanelSelectList.push(dataElement)
            }
          }
        }
      })
    },
    querySearchAsync(queryString, cb) {
      if (!this.solution.length) {
        try {
          this.solution = JSON.parse(localStorage.getItem('routeTable'))
          this.menus = this.solution.map(item => {
            return {
              value: item.displayName,
              pinyin: pinyin(item.displayName, {
                style: pinyin.STYLE_FIRST_LETTER, // 设置拼音风格
                heteronym: false
              }),
              path: '/' + item.uri
            }
          })
        } catch (e) {
          this.$message.error('请重新登录')
          setTimeout(() => {
            removeAllInfo()
          })
        }
      }

      const result = []
      this.menus.some(item => {
        if (item.value.includes(queryString) || item.pinyin.join('').includes(queryString)) {
          result.push(item)
        }
      })
      this.result = result
      cb(result)
    },
    handleSelect({ path }) {
      this.$router.push({ path })
      // setTimeout(() => {
      //   this.search.childName = ''
      // }, 500)
    },
    navigateTo(item) {
      window.open(item.linkUrl, '_blank')
    },
    handleAddCard() {
      this.addCardVisible = true
    },
    handleCardConfirm() {
      this.addCardVisible = false
      updateCurrentEmployeeDashboardResource({
        type: 'DATA_CARD',
        dashboardResourceIdList: this.dataCardAll
          .filter(i => i.isActive && i.dashboardResourceId)
          .map(i => i.dashboardResourceId)
      }).then(res => {
        this.$message.success('操作成功')
        this.updateSelfResource('DATA_CARD')
      })
    },
    toggleItemStatus(arr, item, len) {
      if (!item.isActive && arr.filter(i => i.isActive).length >= len) {
        return this.$message.warning(`最多选择${len}个`)
      }
      this.$set(item, 'isActive', !item.isActive)
      return item
    },
    handleAddQuick() {
      this.addQuickVisible = true
    },
    handleQuickConfirm() {
      this.addQuickVisible = false
      updateCurrentEmployeeDashboardResource({
        type: 'QUICK_OPERATION',
        dashboardResourceIdList: this.quickPanelOperationAll
          .filter(i => i.isActive)
          .map(i => i.dashboardResourceId)
      }).then(res => {
        this.$message.success('操作成功')
        this.updateSelfResource('QUICK_OPERATION')
      })
    },
    closeCard(item) {
      item.isActive = false
      updateCurrentEmployeeDashboardResource({
        type: 'DATA_CARD',
        dashboardResourceIdList: this.dataCardSelectList.filter(i => i.isActive).map(i => i.dashboardResourceId)
      }).then(res => {
        this.$message.success('操作成功')
        this.updateSelfResource('DATA_CARD')
      })
    },
    openUrl(item) {
      if (item.linkUrl) {
        window.open(item.linkUrl)
      }
    },
    toMoreHeadline() {
      this.$router.push({
        path: '/dashboardMore/headline'
      })
    },
    toMoreProduct() {
      this.$router.push({
        path: '/dashboardMore/product'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.index-wrap {
  padding-top: 16px;

  .ad-panel {
    height: 270px;
    //background: url("../../../assets/dashboard/banner.png") no-repeat center center/cover;
    position: relative;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
    ::v-deep .el-carousel--horizontal{
      border-radius: 4px;
    }
    ::v-deep .el-carousel__arrow{
      z-index: 5;
    }
    .headBgc{
      ::v-deep{
        .el-carousel__indicators {
          .el-carousel__button {
            width: 8px;
            height: 8px;
            -webkit-border-radius: 50%;
            -moz-border-radius: 50%;
            border-radius: 50%;
          }
        }
      }
    }
    .bgcImg{
      width: 100%;
      height: 100%;
      border-radius:4px;
    }
    .banner {
      overflow: hidden;

      ::v-deep {
        .el-carousel__container {
          height: 270px;
        }

        .el-carousel__indicators {
          .el-carousel__button {
            width: 8px;
            height: 8px;
            -webkit-border-radius: 50%;
            -moz-border-radius: 50%;
            border-radius: 50%;
          }
        }
      }
    }

    .search {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 624px;
      z-index: 9;

      img {
        width: 100%;
      }

      .marquee-box {
        display: flex;
        align-items: center;
        flex-wrap: nowrap;
        color: $white;

        span {
          flex: 1;
          white-space: nowrap;
          margin-right: 8px;
        }
      }

      .search-input {
        display: flex;
        align-items: center;
        height: 40px;
        background-color: $white;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        overflow: hidden;
        margin-top: 4px;
        ::v-deep {
          .input-with-select {
            width: 100%;
          }

          .el-select {
            &::after {
              position: absolute;
              left: auto;
              top: 8px;
              right: 0;
              bottom: auto;
              height: 24px;
              content: "";
              border-right: 1px solid #e5e5e5;
            }
          }

          .el-input__inner {
            border: none;
            border-radius: 0;

            &:focus {
              border: none;
            }
          }
        }
      }
    }
  }

  .quick-panel {
    display: flex;
    align-items: center;
    height: 100px;
    border-radius: 4px;
    background-color: #fff;

    .quick-item {
      width: 11%;
      text-align: center;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        @include etm-color();
      }
    }
  }

  .data-panel-content {
    display: flex;
    margin-top: 16px;

    .data-left-panel {
      padding-right: 16px;
      flex: 1;
    }

    .data-right-panel {
      flex: none;
      width: 400px;

      .ad1-panel {
        background-color: $white;
        position: relative;
        z-index: 1;
        overflow: hidden;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        ::v-deep .el-carousel__button {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }
      }
    }
  }

  .data-panel {
    .data-card {
      display: flex;
      align-items: center;

      & > * {
        width: 20%;
        height: 144px;
      }

      .add-card {
        color: $white;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        font-size: 16px;
        cursor: pointer;
        @include etm-bgc();
      }

    }
  }

  .notify-panel {
    & > * {
      margin-bottom: 16px;
    }

    .todo-panel {
      border-radius: 4px;
      padding: 16px;
      background-color: $white;

      & > .content-box {
        height: 295px;
        overflow: scroll;
      }
    }

    .headlines-panel, .product-panel {
      border-radius: 4px;
      padding: 16px;
      background-color: $white;

      .moreText {
        white-space: nowrap;
        cursor: pointer;

        &:hover {
          @include etm-color();
        }
      }

      & > .content-box {
        height: 228px;
        overflow: hidden;
      }

    }

    .headlines-panel {
      .headline-item {
        display: flex;
        align-items: flex-start;
        font-size: 14px;
        margin-bottom: 16px;
        cursor: pointer;

        img {
          width: 60px;
          height: 60px;
          -webkit-border-radius: 4px;
          -moz-border-radius: 4px;
          border-radius: 4px;
        }

        .item-content {
          padding-left: 16px;
          flex: 1;

          .item-title {
            color: $text-color;

          }

          .item-date {
            color: $secondary-color;

          }
        }
      }
    }

  }

  .chart-panel {
    margin-top: 16px;

    .chart-item {
      margin-bottom: 16px;
      padding: 16px;
      background-color: $white;
      -webkit-border-radius: 4px;
      -moz-border-radius: 4px;
      border-radius: 4px;
    }
  }

  .card-tip {
    margin-bottom: 16px;
  }

  .behover:hover {
    cursor: pointer;
  }
}
</style>
