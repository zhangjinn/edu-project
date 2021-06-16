<template>
  <div class="barChart-wrap">
    <div
      ref="barChart"
      style="width: 100%;height: 257px; margin-bottom: 8px"
    />
  </div>
</template>

<script>
/**
 * barChart create by Administrator
 * createTime 2020/9/21 8:58
 */

import { mapGetters } from 'vuex'

// const map = {
//   dataUrl: 'INCOME_AND_EXPENSES',
//   code: '收入/支出',
//   title: '收入/支出',
//   legend: [{ label: '高度画像', color: '#15C691' }, { label: '中度画像', color: '#569EFF' }, { label: '低度画像', color: '#569EFF' }]
// }
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
    }
    // date: {
    //   type: String,
    //   required: true
    // },
    // dateType: {
    //   type: String,
    //   required: true
    // }
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
    // date(val) {
    //   console.log('val: ', val)
    //   this.drawLine()
    // },
    // dateType() {
    //   this.drawLine()
    // },
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
      let barWidth = 20

      if (this.chartData.xData.length > 12) {
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
            console.log(params)
            return params.marker + '<span>' + params.seriesName + '：</span><span>' + params.value + '</span>'
          }
        },
        color: this.chartData.content.map((item, index) => {
          return item.color
        }),
        legend: {
          bottom: 20,
          selectedMode: false,
          left: 'center',
          itemWidth: 10, // 设置宽度
          itemHeight: 10, // 设置高度
          itemGap: 40, // 设置间距
          data: this.chartData.content.map((item, index) => {
            return {
              name: item.title,
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
          bottom: '54',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: this.chartData.xData.map(item => item)
        },
        yAxis: {
          type: 'value',
          splitLine: {
            lineStyle: {
              color: '#EEEEEE'
            }
          },
          minInterval: 1
        },
        series: this.chartData.content.map(cur => {
          return {
            name: cur.title,
            barWidth: barWidth,
            data: cur.data,
            type: 'bar',
            itemStyle: {
              barBorderRadius: 100
            }
          }
        }),
        dataZoom: [
          {
            show: true,
            height: 12,
            bottom: 0,
            startValue: 0,
            endValue: 4
          },
          { // 第一个 dataZoom 组件
            type: 'inside',
            startValue: 0,
            endValue: 4
          }
        ]
      }
      myChart.setOption(options)
    }

    // queryDataChart({
    //   type: this.resultData.dataUrl,
    //   status: this.dateType.toUpperCase(),
    //   startTime,
    //   endTime
    // }).then(res => {
    //   const data = res.data
    //   let barWidth = 24
    //   if (data.length > 12) {
    //     barWidth = 12
    //   }
    //   // 基于准备好的dom，初始化echarts实例
    //   const myChart = this.$echarts.init(this.$refs.barChart)
    //   // 清除画布
    //   myChart.clear()
    //   // 绘制图表
    //   const options = {
    //     tooltip: {
    //       formatter: function(params) {
    //         return params.marker + '<span>' + params.seriesName + '：</span><span>' + params.value + '</span>'
    //       }
    //     },
    //     color: ['#15C691', '#569EFF'],
    //     legend: {
    //       bottom: 0,
    //       selectedMode: false,
    //       top: 'bottom',
    //       left: 'center',
    //       itemWidth: 10, // 设置宽度
    //       itemHeight: 10, // 设置高度
    //       itemGap: 40, // 设置间距
    //       data: map.legend.map((item, index) => {
    //         return {
    //           name: item.label,
    //           icon: 'circle',
    //           textStyle: {
    //             // color: item.color
    //           }
    //         }
    //       })
    //
    //     },
    //     grid: {
    //       top: '10%',
    //       left: '0',
    //       right: '0',
    //       bottom: '12%',
    //       containLabel: true
    //     },
    //     xAxis: {
    //       type: 'category',
    //       data: data.map(item => item.date)
    //     },
    //     yAxis: {
    //       type: 'value',
    //       splitLine: {
    //         lineStyle: {
    //           color: '#EEEEEE'
    //         }
    //       }
    //     },
    //     series: [
    //       {
    //         name: map.legend[0].label,
    //         barWidth: barWidth,
    //         data: data.map(item => item.theLordValues),
    //         type: 'bar'
    //       },
    //       {
    //         name: map.legend[1].label,
    //         barWidth: barWidth,
    //         data: data.map(item => item.timesValues),
    //         type: 'bar'
    //       },
    //       {
    //         name: map.legend[2].label,
    //         barWidth: barWidth,
    //         data: data.map(item => item.timesValues),
    //         type: 'bar'
    //       }
    //     ]
    //   }
    //   myChart.setOption(options)
    // })

  }
}
</script>
<style lang="scss" scoped>
.barChart-wrap {

}
</style>
