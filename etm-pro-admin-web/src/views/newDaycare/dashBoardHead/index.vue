<template>
  <div class="index-wrap">
    <etm-main-body>
      <div class="overViewBox">
        <div class="timeBox">
          <div class="fixedBox">
            <span>筛选：</span>
            <etm-screen-tab v-model="timeType" :options="timeData" @change="changeTime" />
            <div class="time">
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
            <el-select v-model="areaValue" @change="getOverViewData">
              <el-option
                v-for="(area, index) in areaList"
                :key="index"
                :label="area.areaName"
                :value="area.organizationId"
              />
            </el-select>
          </div>
        </div>
        <div class="cardBox">
          <div v-for="(total, index) in totalData" :key="index" class="cardList">
            <div class="list">
              <div class="listBox">
                <div class="iconBox">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#iconshourujine" />
                  </svg>
                </div>
                <div class="data">
                  <div class="count">￥{{ formatMoney(total.totalIncomeAmount) }}</div>
                  <div class="label">{{
                    total.businessType === 'CARE' ? '托育' : total.businessType === 'TEACH' ? '早教' : total.businessType === 'GUARD' ? '幼儿园' : '总'
                  }}收入金额
                  </div>
                </div>
              </div>
            </div>
            <div class="list">
              <div class="listBox">
                <div class="iconBox">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#iconzhichujine" />
                  </svg>
                </div>
                <div class="data">
                  <div class="count">￥{{ formatMoney(total.totalExpendAmount) }}</div>
                  <div class="label">{{
                    total.businessType === 'CARE' ? '托育' : total.businessType === 'TEACH' ? '早教' : total.businessType === 'GUARD' ? '幼儿园' : '总'
                  }}支出金额
                  </div>
                </div>
              </div>
            </div>
            <div class="list">
              <div class="listBox">
                <div class="iconBox">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#iconqiandanjine" />
                  </svg>
                </div>
                <div class="data">
                  <div class="count">{{ total.totalEmployeeAmount }}</div>
                  <div class="label">{{
                    total.businessType === 'CARE' ? '托育' : total.businessType === 'TEACH' ? '早教' : total.businessType === 'GUARD' ? '幼儿园' : ''
                  }}员工总数
                  </div>
                </div>
              </div>
            </div>
            <div class="list">
              <div class="listBox">
                <div class="iconBox">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#iconqiandanshuliang" />
                  </svg>
                </div>
                <div class="data">
                  <div class="count">{{ total.totalChildAmount }}</div>
                  <div class="label">{{
                    total.businessType === 'CARE' ? '托育' : total.businessType === 'TEACH' ? '早教' : total.businessType === 'GUARD' ? '幼儿园' : ''
                  }}总学员数
                  </div>
                </div>
              </div>
            </div>
            <div class="list">
              <div class="listBox">
                <div class="iconBox">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#iconzaojiaohuiyuan" />
                  </svg>
                </div>
                <div class="data">
                  <div class="count">{{ total.totalNewChildAmount }}</div>
                  <div class="label">{{
                    total.businessType === 'CARE' ? '托育' : total.businessType === 'TEACH' ? '早教' : total.businessType === 'GUARD' ? '幼儿园' : '总'
                  }}新增学员数
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mapBox">
        <map-component v-if="mapData.list" :data="mapData.list" />
        <div class="summaryBox">
          <div class="summary">
            <span>园所数量</span>
            <span>{{ mapData.organizationAmount }}</span>
          </div>
          <div class="summary">
            <span>学员数量</span>
            <span>{{ mapData.childAmount }}</span>
          </div>
          <div class="summary">
            <span>员工数量</span>
            <span>{{ mapData.employeeAmount }}</span>
          </div>
        </div>
      </div>
      <div v-if="isTop" class="areaBox">
        <div class="areaTop">
          <div class="title">区域数据</div>
          <div class="select">
            <etm-screen-tab v-model="tableTimeType" :options="timeData" @change="changeTableTime" />
            <div class="time">
              <el-date-picker
                v-model="tableStartTime"
                placeholder="开始时间"
                :clearable="false"
                :picker-options="tableStartOptions"
                @change="confirmTableStartTime"
              />
              <span class="divide">-</span>
              <el-date-picker
                v-model="tableEndTime"
                placeholder="结束时间"
                :clearable="false"
                :picker-options="tableEndOptions"
                @change="confirmTableEndTime"
              />
              <el-select v-model="tableAreaValue" @change="getTableData">
                <el-option
                  v-for="(area, index) in areaList"
                  :key="index"
                  :label="area.areaName"
                  :value="area.organizationId"
                />
              </el-select>
            </div>
          </div>
        </div>
        <div class="areaData">
          <div class="dataTitle">幼儿园数据</div>
          <etm-table :data="guardTableData" :columns="tableColumn">
            <el-table-column slot="left" label="所属大区" prop="headquarterName" />
            <el-table-column slot="left" label="总收入（元）" align="right">
              <template slot-scope="scoped">
                <span>{{ formatMoney(scoped.row.totalIncomeAmount) }}</span>
              </template>
            </el-table-column>
          </etm-table>
        </div>
        <div class="areaData">
          <div class="dataTitle">托育数据</div>
          <etm-table :data="careTableData" :columns="tableColumn">
            <el-table-column slot="left" label="所属大区" prop="headquarterName" />
            <el-table-column slot="left" label="总收入（元）" align="right">
              <template slot-scope="scoped">
                <span>{{ formatMoney(scoped.row.totalIncomeAmount) }}</span>
              </template>
            </el-table-column>
          </etm-table>
        </div>
      </div>
      <div class="chartBox">
        <div class="chart">
          <div class="chartTop">
            <div class="chartName">幼儿园学员数量</div>
            <el-select v-model="guardAreaValue" @change="getGuardChartData">
              <el-option
                v-for="(area, index) in areaList"
                :key="index"
                :label="area.areaName"
                :value="area.organizationId"
              />
            </el-select>
          </div>
          <bar-chart v-if="guardChartData.xData && guardChartData.xData.length" :chart-data="guardChartData" />
          <etm-empty v-else />
        </div>
        <div class="chart">
          <div class="chartTop">
            <div class="chartName">托育学员数量</div>
            <el-select v-model="careAreaValue" @change="getCareChartData">
              <el-option
                v-for="(area, index) in areaList"
                :key="index"
                :label="area.areaName"
                :value="area.organizationId"
              />
            </el-select>
          </div>
          <bar-chart v-if="careChartData.xData && careChartData.xData.length" :chart-data="careChartData" />
          <etm-empty v-else />
        </div>
        <div class="chart">
          <div class="chartTop">
            <div class="chartName">收入金额</div>
            <el-select v-model="incomeTimeType" @change="getIncomeChartData">
              <el-option label="按年" value="YEAR" />
              <el-option label="按月" value="MONTH" />
            </el-select>
            <el-date-picker
              v-if="incomeTimeType === 'YEAR'"
              v-model="incomeYear"
              :clearable="false"
              type="year"
              @change="getIncomeChartData"
            />
            <el-date-picker v-else v-model="incomeMonth" :clearable="false" type="month" @change="getIncomeChartData" />
            <el-select v-model="incomeAreaValue" @change="getIncomeChartData">
              <el-option
                v-for="(area, index) in areaList"
                :key="index"
                :label="area.areaName"
                :value="area.organizationId"
              />
            </el-select>
          </div>
          <line-chart v-if="incomeChartData.xData && incomeChartData.xData.length" :chart-data="incomeChartData" />
          <etm-empty v-else />
        </div>
        <div class="chart">
          <div class="chartTop">
            <div class="chartName">新增学员</div>
            <el-select v-model="studentTimeType" @change="getStudentChartData">
              <el-option label="按年" value="YEAR" />
              <el-option label="按月" value="MONTH" />
            </el-select>
            <el-date-picker
              v-if="studentTimeType === 'YEAR'"
              v-model="studentYear"
              :clearable="false"
              type="year"
              @change="getStudentChartData"
            />
            <el-date-picker
              v-else
              v-model="studentMonth"
              :clearable="false"
              type="month"
              @change="getStudentChartData"
            />
            <el-select v-model="studentAreaValue" @change="getStudentChartData">
              <el-option
                v-for="(area, index) in areaList"
                :key="index"
                :label="area.areaName"
                :value="area.organizationId"
              />
            </el-select>
          </div>
          <line-chart v-if="studentChartData.xData && studentChartData.xData.length" :chart-data="studentChartData" />
          <etm-empty v-else />
        </div>
      </div>
    </etm-main-body>
  </div>

