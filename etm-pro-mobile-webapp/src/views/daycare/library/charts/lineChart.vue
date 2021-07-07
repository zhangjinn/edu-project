<template>
  <div class="lineChart-wrap">
    <div ref="lineChartsRef" style="height: 6rem;" />
  </div>

</template>

<script>
// import { calcStartAndEnd } from '@/views/daycare/homePage/charts/utils'

/**
 * lineChart create by 油麦菜
 * createTime 2020/11/27 10:37
 */
import { parseTime } from '@/utils/date'
export default {
  name: 'LineChart',
  components: {},
  filters: {},
  mixins: [],
  props: {
    chartData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {}
  },
  computed: {},
  watch: {
    chartData: {
      handler() {
        this.init()
      },
      deep: true
    }
  },
  created() {
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const xAxisData = []
      this.chartData.data.forEach(item => {
        if (item.bookLendStatus === 'LEND') {
          xAxisData.push(parseTime(item.date, '{m}-{d}'))
        }
      })
      const seriesData = []
      this.chartData.data.forEach(item => {
        if (item.bookLendStatus === 'LEND') {
          seriesData.push(item.count)
        }
      })
      const options = {
        title: {},
        color: this.chartData.color,
        tooltip: {
          trigger: 'axis',
          formatter: function(params) {
            const res = params[0].marker + '<span>' + params[0].axisValue + '：</span><span>' + params[0].value + '</span>'
            return res
          }
        },
        legend: {
          show: this.chartData.legendData.length > 1,
          selectedMode: false,
          top: 'top',
          left: 0,
          icon: 'circle',
          itemWidth: 10, // 设置宽度
          itemHeight: 10, // 设置高度
          itemGap: 24, // 设置间距
          textStyle: {
            color: '#666666'
          },
          data: this.chartData.legendData
        },
        grid: {
          top: this.chartData.legendData.length > 1 ? '20%' : '30',
          left: '0',
          right: '0',
          bottom: '2%',
          containLabel: true
        },
        dataZoom: [
          { // Y轴固定,让内容滚动
            type: 'slider',
            show: false,
            xAxisIndex: [0],
            // start: 1,
            // end: 13, // 设置X轴刻度之间的间隔(根据数据量来调整)
            // start: calcStartAndEnd().start,
            // end: calcStartAndEnd().end,
            zoomLock: true // 锁定区域禁止缩放(鼠标滚动会缩放,所以禁止)
          },
          {
            type: 'inside',
            xAxisIndex: [0],
            // start: 1,
            // end: 13,
            // start: calcStartAndEnd().start,
            // end: calcStartAndEnd().end,
            zoomLock: true // 锁定区域禁止缩放
          }
        ],
        xAxis: {
          type: 'category',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          data: xAxisData
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              opacity: 0.3
            }
          }
        },
        series: [
          {
            type: 'line',
            smooth: true,
            label: {
              show: true,
              formatter(val) {
                if (val.value === 0) {
                  return ''
                }
              }
            },
            areaStyle: {
              // 设置区域渐进色
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: this.chartData.color[0] // 0% 处的颜色
                }, {
                  offset: 1, color: '#fff' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              }
            },
            data: seriesData
          }
        ]
      }
      const echarts = this.$echarts.init(this.$refs.lineChartsRef)
      echarts.setOption(options)
    }
  }
}
</script>
<style lang="scss" scoped>
.lineChart-wrap {
}
</style>
