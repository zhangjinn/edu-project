<template>
  <div class="lineChart-wrap">
    <div ref="lineChart" style="width: 100%;height: 300px;" />
  </div>

</template>

<script>
/**
 * cash create by Administrator
 * createTime 2020/9/16 17:22
 */
import { mapGetters } from 'vuex'

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
  computed: {
    ...mapGetters([
      'sidebar'
    ])
  },
  watch: {
    chartData() {
      this.drawLine()
    },
    sidebar: {
      handler() {
        this.sizeFun()
      },
      deep: true
    }
  },
  created() {
  },
  activated() {
    this.sizeFun()
  },
  mounted() {
    this.drawLine()
    window.addEventListener('resize', this.sizeFun)
  },
  methods: {
    sizeFun() {
      setTimeout(() => {
        if (this.$refs.lineChart) {
          const myChart = this.$echarts.init(this.$refs.lineChart)
          myChart.resize()
        }
      }, 200)
    },
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      const seriesData = []
      const legendData = []
      const legendColor = []
      this.chartData.content && this.chartData.content.forEach((item, index) => {
        legendData.push(item.title)
        legendColor.push(item.color)
        seriesData.push({
          name: item.title,
          type: 'line',
          smooth: true,
          symbol: 'circle', // 描点形状
          symbolSize: 0, // 标记的大小
          sampling: 'average',
          // label: { // 显示值
          //   show: true,
          //   formatter: function(params) {
          //     if (params.value === 0) {
          //       return ''
          //     }
          //   }
          // },
          areaStyle: {
            normal: {
              color: {
                type: 'linear', // 设置线性渐变
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: item.color // 0% 处的颜色
                }, {
                  offset: 1, color: 'white' // 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
              }
            }
          },
          data: item.data
        })
      })
      const myChart = this.$echarts.init(this.$refs.lineChart)
      // 清除画布
      myChart.clear()
      // 绘制图表
      myChart.setOption({
        title: {
          // text: '流量趋势图'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            label: {
              backgroundColor: '#6a7985'
            }
          },
          formatter: function(params) {
            const res = params[0].marker + '<span>' + params[0].axisValue + '：</span><span>' + params[0].value + '</span>'
            return res
          }
        },
        // 设置折现对应的颜色
        color: legendColor,
        legend: {
          show: false,
          data: legendData,
          selectedMode: false,
          top: 'bottom',
          left: 'center',
          icon: 'circle',
          itemWidth: 10, // 设置宽度
          itemHeight: 10, // 设置高度
          itemGap: 40 // 设置间距
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
          data: this.chartData.xData,
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
          // min: this.evalData.yData.min, // 最小刻度
          // max: this.evalData.yData.max, // 最大刻度
          type: 'value',
          // name: ''         ', //是基于Y轴线对齐，用空格站位让坐标轴名称与刻度名称对齐
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
.cash-wrap {

}
</style>
