<template>
  <div class="barChart-wrap">
    <div ref="barChart" style="width: 100%;height: 300px;" />
  </div>

</template>

<script>
/**
 * barChart create by Administrator
 * createTime 2020/9/21 8:58
 */
import { mapGetters } from 'vuex'

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
    const _this = this
    this.sizeFun = function() {
      setTimeout(function() {
        if (_this.$refs.barChart) {
          const myChart = _this.$echarts.init(_this.$refs.barChart)
          myChart.resize()
        }
      }, 200)
    }
    window.addEventListener('resize', this.sizeFun)
  },
  methods: {
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let zoomEnd = 100
      if (this.chartData.xData.length > 12) {
        zoomEnd = Math.ceil(12 / this.chartData.xData.length)
      }
      const seriesData = []
      const legendData = []
      const legendColor = []
      this.chartData.content.forEach((item, index) => {
        legendData.push({
          name: item.title,
          textStyle: {
            color: item.color
          }
        })
        legendColor.push(item.color)
        seriesData.push({
          name: item.title,
          type: 'bar',
          barWidth: 14,
          data: item.data,
          itemStyle: {
            normal: {
              barBorderRadius: 7
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
          left: 'left',
          icon: 'circle',
          itemWidth: 6, // 设置宽度
          itemHeight: 6, // 设置高度
          itemGap: 24 // 设置间距
        },
        grid: {
          top: '12%',
          left: '0',
          right: '0',
          bottom: '0',
          containLabel: true
        },
        dataZoom: [
          { // Y轴固定,让内容滚动
            type: 'slider',
            show: false,
            xAxisIndex: [0],
            start: 0,
            end: zoomEnd, // 设置X轴刻度之间的间隔(根据数据量来调整)
            zoomLock: true // 锁定区域禁止缩放(鼠标滚动会缩放,所以禁止)
          },
          {
            type: 'inside',
            xAxisIndex: [0],
            start: 0,
            end: zoomEnd,
            zoomLock: true // 锁定区域禁止缩放
          }
        ],

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
          },
          axisLabel: {
            color: '#999999',
            formatter: function(value) {
              // x轴的文字改为竖版显示
              var str = value.split('')
              return str.join('\n')
            }
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
          splitLine: {
            lineStyle: {
              color: '#EEEEEE'
            }
          },
          axisLabel: {
            color: '#999999'
          }
        },
        series: seriesData
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.barChart-wrap {

}
</style>