</template>

<script>
/**
 * index create by Administrator
 * createTime 2021/2/1 11:58
 */
import dayjs from 'dayjs'
import barChart from './component/barChart'
import lineChart from './component/lineChart'
import mapComponent from './component/mapComponent'
import {
  queryAreaList,
  queryAreaTableData,
  queryBarChartData,
  queryDashboardMapData,
  queryEnterpriseTop,
  queryIncomeChartData,
  queryOverViewData,
  queryStudentChartData
} from '@/api/newDaycare/dashBoardHead'
import { parseTime } from '@/utils'

export default {
  name: 'Index',
  components: { lineChart, barChart, mapComponent },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      areaList: [],
      timeType: '',
      timeData: [
        {
          name: '本年',
          value: 'current_year'
        },
        {
          name: '本月',
          value: 'current_month'
        }
      ],
      startTime: '',
      endTime: '',
      startOptions: {},
      endOptions: {},
      areaValue: '',
      totalData: [
        {
          totalIncomeAmount: 0,
          totalExpendAmount: 0,
          totalEmployeeAmount: 0,
          totalChildAmount: 0,
          totalNewChildAmount: 0,
          businessType: null
        },
        {
          totalIncomeAmount: 0,
          totalExpendAmount: 0,
          totalEmployeeAmount: 0,
          totalChildAmount: 0,
          totalNewChildAmount: 0,
          businessType: 'GUARD'
        },
        {
          totalIncomeAmount: 0,
          totalExpendAmount: 0,
          totalEmployeeAmount: 0,
          totalChildAmount: 0,
          totalNewChildAmount: 0,
          businessType: 'CARE'
        }
      ],
      isTop: false,
      tableTimeType: '',
      tableStartTime: '',
      tableEndTime: '',
      tableStartOptions: {},
      tableEndOptions: {},
      tableAreaValue: '',
      guardTableData: [],
      careTableData: [],
      tableColumn: [
        {
          label: '在园幼儿（人）',
          prop: 'totalChildAmount'
        },
        {
          label: '满员率',
          prop: 'fullRatio'
        },
        {
          label: '男女比例',
          prop: 'boyGirlRatio'
        },
        {
          label: '男学员数量',
          prop: 'boyChildAmount'
        },
        {
          label: '女学员数量',
          prop: 'girlChildAmount'
        },
        {
          label: '出勤人次',
          prop: 'attendTime'
        },
        {
          label: '出勤率',
          prop: 'attendRatio'
        }
      ],
      date: new Date(),
      guardAreaValue: '',
      guardChartData: {
        content: []
      },
      careAreaValue: '',
      careChartData: {
        content: []
      },
      incomeTimeType: 'MONTH',
      incomeYear: new Date(),
      incomeMonth: new Date(),
      incomeAreaValue: '',
      incomeChartData: {
        content: []
      },
      studentTimeType: 'MONTH',
      studentYear: new Date(),
      studentMonth: new Date(),
      studentAreaValue: '',
      studentChartData: {
        content: []
      },
      mapData: {
        organizationAmount: 0,
        childAmount: 0,
        employeeAmount: 0
      }
    }
  },
  computed: {},
  watch: {},
  created() {
    this.check()
    this.getMapData()
  },
  mounted() {
  },
  methods: {
    getMapData() {
      queryDashboardMapData().then(res => {
        this.mapData = res.data
      })
    },
    check() {
      queryEnterpriseTop().then(res => {
        this.isTop = res.data
        this.getAreaList()
      })
    },
    getAreaList() {
      queryAreaList().then(res => {
        this.areaList = res.data
        this.areaValue = this.areaList[0] && this.areaList[0].organizationId
        this.tableAreaValue = this.areaList[0] && this.areaList[0].organizationId
        // 统计数据
        this.startTime = new Date(dayjs(new Date()).subtract(30, 'day'))
        this.endTime = new Date()
        this.confirmStartTime(this.startTime, 'notLoad')
        this.confirmEndTime(this.endTime)
        // 表格数据
        if (this.isTop) {
          this.tableStartTime = new Date(dayjs(new Date()).subtract(30, 'day'))
          this.tableEndTime = new Date()
          this.confirmTableStartTime(this.tableStartTime, 'notLoad')
          this.confirmTableEndTime(this.tableEndTime)
        }
        // 幼儿园学员数量echart图表数据
        this.guardAreaValue = this.areaList[0] && this.areaList[0].organizationId
        this.getGuardChartData()
        // 托育学员数量echart图表数据
        this.careAreaValue = this.areaList[0] && this.areaList[0].organizationId
        this.getCareChartData()
        // 收入金额echart图表数据
        this.incomeAreaValue = this.areaList[0] && this.areaList[0].organizationId
        this.getIncomeChartData()
        // 新增学员echart图表数据
        this.studentAreaValue = this.areaList[0] && this.areaList[0].organizationId
        this.getStudentChartData()
      })
    },
    changeTime(value) { // 统计数据本年/本月切换
      if (value === 'current_year') {
        this.startTime = new Date(dayjs(new Date()).startOf('year'))
        this.endTime = new Date()
        this.confirmStartTime(this.startTime, 'notLoad')
        this.confirmEndTime(this.endTime)
      } else if (value === 'current_month') {
        this.startTime = new Date(dayjs(new Date()).startOf('month'))
        this.endTime = new Date()
        this.confirmStartTime(this.startTime, 'notLoad')
        this.confirmEndTime(this.endTime)
      }
    },
    confirmStartTime(date, type) { // 限制统计数据结束日期的选择
      this.endOptions = {
        disabledDate(time) {
          return time.getTime() < new Date(date).getTime()
        }
      }
      if (type !== 'notLoad') {
        this.getOverViewData()
      }
    },
    confirmEndTime(date) { // 限制统计数据开始日期的选择
      this.startOptions = {
        disabledDate(time) {
          return time.getTime() > new Date(date).getTime()
        }
      }
      this.getOverViewData()
    },
    getOverViewData() { // 获取统计数据
      const param = {
        startDate: parseTime(this.startTime, '{y}-{m}-{d}'),
        endDate: parseTime(this.endTime, '{y}-{m}-{d}'),
        organizationId: this.areaValue
      }
      if (!this.areaValue) {
        return
      }
      queryOverViewData(param).then(res => {
        const data = res.data
        const totalData = [
          {
            totalIncomeAmount: 0,
            totalExpendAmount: 0,
            totalEmployeeAmount: 0,
            totalChildAmount: 0,
            totalNewChildAmount: 0,
            businessType: null
          },
          {
            totalIncomeAmount: 0,
            totalExpendAmount: 0,
            totalEmployeeAmount: 0,
            totalChildAmount: 0,
            totalNewChildAmount: 0,
            businessType: 'GUARD'
          },
          {
            totalIncomeAmount: 0,
            totalExpendAmount: 0,
            totalEmployeeAmount: 0,
            totalChildAmount: 0,
            totalNewChildAmount: 0,
            businessType: 'CARE'
          }
        ]
        data.forEach(item => {
          for (let i = 0; i < totalData.length; i++) {
            if (item.businessType === totalData[i].businessType) {
              for (const n in item) {
                totalData[i][n] = item[n]
              }
            }
          }
        })
        this.totalData = totalData
      })
    },
    changeTableTime(value) { // 表格数据数据本年/本月切换
      if (value === 'current_year') {
        this.tableStartTime = new Date(dayjs(new Date()).startOf('year'))
        this.tableEndTime = new Date()
        this.confirmTableStartTime(this.tableStartTime, 'notLoad')
        this.confirmTableEndTime(this.tableEndTime)
      } else if (value === 'current_month') {
        this.tableStartTime = new Date(dayjs(new Date()).startOf('month'))
        this.tableEndTime = new Date()
        this.confirmTableStartTime(this.tableStartTime, 'notLoad')
        this.confirmTableEndTime(this.tableEndTime)
      }
    },
    confirmTableStartTime(date, type) { // 限制表格数据结束日期的选择
      this.tableEndOptions = {
        disabledDate(time) {
          return time.getTime() < new Date(date).getTime()
        }
      }
      if (type !== 'notLoad') {
        this.getTableData()
      }
    },
    confirmTableEndTime(date) { // 限制表格数据开始日期的选择
      this.tableStartOptions = {
        disabledDate(time) {
          return time.getTime() > new Date(date).getTime()
        }
      }
      this.getTableData()
    },
    getTableData() { // 获取表格数据
      const param = {
        startDate: parseTime(this.tableStartTime, '{y}-{m}-{d}'),
        endDate: parseTime(this.tableEndTime, '{y}-{m}-{d}'),
        organizationId: this.tableAreaValue
      }
      if (!this.tableAreaValue) {
        return
      }
      queryAreaTableData(param).then(res => {
        const data = res.data
        for (const i in data) {
          if (i === 'GUARD') {
            this.guardTableData = data[i]
          } else if (i === 'CARE') {
            this.careTableData = data[i]
          }
        }
      })
    },
    formatMoney(money) { // 金额显示处理
      if (!isNaN(money)) {
        return money.toFixed(2)
      } else {
        return money
      }
    },
    getGuardChartData() {
      const param = {
        organizationId: this.guardAreaValue,
        businessType: 'GUARD'
      }
      if (!this.guardAreaValue) {
        return
      }
      queryBarChartData(param).then(res => {
        const data = res.data
        const chartData = {
          xData: [],
          content: [
            {
              color: '#5F97FF',
              data: [],
              title: '满员数'
            },
            {
              color: '#15C5EF',
              data: [],
              title: '在园数'
            }
          ]
        }
        data.forEach(item => {
          chartData.xData.push(item.headquarterName)
          chartData.content[0].data.push(item.fullChildAmount)
          chartData.content[1].data.push(item.inSchoolChildAmount)
        })
        this.guardChartData = chartData
      })
    },
    getCareChartData() {
      const param = {
        organizationId: this.careAreaValue,
        businessType: 'CARE'
      }
      if (!this.careAreaValue) {
        return
      }
      queryBarChartData(param).then(res => {
        const data = res.data
        const chartData = {
          xData: [],
          content: [
            {
              color: '#5F97FF',
              data: [],
              title: '满员数'
            },
            {
              color: '#15C5EF',
              data: [],
              title: '在园数'
            }
          ]
        }
        data.forEach(item => {
          chartData.xData.push(item.headquarterName)
          chartData.content[0].data.push(item.fullChildAmount)
          chartData.content[1].data.push(item.inSchoolChildAmount)
        })
        this.careChartData = chartData
      })
    },
    getIncomeChartData() {
      const param = {
        organizationId: this.incomeAreaValue,
        yearOrMonth: this.incomeTimeType
      }
      if (!this.incomeAreaValue) {
        return
      }
      if (this.incomeTimeType === 'YEAR') {
        param.startDate = dayjs(this.incomeYear).startOf('year').format('YYYY-MM-DD')
        param.endDate = dayjs(this.incomeYear).endOf('year').format('YYYY-MM-DD')
      } else {
        param.startDate = dayjs(this.incomeMonth).startOf('month').format('YYYY-MM-DD')
        param.endDate = dayjs(this.incomeMonth).endOf('month').format('YYYY-MM-DD')
      }
      queryIncomeChartData(param).then(res => {
        const data = res.data
        const chartData = {
          xData: [],
          content: [
            {
              color: '#3891F4',
              data: [],
              title: '收入金额'
            }
          ]
        }
        data.forEach(item => {
          chartData.xData.push(item.label)
          chartData.content[0].data.push(item.amount)
        })
        this.incomeChartData = chartData
      })
    },
    getStudentChartData() {
      const param = {
        organizationId: this.studentAreaValue,
        yearOrMonth: this.studentTimeType
      }
      if (this.studentTimeType === 'YEAR') {
        param.startDate = dayjs(this.studentYear).startOf('year').format('YYYY-MM-DD')
        param.endDate = dayjs(this.studentYear).endOf('year').format('YYYY-MM-DD')
      } else {
        param.startDate = dayjs(this.studentMonth).startOf('month').format('YYYY-MM-DD')
        param.endDate = dayjs(this.studentMonth).endOf('month').format('YYYY-MM-DD')
      }
      if (!this.studentAreaValue) {
        return
      }
      queryStudentChartData(param).then(res => {
        const data = res.data
        const chartData = {
          xData: [],
          content: [
            {
              color: '#15C5EF',
              data: [],
              title: '新增学员'
            }
          ]
        }
        data.forEach(item => {
          chartData.xData.push(item.label)
          chartData.content[0].data.push(item.amount)
        })
        this.studentChartData = chartData
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.index-wrap {
  padding-bottom: 1px;

  .el-date-editor {
    width: 140px;
  }

  .el-select {
    width: 140px;
  }

  ::v-deep .EtmScreenTab-wrap {
    margin-bottom: 0;
  }

  .timeBox {
    .fixedBox {
      display: flex;
      align-items: center;
      padding: 16px 24px;
      background-color: #ffffff;
      border-radius: 4px;
      overflow: hidden;

      .time {
        margin: 0 16px;
      }

      .divide {
        margin: 0 6px;
      }
    }
  }

  .cardBox {
    .cardList {
      display: flex;
      margin-top: 16px;
      padding: 24px 16px;
      background-color: #ffffff;
      border-radius: 4px;
      overflow: hidden;

      .list {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20%;

        & + .list {
          position: relative;

          &::before {
            display: inline-block;
            position: absolute;
            top: 8px;
            left: 0;
            content: '';
            width: 1px;
            height: 40px;
            @include bgc_divide_color();
          }
        }

        .listBox {
          display: flex;
          align-items: center;
          width: 184px;
        }

        .iconBox {
          height: 56px;

          .icon {
            width: 56px;
            height: 56px;
          }
        }

        .data {
          margin-left: 16px;

          .count {
            height: 24px;
            line-height: 24px;
            font-size: 18px;
            font-weight: bold;
            @include c_title_color();
          }

          .label {
            margin-top: 8px;
            height: 16px;
            line-height: 16px;
            font-size: 14px;
            @include c_secondary_color();
          }
        }
      }
    }
  }

  .mapBox {
    position: relative;
    margin-top: 16px;
    border-radius: 4px;
    overflow: hidden;

    .summaryBox {
      position: absolute;
      right: 24px;
      bottom: 36px;
      z-index: 9;

      .summary {
        display: flex;
        align-items: center;
        padding: 16px;
        width: 180px;
        font-size: 16px;
        color: #f2f4f9;
        border-radius: 4px;
        background-color: #555555;

        & + .summary {
          margin-top: 16px;
        }

        span:last-child {
          margin-left: 16px;
        }
      }
    }
  }

  .areaBox {
    margin-top: 16px;
    padding: 16px;
    background-color: #ffffff;
    border-radius: 4px;

    .areaTop {
      display: flex;
      align-items: center;

      .title {
        font-size: 16px;
        font-weight: bold;
        @include c_title_color();
      }

      .select {
        display: flex;
        margin-left: 36px;

        .time {
          margin-left: 16px;
        }
      }
    }

    .areaData {
      .dataTitle {
        padding: 24px 0 16px;
        @include c_title_color();
      }

      ::v-deep .EtmTable-wrap {
        padding: 0;
      }
    }
  }

  .chartBox {
    .chart {
      margin-top: 16px;
      padding: 16px;
      background-color: #ffffff;
      border-radius: 4px;

      .chartTop {
        display: flex;
        align-items: center;
        padding-bottom: 16px;

        .chartName {
          @include c_title_color();
        }

        .el-select {
          margin-left: 16px;
        }

        .el-date-editor {
          margin-left: 16px;
        }
      }
    }
  }
}
</style>
