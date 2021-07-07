<template>
  <div class="dashboard-wrap">
    <etm-main-body>
      <div class="header">
        <el-row :gutter="16">
          <el-col :span="6">
            <div class="colBox allowance" @click="toAllowance">
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
            <div class="colBox skill" @click="toSkill">
              托育中心如何设计一日流程？
              <div class="bgImg">
                <img src="../../../assets/images/guardcare/dashboard_rippleBg.png">
              </div>
              <div class="iconImg">
                <img src="../../../assets/images/guardcare/dashboard_skillBG.png">
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="colBox recipe" @click="toRecipe">
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
            <div class="colBox policy" @click="toPolicy">
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
      <div class="statistics">
        <el-row :gutter="16">
          <el-col :xs="{span: '4-8'}" :sm="{span: '4-8'}" :md="{span: '4-8'}" :lg="{span: '4-8'}">
            <div class="itemBox" @click="toPath('guardcare_incomeFlow')">
              <div class="itemTitle">本月收入金额</div>
              <div class="itemAmount income">
                <span class="unit">￥</span>
                <span class="number">{{ formatNumber(currentData.incomeAmount) }}</span>
              </div>
              <div class="itemLastAmount">
                <span>上月收入金额</span>
                <span>¥{{ formatNumber(lastData.incomeAmount) }}</span>
              </div>
              <!--              <div class="bgImg">-->
              <!--                <img src="../../../assets/images/guardcare/dashboard_income.png">-->
              <!--              </div>-->
            </div>
          </el-col>
          <el-col :xs="{span: '4-8'}" :sm="{span: '4-8'}" :md="{span: '4-8'}" :lg="{span: '4-8'}">
            <div class="itemBox" @click="toPath('guardcare_costFlow')">
              <div class="itemTitle">本月支出金额</div>
              <div class="itemAmount outcome">
                <span class="unit">￥</span>
                <span class="number">{{ formatNumber(currentData.outcomeAmount) }}</span>
              </div>
              <div class="itemLastAmount">
                <span>上月支出金额</span>
                <span>¥{{ formatNumber(lastData.outcomeAmount) }}</span>
              </div>
              <!--              <div class="bgImg">-->
              <!--                <img src="../../../assets/images/guardcare/dashboard_outcome.png">-->
              <!--              </div>-->
            </div>
          </el-col>
          <el-col :xs="{span: '4-8'}" :sm="{span: '4-8'}" :md="{span: '4-8'}" :lg="{span: '4-8'}">
            <div class="itemBox" @click="toPath('guardcare_cashFlow')">
              <div class="itemTitle">本月净现金流</div>
              <div class="itemAmount outcome">
                <span class="unit">￥</span>
                <span class="number">{{ formatNumber(currentData.cashFlow) }}</span>
              </div>
              <div class="itemLastAmount">
                <span>上月净现金流</span>
                <span>¥{{ formatNumber(lastData.cashFlow) }}</span>
              </div>
              <!--              <div class="bgImg">-->
              <!--                <img src="../../../assets/images/guardcare/dashboard_newAdd.png">-->
              <!--              </div>-->
            </div>
          </el-col>
          <el-col :xs="{span: '4-8'}" :sm="{span: '4-8'}" :md="{span: '4-8'}" :lg="{span: '4-8'}">
            <div class="itemBox" @click="toPath('guardcare_attendanceStatistics')">
              <div class="itemTitle">本月幼儿出勤</div>
              <div class="itemAmount">
                <span class="number attendance">{{ currentData.arrivedNumber || 0 }}</span>
                <span class="number">/{{ currentData.notArrivedNumber || 0 }}/{{
                  currentData.requestForLeaveNumber || 0
                }}</span>
              </div>
              <div class="itemLastAmount">
                <span>上月出勤/缺勤/请假</span>
                <span>{{ lastData.arrivedNumber || 0 }}/{{ lastData.notArrivedNumber || 0 }}/{{
                  lastData.requestForLeaveNumber || 0
                }}</span>
              </div>
              <!--              <div class="bgImg">-->
              <!--                <img src="../../../assets/images/guardcare/dashboard_attendance.png">-->
              <!--              </div>-->
            </div>
          </el-col>
          <el-col :xs="{span: '4-8'}" :sm="{span: '4-8'}" :md="{span: '4-8'}" :lg="{span: '4-8'}">
            <div class="itemBox" @click="toPath('guardcare_bodyCheck')">
              <div class="itemTitle">本月健康检查</div>
              <div class="itemAmount check">
                <span class="number">{{ currentData.checkCount || 0 }}/{{ currentData.abnormalCount || 0 }}</span>
              </div>
              <div class="itemLastAmount">
                <span>上月正常/异常</span>
                <span>{{ lastData.checkCount || 0 }}/{{ lastData.abnormalCount || 0 }}</span>
              </div>
              <!--              <div class="bgImg">-->
              <!--                <img src="../../../assets/images/guardcare/dashboard_check.png">-->
              <!--              </div>-->
            </div>
          </el-col>
        </el-row>
      </div>
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
                <span class="operate" @click="editSetting('quick')">设置</span>
              </div>
              <div v-if="showData.dataQuick.length" class="quickContent">
                <div
                  v-for="(menu, index) in showData.dataQuick"
                  :key="index"
                  class="menu"
                  @click="toPath(menu.detailUrl, menu.config.type)"
                >
                  <div class="iconBox">
                    <svg class="icon" aria-hidden="true">
                      <use :xlink:href="`#${menu.config.icon}`" />
                    </svg>
                  </div>
                  <div class="menuText">{{ menu.name }}</div>
                </div>
              </div>
              <div v-if="!showData.dataQuick.length" class="noQuickEntry">
                <span class="operate" @click="editSetting('quick')">
                  <i class="iconfont iconplus" />
                  添加入口
                </span>
              </div>
            </div>
          </el-col>
          <el-col :xs="{span: '4-8'}" :sm="{span: '4-8'}" :md="{span: '4-8'}" :lg="{span: '4-8'}">
            <div class="remarkBox centerBox" :class="collapseActive === '1' ? '' : 'smallRemarkBox'">
              <div class="top">
                <span class="title">待办提醒</span>
              </div>
              <div class="remarkList">
                <!--                <div v-for="(list, index) in markList" :key="index" class="remark">-->
                <!--                  <div class="markTag" :class="getMarkClazz(list.type)">{{ getMarkText(list.type) }}</div>-->
                <!--                  <div class="markText">{{ list.content }}</div>-->
                <!--                </div>-->
                <etm-empty />
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
                  v-for="(list, index) in showData.dataChart"
                  :key="index"
                  :label="list.name"
                  :name="list.name"
                />
                <div slot="tool" class="tabsSearch">
                  <template v-if="showData.dataChart.length">
                    <div v-show="chartTabs === '健康检查' || chartTabs === '幼儿考勤'">
                      <etm-clazz-cascader @change="getClazz" />
                    </div>
                    <el-select v-model="dateType">
                      <el-option label="按年" value="year" />
                      <el-option label="按月" value="month" />
                    </el-select>
                    <template v-if="dateType === 'year'">
                      <el-date-picker
                        v-model="dateValue"
                        type="year"
                        :clearable="false"
                        :picker-options="disabledYear"
                      />
                    </template>
                    <template v-else-if="dateType === 'month'">
                      <el-date-picker
                        v-model="dateValue"
                        type="month"
                        :clearable="false"
                        :picker-options="disabledMonth"
                      />
                    </template>
                  </template>
                  <!--                  <span class="edit" @click="editSetting('chart')">设置</span>-->
                </div>
              </etm-tabs>
              <div v-if="chartTabs === '收入/支出'">
                <bar-chart :chart-data="cashData" />
              </div>
              <div v-if="chartTabs === '净现金流'">
                <line-chart :chart-data="flowData" />
              </div>
              <div v-if="chartTabs === '健康检查'">
                <bar-chart :chart-data="checkData" />
              </div>
              <div v-if="chartTabs === '幼儿考勤'">
                <bar-chart :chart-data="attendanceData" />
              </div>
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
                  <etm-todo v-bind="{...list}" @click="$router.push({name: 'productDetail', query: {...list}})" />
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </etm-main-body>
    <etm-pop
      v-if="showPop"
      :visible="showPop"
      :title="popTitle"
      pop="big"
      confirm-btn="确定"
      cancel-btn="取消"
      @close="popClose"
      @confirm="popConfirm"
      @cancel="popClose"
    >
      <quick-pop v-if="popType === 'quick'" :select-data="propData.dataQuick" :menu-data="allData.dataQuick" />
      <chart-pop v-else-if="popType === 'chart'" :select-data="propData.dataChart" :menu-data="allData.dataChart" />
    </etm-pop>
  </div>

