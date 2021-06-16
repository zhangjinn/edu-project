<template>
  <div class="barChart-wrap">
    <div
      ref="barChart"
      :style="{width: '400px', height: barHeight + 'px'}"
    />
  </div>
</template>

<script>
/**
 * barChart create by Administrator
 * createTime 2020/11/27 10:37
 */
export default {
  name: 'BarChart',
  components: {},
  filters: {},
  mixins: [],
  props: {
    provinceData: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      barHeight: 0
    }
  },
  computed: {},
  watch: {
    provinceData: {
      handler () {
        this.drawLine()
      },
      deep: true
    }
  },
  created () {
  },
  mounted () {
    this.drawLine()
  },
  methods: {
    drawLine () {
      // 基于准备好的dom，初始化echarts实例
      const seriesData = []
      const labelData = []
      const legendColor = ['#15C5EF']
      seriesData.push({
        type: 'bar',
        barWidth: 12,
        data: [],
        itemStyle: {
          normal: {
            barBorderRadius: [0, 6, 6, 0]
          }
        }
      })
      this.provinceData.forEach(item => {
        if (item.value) {
          labelData.push(item.name)
          seriesData[0].data.push(item.value)
        }
      })
      if (labelData.length) {
        this.barHeight = labelData.length * 50 + 56
      }
      const myChart = this.$echarts.init(this.$refs.barChart)
      // 清除画布
      myChart.clear()
      // 绘制图表
      myChart.setOption({
        title: {},
        tooltip: {
          formatter: function (params) {
            const res = params.marker + '<span>' + params.name + '：</span><span>' + params.value + '人</span>'
            return res
          }
        },
        // 设置折现对应的颜色
        color: legendColor,
        legend: {
          selectedMode: false,
          top: 'bottom',
          left: 'center',
          icon: 'circle',
          itemWidth: 10, // 设置宽度
          itemHeight: 10, // 设置高度
          itemGap: 40 // 设置间距
        },
        grid: {
          top: 16,
          left: 32,
          right: 32,
          bottom: 40,
          containLabel: true
        },

        xAxis: {
          type: 'value',
          nameTextStyle: {
            color: '#666666', // name 字体颜色
            fontSize: 18 // 字体大小
          },
          axisLine: { // 坐标轴
            lineStyle: {
              opacity: 0.2 // 设置透明度就可以控制显示不显示
            }
          },
          splitLine: { // 网格线
            lineStyle: {
              color: '#EEEEEE'
            }
          },
          axisTick: { // 刻度线
            show: false // 去掉刻度线
          },
          axisLabel: {
            color: '#999999'
          }
        },

        yAxis: {
          type: 'category',
          data: labelData,
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
              opacity: 0.2 // 透明度为0
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#EEEEEE'
            }
          },
          axisLabel: {
            color: '#555555'
          }
        },
        series: seriesData
      })
      myChart.resize({ height: this.barHeight })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
