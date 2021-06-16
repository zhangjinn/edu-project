<template>
  <div class="barChart-wrap">
    <div
      ref="barChart"
      style="height: 257px;
  width: 100%;"
    />
  </div>
</template>

<script>
/**
 * barChart create by Administrator
 * createTime 2020/9/21 8:58
 */

import { getStartDateAndEndDateByDate } from '@/utils/date'
import { queryDataChart } from '@/api/newDaycare/dashboard'
import { mapGetters } from 'vuex'

const map = [
  {
    dataUrl: 'INCOME_AND_EXPENSES',
    code: '收入/支出',
    title: '收入/支出',
    legend: [{ label: '收入', color: '#15C691' }, { label: '支出', color: '#569EFF' }]
  },
  {
    dataUrl: 'HEALTH_EXAMINATION',
    code: '健康检查',
    title: '健康检查',
    legend: [{ label: '正常', color: '#15C691' }, { label: '异常', color: '#569EFF' }]
  },
  {
    dataUrl: 'CONSUME_COURSE_AMOUNT',
    code: '消课金额',
    title: '消课金额',
    legend: [{ label: '金额', color: '#15C691' }, { label: '消课', color: '#569EFF' }]
  },
  {
    dataUrl: 'CUSTOMER_CONVERSION',
    code: '客户转化',
    title: '客户转化',
    legend: [{ label: '跟进', color: '#15C691' }, { label: '成交', color: '#569EFF' }]
  },
  {
    dataUrl: 'ATTENDANCE',
    code: '考勤统计',
    title: '考勤统计',
    legend: [{ label: '出勤', color: '#15C691' }, { label: '缺勤', color: '#569EFF' }]
  }
]
export default {
  name: 'BarChart',
  components: {},
  filters: {},
  mixins: [],
  props: {
    chartData: {
      type: Object,
      default () {
        return {}
      }
    },
    date: {
      type: String,
      required: true
    },
    dateType: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      resultData: {}
    }
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ])
  },
  watch: {
    chartData () {
      this.drawLine()
    },
    date (val) {
      console.log('val: ', val)
      this.drawLine()
    },
    dateType () {
      this.drawLine()
    },
    sidebar: {
      handler () {
        this.sizeFun()
      },
      deep: true
    }
  },
  created () {
  },
  activated () {
    this.sizeFun()
  },
  mounted () {
    setTimeout(() => {
      this.drawLine()
    }, 0)
    const _this = this
    this.sizeFun = function () {
      setTimeout(function () {
        if (_this.$refs.barChart) {
          const myChart = _this.$echarts.init(_this.$refs.barChart)
          myChart.resize()
        }
      }, 200)
    }
    window.addEventListener('resize', this.sizeFun)
  },
  methods: {
    drawLine () {
      let startTime = null
      let endTime = null
      if (this.dateType === 'month') {
        const { startDate, endDate } = getStartDateAndEndDateByDate(new Date(this.date))
        startTime = startDate
        endTime = endDate
      } else {
        const year = this.date.split('-')[0]
        startTime = year + '-01-01'
        endTime = year + '-12-31'
      }
      const find = map.find(item => item.code === this.chartData.code)
      this.resultData = Object.assign(this.chartData, find)

      queryDataChart({
        type: this.resultData.dataUrl,
        status: this.dateType.toUpperCase(),
        startTime,
        endTime
      }).then(res => {
        const data = res.data
        let barWidth = 24
        if (data.length > 12) {
          barWidth = 12
        }
        // 基于准备好的dom，初始化echarts实例
        const myChart = this.$echarts.init(this.$refs.barChart)
        // 清除画布
        myChart.clear()
        // 绘制图表
        const options = {
          tooltip: {
            formatter: function (params) {
              return params.marker + '<span>' + params.seriesName + '：</span><span>' + params.value + '</span>'
            }
          },
          color: ['#15C691', '#569EFF'],
          legend: {
            bottom: 0,
            selectedMode: false,
            top: 'bottom',
            left: 'center',
            itemWidth: 10, // 设置宽度
            itemHeight: 10, // 设置高度
            itemGap: 40, // 设置间距
            data: find.legend.map((item, index) => {
              return {
                name: item.label,
                icon: 'circle',
                textStyle: {
                  // color: item.color
                }
              }
            })

          },
          grid: {
            top: '10%',
            left: '0',
            right: '0',
            bottom: '12%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: data.map(item => item.date)
          },
          yAxis: {
            type: 'value',
            splitLine: {
              lineStyle: {
                color: '#EEEEEE'
              }
            }
          },
          series: [
            {
              name: find.legend[0].label,
              barWidth: barWidth,
              data: data.map(item => item.theLordValues),
              type: 'bar'
            },
            {
              name: find.legend[1].label,
              barWidth: barWidth,
              data: data.map(item => item.timesValues),
              type: 'bar'
            }
          ]
        }
        myChart.setOption(options)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