</template>

<script>
import EtmClazzCascader from '@/components/EtmClazzCascader'
import barChart from './chart/barChart'
import lineChart from './chart/lineChart'
import {
  getWorkbenchAttendance,
  getWorkbenchCash,
  getWorkbenchCheck,
  getWorkBenchData,
  getWorkbenchFlow, getWorkbenchPart, getWorkbenchSetting, renewWorkbenchSetting
} from '@/api/guardcare/dashboard/dashboard'
import { parseTime } from '@/utils'
import quickPop from '@/views/guardcare/dashboard/component/quickPop'
import chartPop from '@/views/guardcare/dashboard/component/chartPop'
import EtmTodo from '@/views/newDaycare/dashboard/components/EtmTodo'
import { queryProductDynamicList } from '@/api/base/base'

/**
 * index create by Administrator
 * createTime 2020/9/15 16:43
 */
export default {
  name: 'Index',
  components: {
    EtmClazzCascader,
    lineChart,
    barChart,
    quickPop,
    chartPop,
    EtmTodo
  },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      propData: {
        dataCard: [],
        dataChart: [],
        dataQuick: []
      },
      allData: {
        dataCard: [],
        dataChart: [],
        dataQuick: []
      },
      showData: {
        dataCard: [],
        dataChart: [],
        dataQuick: []
      },
      currentData: {},
      lastData: {},
      collapseActive: '1',
      markList: [],
      chartTabs: '',
      dateType: 'year',
      dateValue: new Date(),
      clazzValue: [],
      disabledYear: {
        disabledDate(date) {
          return date.getTime() > new Date().getTime()
        }
      },
      disabledMonth: {
        disabledDate(date) {
          return date.getTime() > new Date().getTime()
        }
      },
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
      },
      productList: [],
      showPop: false,
      popTitle: '',
      popType: ''
    }
  },
  computed: {},
  watch: {
    dateType() {
      this.getCashData()
      this.getFlowData()
      this.getCheckData()
      this.getAttendanceData()
    },
    dateValue() {
      this.getCashData()
      this.getFlowData()
      this.getCheckData()
      this.getAttendanceData()
    },
    clazzValue: {
      handler() {
        this.getCheckData()
        this.getAttendanceData()
      },
      deep: true
    },
    chartTabs(value) {
      if (value === '收入/支出') {
        if (!this.cashData.xData) {
          this.getCashData()
        }
      } else if (value === '净现金流') {
        if (!this.flowData.xData) {
          this.getFlowData()
        }
      } else if (value === '健康检查') {
        if (!this.checkData.xData) {
          this.getCheckData()
        }
      } else if (value === '幼儿考勤') {
        if (!this.attendanceData.xData) {
          this.getAttendanceData()
        }
      }
    }
  },
  created() {
    this.getData()
    this.getCountData()
    this.getCashData()
    this.getAllPart()
    this.getSetting()
  },
  mounted() {
  },
  methods: {
    getData() {
      queryProductDynamicList().then(res => {
        this.productList = res.data
        this.productList.forEach(item => {
          item.date = parseTime(item.createTime, '{m}-{d}')
        })
      })
    },
    getAllPart() {
      getWorkbenchPart().then(res => {
        const data = res.data
        data.forEach(item => {
          if (item.partType === 'DATA_CARD') { // 数据卡片
            this.allData.dataCard = item.partList
          } else if (item.partType === 'QUICK_OPERATION') { // 快捷操作
            const partList = item.partList
            const listData = []
            partList.forEach((list, index) => { // 快捷操作进行分类
              if (listData.length) {
                let flag = false
                for (let i = 0; i < listData.length; i++) {
                  if (listData[i].name === list.list) {
                    flag = true
                    listData[i].data.push(list)
                    break
                  }
                }
                if (!flag) {
                  const v = {
                    name: list.list,
                    id: 'list' + index,
                    data: []
                  }
                  v.data.push(list)
                  listData.push(v)
                }
              } else {
                const v = {
                  name: list.list,
                  id: 'list' + index,
                  data: []
                }
                v.data.push(list)
                listData.push(v)
              }
            })
            this.allData.dataQuick = listData
          } else if (item.partType === 'STATISTIC_CHART') { // 统计图表
            this.allData.dataChart = item.partList
          }
        })
      })
    },
    getSetting() {
      getWorkbenchSetting().then(res => {
        const { config } = res.data
        const data = JSON.parse(config)
        data.forEach(item => {
          if (item.partType === 'DATA_CARD') { // 数据卡片
            this.showData.dataCard = item.partList
          } else if (item.partType === 'QUICK_OPERATION') { // 快捷操作进行分类
            const partList = item.partList
            const listData = []
            partList.forEach(list => {
              const v = {}
              for (const i in list) {
                if (i === 'config') {
                  v[i] = JSON.parse(list[i])
                } else {
                  v[i] = list[i]
                }
              }
              listData.push(v)
            })
            this.showData.dataQuick = listData
          } else if (item.partType === 'STATISTIC_CHART') { // 统计图表
            this.showData.dataChart = item.partList
            if (this.showData.dataChart.length) {
              this.chartTabs = this.showData.dataChart[0].name
            }
          }
        })
      })
    },
    editSetting(type) {
      this.popType = type
      this.propData = JSON.parse(JSON.stringify(this.showData))
      if (type === 'quick') {
        this.popTitle = '快捷操作设置'
      } else if (type === 'chart') {
        this.popTitle = '统计图表设置'
      }
      this.showPop = true
    },
    popClose() {
      this.showPop = false
    },
    popConfirm() {
      const config = [
        {
          partType: 'DATA_CARD',
          partList: this.propData.dataCard
        },
        {
          partType: 'STATISTIC_CHART',
          partList: this.propData.dataChart
        }
      ]
      if (!this.propData.dataQuick.length) {
        config.push({
          partType: 'QUICK_OPERATION',
          partList: this.propData.dataQuick
        })
      } else {
        const data = {
          partType: 'QUICK_OPERATION',
          partList: []
        }
        this.propData.dataQuick.forEach(item => {
          const obj = {}
          for (const i in item) {
            if (i === 'config' && typeof item[i] === 'object') {
              obj[i] = JSON.stringify(item[i])
            } else {
              obj[i] = item[i]
            }
          }
          data.partList.push(obj)
        })
        config.push(data)
      }
      const param = {
        config: JSON.stringify(config)
      }
      renewWorkbenchSetting(param).then(() => {
        this.$message.success('设置修改成功')
        this.getSetting()
        this.showPop = false
      })
    },
    getCountData() {
      getWorkBenchData().then(res => {
        this.currentData = res.data.overview.thisMonth
        this.lastData = res.data.overview.lastMonth
        this.currentData.cashFlow = this.currentData.incomeAmount - this.currentData.outcomeAmount
        this.lastData.cashFlow = this.lastData.incomeAmount - this.lastData.outcomeAmount
      })
    },
    getCashData() {
      const param = {}
      if (this.dateType === 'year') {
        param.type = 'USE_YEAR'
        param.date = parseTime(this.dateValue, '{y}')
      } else {
        param.type = 'USE_MONTH'
        param.date = parseTime(this.dateValue, '{y}-{m}')
      }
      getWorkbenchCash(param).then(res => {
        const data = res.data
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
    getFlowData() {
      const param = {}
      if (this.dateType === 'year') {
        param.type = 'USE_YEAR'
        param.date = parseTime(this.dateValue, '{y}')
      } else {
        param.type = 'USE_MONTH'
        param.date = parseTime(this.dateValue, '{y}-{m}')
      }
      getWorkbenchFlow(param).then(res => {
        const data = res.data
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
    getCheckData() {
      const param = {}
      if (this.dateType === 'year') {
        param.type = 'USE_YEAR'
        param.date = parseTime(this.dateValue, '{y}')
      } else {
        param.type = 'USE_MONTH'
        param.date = parseTime(this.dateValue, '{y}-{m}')
      }
      if (this.clazzValue.length) {
        param.clazzId = this.clazzValue[1]
      }
      getWorkbenchCheck(param).then(res => {
        const data = res.data
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
    getAttendanceData() {
      const param = {}
      if (this.dateType === 'year') {
        param.type = 'USE_YEAR'
        param.date = parseTime(this.dateValue, '{y}')
      } else {
        param.type = 'USE_MONTH'
        param.date = parseTime(this.dateValue, '{y}-{m}')
      }
      if (this.clazzValue.length) {
        param.clazzId = this.clazzValue[1]
      }
      getWorkbenchAttendance(param).then(res => {
        const data = res.data
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
      if (!number || number < 1000) {
        return number || 0
      } else {
        return (number).toFixed(2).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,')
      }
    },
    getClazz(value) {
      this.clazzValue = value
    },
    toAllowance() {
      this.$router.push({
        path: '/document/allowanceGuide'
      })
    },
    toSkill() {
      this.$router.push({
        path: '/document/skillGuide'
      })
    },
    toRecipe() {
      this.$router.push({
        path: '/document/recipeGuide'
      })
    },
    toPolicy() {
      this.$router.push({
        path: '/document/policyGuide'
      })
    },
    pickUp() {
      this.collapseActive = ''
    },
    slide() {
      this.collapseActive = '1'
    },
    toOrg() {
      this.$router.push({
        path: '/basic/newOrg'
      })
    },
    toPath(path, type) {
      if (type) {
        this.$store.commit('guardcareDashboard/SET_PAGEENTRY', type)
      }
      const cacheSolution = JSON.parse(localStorage.getItem('CACHESOLUTION'))
      for (let o = 0; o < cacheSolution.length; o++) {
        const item = cacheSolution[o]
        if (item.type === 'BUSINESS') {
          for (let i = 0; i < item.resourceList.length; i++) {
            const list = item.resourceList[i]
            if (list.type === 'FOLDER') {
              for (let v = 0; v < list.childList.length; v++) {
                const folder = list.childList[v]
                if (folder.type === 'MENU') {
                  const data1 = JSON.parse(list.identify.trim())
                  const data2 = JSON.parse(folder.identify.trim())
                  if (path === data2.name) {
                    const url = '/' + data1.name + '/' + data2.name
                    return this.$router.push({
                      path: url
                    })
                  }
                }
              }
            } else if (list.type === 'MENU') {
              const data = JSON.parse(list.identify.trim())
              if (path === data.name) {
                return this.$router.push({
                  path: '/' + path
                })
              }
            }
          }
        }
      }
    },
    toEvalution() {
      window.open('https://mp.weixin.qq.com/s/Thd37oUCZyV6r937a35YpQ')
    }
  }
}
</script>
<style lang="scss" scoped>
.dashboard-wrap {
  @include c_text_color();

  .header {
    padding-bottom: 16px;

    .colBox {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-around;
      flex-direction: column;
      padding: 0 20px;
      height: 60px;
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
        background: linear-gradient(to right, #81bfff, #19a8fd);

        &:hover {
          background: linear-gradient(to right, rgba(129, 191, 255, .8), rgba(85, 168, 253, .8));
        }
      }

      &.skill {
        background: linear-gradient(to right, #ffcf74, #ffbc3c);

        &:hover {
          background: linear-gradient(to right, rgba(255, 207, 116, .8), rgba(255, 188, 60, .8));
        }
      }

      &.recipe {
        background: linear-gradient(to right, #77e99c, #4dd87a);

        &:hover {
          background: linear-gradient(to right, rgba(119, 233, 156, .8), rgba(77, 216, 122, .8));
        }
      }

      &.policy {
        background: linear-gradient(to right, #b0a4ef, #8f7ee5);

        &:hover {
          background: linear-gradient(to right, rgba(176, 164, 239, .8), rgba(143, 126, 229, .8));
        }
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
      cursor: pointer;

      &:hover {
        .itemTitle {
          @include etm-color();
        }
      }

      .itemTitle {
        padding: 8px 0 16px;
        height: 38px;
        line-height: 14px;
        @include c_secondary_color();
      }

      .itemAmount {
        display: flex;
        align-items: flex-end;
        padding-bottom: 16px;
        font-weight: bold;

        &.income {
          color: #FFA336;
        }

        &.outcome {
          color: #FF696A;
        }

        &.check {
          color: #569EFF;
        }

        .attendance {
          color: #15C692;
        }

        .unit {
          display: inline-block;
          height: 16px;
          line-height: 16px;
          font-size: 16px;
        }

        .number {
          display: inline-block;
          height: 22px;
          line-height: 22px;
          font-size: 22px;
        }
      }

      .itemLastAmount {
        display: flex;
        justify-content: space-between;
        padding-top: 16px;
        border-top: 1px solid #F2F2F2;
      }

      .bgImg {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 80px;

        img {
          display: block;
          width: 100%;
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

          &:hover {
            @include c_main_color();
          }
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

              &:hover {
                opacity: .8;
              }

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

        .menu {
          padding: 0 10px;
          cursor: pointer;

          &:not(:first-child) {
            margin-left: 20px;
          }

          &:hover {
            .icon {
              opacity: .8;
            }

            .menuText {
              @include c_main_color();
            }
          }

          .iconBox {
            margin: 0 auto;
            width: 40px;
            height: 40px;

            .icon {
              width: 100%;
              height: 100%;
            }
          }

          .menuText {
            margin-top: 10px;
            height: 14px;
            line-height: 14px;
          }
        }
      }

      .noQuickEntry {
        padding: 39px 0 23px;
        text-align: center;

        .operate {
          display: inline-block;
          @include c_main_color();
          cursor: pointer;

          .iconfont {
            font-size: 15px;
          }

          &:hover {
            opacity: 0.8;
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
        }
      }

      .top {
        border-bottom: 1px solid $divide-color;
      }

      .remarkList {
        padding: 16px 0 8px;
        max-height: 214px;
        overflow-y: hidden;

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

          &:hover {
            @include c_main_color();
          }
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
