<template>
  <div class="barChart-wrap">
    <div ref="barChartRef" style="height: 6rem;" />
  </div>

</template>

<script>
// import { calcStartAndEnd } from '@/views/daycare/homePage/charts/utils'
import { parseTime } from '@/utils/date'

/**
 * barChart create by 油麦菜
 * createTime 2020/11/27 11:10
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
      const lend = []
      const back = []
      this.chartData.data.forEach(item => {
        if (item.bookLendStatus === 'LEND') {
          lend.push(item.count)
        } else {
          back.push(item.count)
        }
      })
      const tmp = [back, lend]
      this.chartData.legendData.forEach((item, index) => {
        seriesData.push(
          {
            type: 'bar',
            name: item,
            label: {
              show: true,
              position: 'top',
              formatter(val) {
                if (val.value === 0) {
                  return ''
                }
              }
            },
            itemStyle: {
              barBorderRadius: 6
            },
            barWidth: 12,
            data: tmp[index]
          }
        )
      })
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
        series: seriesData
      }
      const echats = this.$echarts.init(this.$refs.barChartRef)
      echats.setOption(option)
    }
  }
}
</script>
<style lang="scss" scoped>
.barChart-wrap {

}
</style>
