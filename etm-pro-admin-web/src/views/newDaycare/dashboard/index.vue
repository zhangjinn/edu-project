<template>
  <div class="dashboard-wrap">
    <etm-main-body>
      <!--通知-->
      <div class="header">
        <el-row :gutter="16">
          <el-col :span="6">
            <div class="colBox allowance" @click="toGuide('allowanceGuide')">
              国家卫生健康委关于做好托育机构相关工作的通知及解读
              <div class="bgImg">
                <img src="../../../assets/images/guardcare/dashboard_rippleBg.png">
              </div>
              <div class="iconImg">
                <img src="../../../assets/images/guardcare/dashboard_allowanceBG.png">
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="colBox getCustomer" @click="toGuide('skillGuide')">
              托育中心如何设计一日流程？
              <div class="bgImg">
                <img src="../../../assets/images/guardcare/dashboard_rippleBg.png">
              </div>
              <div class="iconImg">
                <img src="../../../assets/images/guardcare/dashboard_getCustomerBG.png">
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="colBox recipe" @click="toGuide('recipeGuide')">
              两类托育服务可享中央每人1万元补助，该如何申请？
              <div class="bgImg">
                <img src="../../../assets/images/guardcare/dashboard_rippleBg.png">
              </div>
              <div class="iconImg">
                <img src="../../../assets/images/guardcare/dashboard_recipeBG.png">
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="colBox policy" @click="toGuide('policyGuide')">
              托育中心如何设计，托育中心的设计原则
              <div class="bgImg">
                <img src="../../../assets/images/guardcare/dashboard_rippleBg.png">
              </div>
              <div class="iconImg">
                <img src="../../../assets/images/guardcare/dashboard_policyBG.png">
              </div>
            </div>
          </el-col>
        </el-row>
      </div>

      <!--数据卡片-->
      <div class="statistics">
        <el-row :gutter="16">
          <template>
            <etm-card v-for="card of originData.dataCard" :key="card.code" :card-data="card" @close="handleCardClose" />
            <el-col
              v-if="originData.dataCard.length < dataCardMaxCount"
              :xs="{span: '4-8'}"
              :sm="{span: '4-8'}"
              :md="{span: '4-8'}"
              :lg="{span: '4-8'}"
            >
              <div class="itemBox">
                <div class="btn-add" @click="addModule">
                  <div><i class="el-icon-plus" /></div>
                  <div>添加模块</div>
                </div>
              </div>
            </el-col>
          </template>

        </el-row>
      </div>

      <!--快捷入口-->
      <div class="dashboardCenter">
        <el-row :gutter="16">
          <el-col :xs="{span: '19-2'}" :sm="{span: '19-2'}" :md="{span: '19-2'}" :lg="{span: '19-2'}">
            <div v-has="{authId: 'basic.department.create'}" class="initSetting centerBox">
              <div class="top noPadding">
                <span class="title">4步快速完成初始化设置</span>
                <span v-if="collapseActive === '1'" class="operate" @click="pickUp">收起</span>
                <span v-else class="operate" @click="slide">展开</span>
              </div>
              <div class="initContent">
                <el-collapse v-model="collapseActive">
                  <el-collapse-item name="1">
                    <div class="content">
                      <div class="stepsBox">
                        <div class="steps">
                          <div class="stepsCount">1</div>
                          <div class="stepsText">
                            <div>添加部门</div>
                            <div>2分钟</div>
                          </div>
                        </div>
                        <div class="line" />
                        <div class="steps">
                          <div class="stepsCount">2</div>
                          <div class="stepsText">
                            <div>添加岗位</div>
                            <div>2分钟</div>
                          </div>
                        </div>
                        <div class="line" />
                        <div class="steps">
                          <div class="stepsCount">3</div>
                          <div class="stepsText">
                            <div>设置权限</div>
                            <div>5分钟</div>
                          </div>
                        </div>
                        <div class="line" />
                        <div class="steps">
                          <div class="stepsCount">4</div>
                          <div class="stepsText">
                            <div>添加员工</div>
                            <div>2分钟</div>
                          </div>
                        </div>
                      </div>
                      <div class="toSetting">
                        <div @click="toOrg">
                          <span>前往设置</span>
                          <span class="iconfont iconarrow-left" />
                        </div>
                      </div>
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </div>
            </div>
            <div class="quickEntry centerBox">
              <div class="top">
                <span class="title">快捷入口</span>
                <span class="operate" @click="edit('quick')">设置</span>
              </div>
              <div class="quickContent">
                <etm-quick-panel
                  v-for="item of originData.dataQuick"
                  :key="item.detailUrl"
                  :data="item"
                  @click="toRouter"
                />
              </div>
            </div>
          </el-col>
          <el-col :xs="{span: '4-8'}" :sm="{span: '4-8'}" :md="{span: '4-8'}" :lg="{span: '4-8'}">
            <div class="remarkBox centerBox" :class="collapseActive === '1' ? '' : 'smallRemarkBox'">
              <div class="top">
                <span class="title">待办提醒</span>
              </div>
              <div class="remarkList">
                <div v-for="(list, index) in todoList" :key="index">
                  <etm-todo v-bind="{...list}" />
                </div>
                <etm-empty v-if="todoList.length===0" />
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="chart">
        <el-row :gutter="16">
          <el-col :xs="{span: '19-2'}" :sm="{span: '19-2'}" :md="{span: '19-2'}" :lg="{span: '19-2'}">
            <div class="chartBox">
              <etm-tabs v-model="chartTabs" :setting="false" :show-toggle="false">
                <el-tab-pane
                  v-for="(item, index) in originData.dataChart"
                  :key="index"
                  :label="item.name"
                  :name="item.name"
                >
                  <bar-chart v-if="item.name === chartTabs" :date-type="dateType" :date="dateValue" :chart-data="item" />
                </el-tab-pane>
                <div slot="tool" class="tabsSearch">
                  <el-select v-model="dateType">
                    <el-option label="按年" value="year" />
                    <el-option label="按月" value="month" />
                  </el-select>
                  <template v-if="dateType === 'year'">
                    <el-date-picker v-model="dateValue" type="year" value-format="yyyy-MM-dd" :clearable="false" />
                  </template>
                  <template v-else-if="dateType === 'month'">
                    <el-date-picker v-model="dateValue" type="month" value-format="yyyy-MM-dd" :clearable="false" />
                  </template>
                  <span class="edit" @click="editChart">设置</span>
                </div>
              </etm-tabs>
            </div>
          </el-col>
          <el-col :xs="{span: '4-8'}" :sm="{span: '4-8'}" :md="{span: '4-8'}" :lg="{span: '4-8'}">
            <div class="a_d-Box">
              <div class="a_d-Img" @click="toEvalution">
                <img src="../../../assets/images/guardcare/evalutionAd.png">
              </div>
            </div>
            <div class="productBox">
              <div class="top">
                <div class="title">产品动态</div>
              </div>
              <div class="productList">
                <div v-for="(list, index) in productList" :key="index">
                  <etm-todo v-bind="{...list}" @click="$router.push({name: 'newdaycare_productDetail', query: {...list}})" />
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </etm-main-body>

    <!--添加模块-->
    <etm-pop
      v-if="addModuleVisible"
      :visible="addModuleVisible"
      title="设置数据卡片"
      pop="big"
      confirm-btn="确定"
      cancel-btn="取消"
      :append-body="false"
      class="dashboard-dialog"
      @close="addModuleVisible = false"
      @confirm="handleAddModule"
      @cancel="addModuleVisible = false"
    >
      <etm-title title="请选择数据类型" border />
      <div>
        <etm-field-label label="已选"><span style="color: red">{{ selectedLength(allDataCard, 'isChecked') }}</span> /
          {{ dataCardMaxCount }}
        </etm-field-label>
      </div>
      <div class="checkbox-group">
        <template v-for="item in allDataCard">
          <el-button v-if="item.isChecked" :key="item.code" type="primary" @click="handleBtnClick(item)">{{
            item.code
          }}
          </el-button>
          <el-button v-else :key="item.code" plain @click="handleBtnClick(item)">{{
            item.code
          }}
          </el-button>
        </template>
      </div>
    </etm-pop>

    <!--添加快捷操作-->
    <etm-pop
      :visible="addQuickVisible"
      title="设置快捷操作"
      pop="big"
      confirm-btn="确定"
      cancel-btn="取消"
      :append-body="false"
      class="dashboard-dialog"
      @close="addQuickVisible = false"
      @confirm="handleAddQuick"
      @cancel="addQuickVisible = false"
    >
      <etm-title title="请选择快捷操作" border />
      <div>
        <etm-field-label label="已选"><span style="color: red">{{ selectedLength(allQuickData, 'isChecked') }}</span> /
          {{ dataQuickMaxCount }}
        </etm-field-label>
      </div>
      <div class="checkbox-group">
        <template v-for="item in allQuickData.filter(item => item.isChecked)">
          <el-tag
            :key="item.name"
            style="margin-right: 8px;margin-bottom: 8px;"
            size="normal"
            closable
            type="primary"
            @close="handleCloseQuick(item)"
          >
            {{ item.name }}
          </el-tag>
        </template>
      </div>

      <etm-title title="快捷操作" border />
      <template v-for="item in allQuickData">
        <template v-if="item.isChecked">
          <el-button
            :key="item.code"
            style="margin-bottom: 8px;margin-left: 8px;"
            type="primary"
            @click="handleQuickBtnClick(item)"
          >
            {{ item.name }}
          </el-button>
        </template>
        <template v-else>
          <el-button
            :key="item.code"
            style="margin-bottom: 8px;margin-left: 8px;"
            plain
            @click="handleQuickBtnClick(item)"
          >
            {{ item.name }}
          </el-button>
        </template>
      </template>

    </etm-pop>

    <!--添加图表-->
    <etm-pop
      v-if="addChartVisible"
      :visible="addChartVisible"
      title="设置统计图表"
      pop="big"
      confirm-btn="确定"
      cancel-btn="取消"
      :append-body="false"
      class="dashboard-dialog"
      @close="addChartVisible = false"
      @confirm="handleAddChart"
      @cancel="addChartVisible = false"
    >
      <etm-title title="最多可选4个统计图表" border />
      <div>
        <etm-field-label label="已选"><span style="color: red">{{ selectedLength(allStatisticChart, 'isChecked') }}</span>
          / {{ chartMaxCount }}
        </etm-field-label>
      </div>
      <div class="checkbox-group">
        <template v-for="item in allStatisticChart">
          <el-button :key="item.code" :type="item.isChecked ? 'primary': ''" @click="handleChartBtnClick(item)">
            {{ item.name }}
          </el-button>
        </template>
      </div>
    </etm-pop>

  </div>

