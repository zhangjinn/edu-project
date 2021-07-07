<template>
  <div class="line-chart">
    <div ref="lineChart" style="height: 6rem;" />
  </div>
</template>

<script>
import { calcStartAndEnd } from './utils'
export default {
  name: 'LineChart',
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
      const seriesData = []
      // 该`净现金流`数据较特殊，需单独处理
      if (this.chartData.title === '净现金流') {
        const tmp = this.chartData.data.map(item => {
          return item.theLordValues - item.timesValues
        })
        seriesData.push({
          type: 'line',
          name: this.chartData.legendData[0],
          itemStyle: {
            normal: {
              label: {
                show: true,
                formatter: function(params) {
                  if (!params.data) {
                    return ''
                  }
                }
              }
            }
          },
          smooth: true,
          sampling: 'average',
          areaStyle: {
            normal: {
              color: {
                type: 'linear', // 设置线性渐变
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: this.chartData.color[0] // 0% 处的颜色
                }, {
                  offset: 1, color: 'white' // 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
              }
            }
          },
          data: tmp
        })
      } else {
        const theLordValues = this.chartData.data.map(item => {
          return item.theLordValues
        })
        const timesValues = this.chartData.data.map(item => {
          return item.timesValues
        })
        const values = [theLordValues, timesValues]
        this.chartData.legendData.forEach((item, index) => {
          seriesData.push({
            type: 'line',
            name: this.chartData.legendData[index],
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  formatter: function(params) {
                    if (!params.data) {
                      return ''
                    }
                  }
                }
              }
            },
            smooth: true,
            sampling: 'average',
            areaStyle: {
              normal: {
                color: {
                  type: 'linear', // 设置线性渐变
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0, color: this.chartData.color[0] // 0% 处的颜色
                  }, {
                    offset: 1, color: 'white' // 100% 处的颜色
                  }],
                  globalCoord: false // 缺省为 false
                }
              }
            },
            data: values[index]
          })
        })
      }
      const option = {
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
      const myChart = this.$echarts.init(this.$refs.lineChart)
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
.line-chart {

}
</style>
