<template>
  <div class="bar-chart">
    <div ref="barChart" style="height: 6rem;" />
  </div>
</template>
<script>
import { calcStartAndEnd } from './utils'
export default {
  name: 'BarChart',
  props: {
    chartData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  watch: {
    chartData: {
      handler() {
        this.init()
      },
      deep: true
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const axisData = this.chartData.data.map(item => {
        return item.date.substr(5)
      })
      const theLordValues = this.chartData.data.map(item => {
        return item.theLordValues
      })
      const timesValues = this.chartData.data.map(item => {
        return item.timesValues
      })
      const tmpData = [theLordValues, timesValues]
      const seriesData = []
      this.chartData.legendData.forEach((item, index) => {
        seriesData.push({
          type: 'bar',
          name: item,
          barWidth: 12,
          label: {
            show: true,
            position: 'top',
            color: '#000',
            formatter: function(params) {
              if (params.value > 0) {
                return params.value
              } else {
                return ' '
              }
            }
          },
          data: tmpData[index]
        })
      })
      // 有些柱状图是一条柱子，有的两条
      const option = {
        title: {},
        color: this.chartData.color,
        tooltip: {
          formatter: function(params) {
            const res = params.marker + '<span>' + params.seriesName + '：</span><span>' + params.value + '</span>'
            return res
          }
        },
        legend: {
          show: this.chartData.legendData.length > 1,
          data: this.chartData.legendData,
          selectedMode: false,
          top: 'top',
          left: 0,
          icon: 'circle',
          itemWidth: 10, // 设置宽度
          itemHeight: 10, // 设置高度
          itemGap: 24, // 设置间距
          textStyle: {
            color: '#666666'
          }
        },
        grid: {
          top: this.chartData.legendData.length > 1 ? '20%' : '20',
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
            start: calcStartAndEnd().start,
            end: calcStartAndEnd().end,
            zoomLock: true // 锁定区域禁止缩放(鼠标滚动会缩放,所以禁止)
          },
          {
            type: 'inside',
            xAxisIndex: [0],
            // start: 1,
            // end: 13,
            start: calcStartAndEnd().start,
            end: calcStartAndEnd().end,
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
          data: axisData
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
        series: seriesData
      }
      const myChart = this.$echarts.init(this.$refs.barChart)
      myChart.clear()
      myChart.setOption(option)
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.bar-chart {

}
</style>