</template>

<script>
import EtmCard from '@/views/newDaycare/dashboard/components/EtmCard'
import { queryAllSetting, queryMySetting, updateMySetting } from '@/api/newDaycare/dashboard'
import EtmQuickPanel from '@/views/newDaycare/dashboard/components/EtmQuickPanel'
import BarChart from '@/views/newDaycare/dashboard/components/barChart'
import { parseTime } from '@/utils'
import EtmTodo from '@/views/newDaycare/dashboard/components/EtmTodo'
import { queryProductDynamicList } from '@/api/base/base'

/**
 * index create by Administrator
 * createTime 2020/9/15 16:43
 */
export default {
  name: 'Index',
  components: {
    EtmTodo,
    BarChart,
    EtmQuickPanel,
    EtmCard
  },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      dataCardMaxCount: 5,
      dataQuickMaxCount: 8,
      chartMaxCount: 4,
      mainData: {
        income: 1002.12,
        lastIncome: 30902,
        outcome: 20909,
        lastOutcome: 19870,
        cash: 36000,
        lastCash: 11032,
        attendance: 650,
        lastAttendance: 589,
        absence: 20,
        lastAbsence: 18,
        leave: 30,
        lastLeave: 10,
        normal: 560,
        lastNormal: 580,
        abnormal: 104,
        lastAbnormal: 107
      },
      collapseActive: '1',
      todoList: [],
      chartTabs: '',
      dateType: 'year',
      dateValue: parseTime(new Date(), '{y}-{m}-{d}'),
      productList: [],
      showPop: false,
      popTitle: '',
      allSettings: [],
      allDataCard: [],
      dataCard: [],
      checkboxGroupDataCard: [],
      allQuickOperation: [],
      allQuickData: [],
      allStatisticChart: [],
      originData: {
        dataCard: [],
        dataQuick: [],
        dataChart: []
      },
      addModuleVisible: false,
      addQuickVisible: false,
      addChartVisible: false
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
    selectedLength(arr, flag) {
      return arr.filter(item => !!item[flag]).length
    },
    init() {
      queryMySetting().then(res => {
        const { dataCard = [], dataQuick = [], dataChart = [] } = (res.data.config && JSON.parse(res.data.config)) || this.$options.data().originData
        this.originData = {
          dataCard,
          dataQuick,
          dataChart
        }
        queryAllSetting().then(res => {
          this.allSettings = res.data

          // 数据卡
          const DATA_CARD = this.allSettings.find(item => item.partType === 'DATA_CARD').partList
          // this.allDataCard = DATA_CARD.filter(item => {
          //   return !this.originData.dataCard.find(card => card.code === item.code)
          // })

          this.allDataCard = DATA_CARD.map(item => {
            const find = this.originData.dataCard.find(card => card.code === item.code)
            if (find) {
              this.$set(item, 'isChecked', true)
            } else {
              this.$set(item, 'isChecked', false)
            }
            return item
          })
          // this.allDataCard = this.allDataCard.map(item => {
          //   this.$set(item, 'isChecked', false)
          //   return item
          // })

          // 快速操作面板
          const QUICK_OPERATION = this.allSettings.find(item => item.partType === 'QUICK_OPERATION').partList
          // this.allQuickOperation = QUICK_OPERATION.filter(item => {
          //   return !this.originData.dataCard.find(card => card.code === item.code)
          // })

          this.allQuickData = QUICK_OPERATION.map(item => {
            const find = this.originData.dataQuick.find(card => card.name === item.name)
            if (find) {
              this.$set(item, 'isChecked', true)
            } else {
              this.$set(item, 'isChecked', false)
            }
            return item
          })

          // 统计图
          const STATISTIC_CHART = this.allSettings.find(item => item.partType === 'STATISTIC_CHART').partList

          this.allStatisticChart = STATISTIC_CHART.map(item => {
            const find = this.originData.dataChart.find(card => card.name === item.name)
            if (find) {
              this.$set(item, 'isChecked', true)
            } else {
              this.$set(item, 'isChecked', false)
            }
            return item
          })
          const findChartTab = this.allStatisticChart.find(item => item.isChecked) || this.allStatisticChart[0]
          this.chartTabs = findChartTab && findChartTab.name || ''
          this.$forceUpdate()
        })
      })

      // queryTodoList().then(res => {
      //   this.todoList = res.data
      // })
      queryProductDynamicList().then(res => {
        this.productList = res.data
        this.productList.forEach(item => {
          item.date = parseTime(item.createTime, '{m}-{d}')
        })
      })
    },

    getMarkClazz(type) {
      switch (type) {
        case 'audit':
          return 'error'
        case 'confirm':
          return 'success'
        case 'warn':
          return 'warn'
        default:
          return type
      }
    },
    getMarkText(type) {
      switch (type) {
        case 'audit':
          return '审批'
        case 'confirm':
          return '确认'
        case 'warn':
          return '欠费'
        default:
          return type
      }
    },
    formatNumber(number) {
      if (number < 1000) {
        return number
      } else {
        const num = number.toString()
        let decimals = ''
        // 判断是否有小数
        num.indexOf('.') > -1 ? decimals = num.split('.')[1] : decimals
        const len = num.length
        let temp = ''
        const remainder = len % 3
        decimals ? temp = '.' + decimals : temp
        if (remainder > 0) { // 不是3的整数倍
          return num.slice(0, remainder) + ',' + num.slice(remainder, len).match(/\d{3}/g).join(',') + temp
        } else { // 是3的整数倍
          return num.slice(0, len).match(/\d{3}/g).join(',') + temp
        }
      }
    },
    getClazz(value) {

    },
    pickUp() {
      this.collapseActive = ''
    },
    slide() {
      this.collapseActive = '1'
    },
    toOrg() {
      this.$router.push({
        // path: '/newOrg/newOrg'
        name: 'org'
      })
    },
    toPath(path) {
      this.$router.push({
        path: path
      })
    },
    edit(type) {
      if (type === 'quick') {
        this.popTitle = '快捷操作设置'
        this.addQuickVisible = true
      } else if (type === 'chart') {
        this.popTitle = '统计图表设置'
      }
    },
    popClose() {
      this.showPop = false
    },
    popConfirm() {
      this.showPop = false
    },
    addModule() {
      this.addModuleVisible = true
    },
    // 数据卡操作
    handleAddModule() {
      this.addModuleVisible = false
      this.updateSetting()
    },
    // 快捷操作
    handleAddQuick() {
      this.addQuickVisible = false
      this.updateSetting()
    },
    handleCardClose(data) {
      console.log('data: ', data)
      this.allDataCard.find(item => item.code === data.code).isChecked = false
      this.updateSetting()
    },
    // 切换数据卡
    handleBtnClick(item) {
      this.$set(item, 'isChecked', !item.isChecked)
      let count = 0
      this.allDataCard.forEach(item => {
        if (item.isChecked) {
          ++count
        }
      })
      if (count > this.dataCardMaxCount) {
        this.$message.warning('数据类型最多选择5个')
        this.$set(item, 'isChecked', false)
      }
    },
    handleQuickBtnClick(item) {
      this.$set(item, 'isChecked', !item.isChecked)
      let count = 0
      this.allQuickData.forEach(item => {
        if (item.isChecked) {
          ++count
        }
      })
      if (count > this.dataQuickMaxCount) {
        this.$message.warning('最多可选择8个')
        this.$set(item, 'isChecked', false)
      }
    },
    handleCloseQuick(item) {
      console.log('item: ', item)
      this.$set(item, 'isChecked', false)
    },
    toRouter(item) {
      console.log('item: ', item)
      this.$router.push({ path: item.detailUrl })
    },
    editChart() {
      this.addChartVisible = true
    },
    handleChartBtnClick(item) {
      this.$set(item, 'isChecked', !item.isChecked)
      let count = 0
      this.allStatisticChart.forEach(item => {
        if (item.isChecked) {
          ++count
        }
      })
      if (count > this.chartMaxCount) {
        this.$set(item, 'isChecked', false)
      }
    },
    handleAddChart() {
      this.addChartVisible = false
      this.updateSetting()
    },
    // 更新数据
    updateSetting() {
      const dataCard = this.allDataCard.filter(item => item.isChecked)
      const dataQuick = this.allQuickData.filter(item => item.isChecked)
      const dataChart = this.allStatisticChart.filter(item => item.isChecked)
      const config = {
        dataCard,
        dataQuick,
        dataChart
      }
      updateMySetting({ config: JSON.stringify(config) }).then(res => {
        this.init()
        this.$forceUpdate()
      })
    },
    toGuide(routerName) {
      this.$router.push({ name: routerName })
    },
    toEvalution() {
      window.open('https://mp.weixin.qq.com/s/Thd37oUCZyV6r937a35YpQ')
    }
  }
}
</script>
<style lang="scss" scoped>
.dashboard-wrap {
  min-width: 1200px;
  @include c_text_color();

  .header {
    padding-bottom: 16px;

    .colBox {
      position: relative;
      padding: 0 20px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      flex-direction: column;
      font-size: 16px;
      @include c_white();
      border-radius: 4px;
      cursor: pointer;

      .bgImg {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;

        img {
          display: block;
          width: 100%;
        }
      }

      .iconImg {
        position: absolute;
        right: 30px;
        bottom: 0;
        width: 48px;

        img {
          display: block;
          width: 100%;
        }
      }

      &.allowance {
        background: linear-gradient(to right, #81BFFF, #55A8FD);
      }

      &.getCustomer {
        background: linear-gradient(to right, #FFCF74, #FFBC3C);
      }

      &.recipe {
        background: linear-gradient(to right, #77E99C, #4DD87A);
      }

      &.policy {
        background: linear-gradient(to right, #B0A4EF, #8F7EE5);
      }
    }
  }

  .el-col-xs-19-2, .el-col-sm-19-2, .el-col-md-19-2, .el-col-lg-19-2 {
    width: 80%;
  }

  .el-col-xs-4-8, .el-col-sm-4-8, .el-col-md-4-8, .el-col-lg-4-8 {
    width: 20%;
  }

  .statistics {
    padding-bottom: 16px;

    .itemBox {
      position: relative;
      padding: 16px;
      width: 100%;
      @include bgc_white();
      border-radius: 4px;
      height: 146px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      cursor: pointer;
      color: $secondary-color;

      .btn-add:hover {
        @include etm-color();

        ::v-deep {
          .el-icon-plus {
            @include etm-color();
          }
        }
      }

      ::v-deep {
        .el-icon-plus {
          font-size: 40px;
        }
      }

    }
  }

  .dashboardCenter {
    position: relative;
    padding-bottom: 16px;

    .centerBox {
      padding: 16px;
      @include bgc_white();
      border-radius: 4px;

      .top {
        display: flex;
        justify-content: space-between;
        padding-bottom: 16px;

        &.noPadding {
          padding-bottom: 0;
        }

        .title {
          @include c_title_color();
        }

        .operate {
          @include c_secondary_color();
          cursor: pointer;
        }
      }
    }

    .initSetting {
      display: block !important;
      margin-bottom: 16px;

      .initContent {
        ::v-deep .el-collapse {
          border: none;

          .el-collapse-item__header {
            display: none;
          }

          .el-collapse-item__wrap {
            border: none;

            .el-collapse-item__content {
              padding: 0;
            }
          }
        }

        .content {
          display: flex;
          justify-content: space-between;
          padding-top: 16px;
          margin: 8px 0;

          .stepsBox {
            display: flex;
            justify-content: space-between;
            padding-right: 16px;
            width: 100%;

            .steps {
              display: flex;
              align-items: center;
              width: 90px;
              flex: 0 0 auto;

              .stepsCount {
                width: 26px;
                height: 26px;
                text-align: center;
                line-height: 24px;
                @include c_secondary_color();
                @include bgc_hover_color();
                border: 1px solid $divide-color;
                border-radius: 50%;
              }

              .stepsText {
                margin-left: 8px;

                div {
                  &:first-child {
                    height: 12px;
                    line-height: 12px;
                    font-size: 14px;
                    @include c_text_color();
                  }

                  &:last-child {
                    margin-top: 7px;
                    height: 11px;
                    line-height: 11px;
                    font-size: 12px;
                    @include c_secondary_color();
                  }
                }
              }
            }

            .line {
              position: relative;
              width: 100%;

              &::before {
                display: inline-block;
                position: absolute;
                left: 8px;
                top: 15px;
                content: '';
                width: calc(100% - 16px);
                border-bottom: 1px dashed $divide-color;
              }
            }
          }

          .toSetting {
            padding-left: 16px;
            width: 100px;
            flex: 0 0 auto;
            border-left: 1px solid $divide-color;

            div {
              display: flex;
              @include c_main_color();
              cursor: pointer;

              span {
                line-height: 28px;

                &.iconfont {
                  font-weight: bold;
                }
              }
            }
          }
        }
      }
    }

    .quickEntry {
      .top {
        border-bottom: 1px solid $divide-color;
      }

      .quickContent {
        display: flex;
        padding-top: 20px;
        min-height: 84px;

        .menu {
          padding: 0 10px;
          cursor: pointer;

          &:not(:first-child) {
            margin-left: 20px;
          }

          &:hover {
            .iconBox {
              // border: 1px solid transparent;
              // @include bgc_main_12_color();
            }

            .menuText {
              @include c_main_color();
            }

          }

          .iconBox {
            margin: 0 auto;
            width: 40px;
            height: 40px;
            text-align: center;
            line-height: 38px;
            // border: 1px solid $divide-color;
            // border-radius: 50%;
            .iconfont {
              @include c_main_color();
              font-size: 22px;
            }
          }

          .menuText {
            margin-top: 10px;
            height: 14px;
            line-height: 14px;
          }
        }
      }
    }

    .remarkBox {
      height: 284px;
      transition: height .5s;

      &.smallRemarkBox {
        height: 222px;

        .remarkList {
          max-height: 152px;
          overflow: auto;
        }
      }

      .top {
        border-bottom: 1px solid $divide-color;
      }

      .remarkList {
        padding: 16px 0 8px;
        max-height: 214px;
        overflow: auto;

        .remark {
          display: flex;
          align-items: center;

          &:not(:last-child) {
            padding-bottom: 16px;
          }

          .markTag {
            width: 32px;
            height: 18px;
            line-height: 18px;
            font-size: 12px;
            text-align: center;
            border-radius: 2px;

            &.success {
              color: #569EFF;
              background-color: rgba(86, 158, 255, .12);
            }

            &.warn {
              color: #FFAC4D;
              background-color: rgba(255, 172, 77, .12);
            }

            &.error {
              color: #F5222D;
              background-color: rgba(245, 45, 45, .12);
            }
          }

          .markText {
            margin-left: 8px;
            height: 14px;
            line-height: 14px;
          }
        }
      }
    }
  }

  .chart {
    .chartBox {
      padding: 16px;
      height: 346px;
      @include bgc_white();
      border-radius: 4px;

      .tabsSearch {
        display: flex;
        align-items: center;

        ::v-deep .el-select {
          margin-left: 12px;
          width: 100px;

          .el-input {
            width: 100%;
          }
        }

        ::v-deep .el-date-editor {
          margin-left: 12px;
          width: 120px;
        }

        .edit {
          margin-left: 16px;
          @include c_secondary_color();
          cursor: pointer;
        }
      }
    }

    .a_d-Box {
      padding-bottom: 16px;

      .a_d-Img {
        width: 100%;
        height: 120px;
        border-radius: 4px;
        overflow: hidden;
        cursor: pointer;
        text-align: center;
        background: linear-gradient(120deg, #f883a8, #f8759e);

        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }
    }

    .productBox {
      padding: 16px;
      height: 210px;
      @include bgc_white();
      border-radius: 4px;

      .top {
        padding-bottom: 16px;
        border-bottom: 1px solid #EEE;

        .title {
          @include c_title_color();
        }
      }

      .productList {
        padding: 16px 0 8px;
        max-height: 140px;
        overflow-y: auto;

        .product {
          display: flex;
          justify-content: space-between;
          line-height: 12px;

          &:not(:last-child) {
            padding-bottom: 16px;
          }

          .productDate {
            @include c_secondary_color();
          }
        }
      }
    }
  }
}
</style>

<style lang="scss">
.dashboard-dialog {
  .checkbox-group {
    padding-bottom: 16px;

    .el-button {
      margin: 0 8px 8px 0;
    }
  }

  .el-button.is-plain {
    &:focus {
      border-color: #dcdfe6;
      color: #555;
    }

    &:hover {
      @include etm-color();
      @include etm-bdc();
    }
  }
}

</style>
