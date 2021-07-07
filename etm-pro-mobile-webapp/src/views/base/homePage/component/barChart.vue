<template>
  <div class="barChart-wrap">
    <div ref="barChart" style="height: 5rem;" />
  </div>
</template>

<script>
/**
 * bar create by Administrator
 * createTime 2020/9/21 16:17
 */
export default {
  name: 'BarChart',
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
    chartData() {
      this.drawLine()
    }
  },
  created() {
  },
  mounted() {
    this.drawLine()
  },
  methods: {
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      const seriesData = []
      const legendData = []
      const legendColor = []
      let zoomStart = 0
      let zoomEnd = 0
      if (this.chartData.xData) {
        const scale = Math.floor(3 / this.chartData.xData.length * 100)
        const day = Math.floor((new Date().getTime() - new Date(this.chartData.xData[0].replace(/\-/g, '/')).getTime()) / (24 * 3600 * 1000))
        const start = Math.floor(day / this.chartData.xData.length * 100)
        if (start + scale > 100) {
          zoomEnd = 100
          zoomStart = 100 - scale
        } else {
          zoomStart = start
          zoomEnd = start + scale
        }
      }
      this.chartData.content.forEach((item, index) => {
        legendData.push(item.title)
        legendColor.push(item.color)
        seriesData.push({
          name: item.title,
          type: 'bar',
          data: item.data,
          barWidth: 12,
          barCategoryGap: 40,
          itemStyle: {
            normal: {
              label: {
                show: true, // 开启显示
                position: 'top', // 在上方显示
                textStyle: { // 数值样式
                  color: '#999',
                  fontSize: 10
                },
                formatter: function(params) {
                  if (params.value > 0) {
                    return params.value
                  } else {
                    return ' '
                  }
                }
              }
            }
          }
        })
      })
      const myChart = this.$echarts.init(this.$refs.barChart)
      // 清除画布
      myChart.clear()
      // 绘制图表
      myChart.setOption({
        title: {},
        tooltip: {
          formatter: function(params) {
            const res = params.marker + '<span>' + params.seriesName + '：</span><span>' + params.value + '</span>'
            return res
          }
        },
        // 设置折现对应的颜色
        color: legendColor,
        legend: {
          data: legendData,
          selectedMode: false,
          top: 'top',
          left: 0,
          icon: 'circle',
          itemWidth: 10, // 设置宽度
          itemHeight: 10, // 设置高度
          itemGap: 24 // 设置间距
        },
        grid: {
          top: '20%',
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
            start: zoomStart,
            end: zoomEnd, // 设置X轴刻度之间的间隔(根据数据量来调整)
            zoomLock: true // 锁定区域禁止缩放(鼠标滚动会缩放,所以禁止)
          },
          {
            type: 'inside',
            xAxisIndex: [0],
            start: zoomStart,
            end: zoomEnd,
            zoomLock: true // 锁定区域禁止缩放
          }
        ],

        xAxis: {
          type: 'category',
          data: this.chartData.xData,
          axisLabel: {
            interval: 0
          },
          nameTextStyle: {
            color: '#666666', // name 字体颜色
            fontSize: 18 // 字体大小
          },
          axisLine: { // 坐标轴
            lineStyle: {
              opacity: 0 // 设置透明度就可以控制显示不显示
            }
          },
          splitLine: { // 网格线
            show: false, // 网格线 （显示竖线）
            lineStyle: {
              color: '#979797'
            }
          },
          axisTick: { // 刻度线
            show: false // 去掉刻度线
          }
        },

        yAxis: {
          type: 'value',
          nameTextStyle: {
            color: '#444e65',
            align: 'left', // 文字水平对齐方式
            verticalAlign: 'middle' // 文字垂直对齐方式
          },
          axisTick: { // 刻度线
            show: false // 去掉刻度线
          },
          axisLine: { // 坐标轴线
            lineStyle: {
              opacity: 0 // 透明度为0
            }
          },
          splitLine: { // 网格线
            show: true, // 网格线
            lineStyle: {
              color: '#EEE'
            }
          }
        },
        series: seriesData
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.bar-wrap {

}
</style>
