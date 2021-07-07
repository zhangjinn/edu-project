<template>
  <div class="etmBar">
    <div v-if="data.title && data.unit" class="chartLegend">
      <span>{{ data.title }}</span>
      <span>({{ data.unit }})</span>
    </div>
    <div ref="chart" class="echartBar" :style="{ width: '100%', height: height + 'px' }" />
  </div>
</template>
<script>
// 引入 ECharts 主模块

export default {
  name: 'EtmPanel',
  props: {
    data: {
      type: Object,
      default: function() {
        return {
          title: '',
          unit: '',
          names: [],
          nums: []
        }
      }
    },
    grid: {
      type: Object,
      default: function() {
        return {
          left: '0',
          right: '0',
          top: 30,
          bottom: 30
        }
      }
    },
    colorList: {
      type: Array,
      default: function() {
        return ['#BA98FF', '#FF97BC', '#FF9999', '#BA98FF']
      }
    },
    height: {
      type: String,
      default: '140'
    },
    yAxisShow: {
      type: Boolean,
      default: false
    },
    yAxisLimits: {
      yAxisLimits: Array
    },
    barTextTipShow: { // 柱状图顶部数字提示
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      defaultTextColor: '#555',
      defaultDotSize: 5,
      splitLineColor: ['#FF9999', '#FFB78A', '#FCE386', '#99C7FF', '#FF97BC', '#BA98FF', '#fff']
    }
  },
  mounted() {
    this.drawLine()
  },
  methods: {
    drawLine() {
      const that = this
      // 基于准备好的dom，初始化echarts实例
      const myChart = this.$echarts.init(this.$refs.chart)
      // 绘制图表
      const optios = {
        grid: that.grid,
        xAxis: {
          type: 'category',
          data: that.data.names,
          axisTick: {
            show: false
          },
          axisLine: {
            show: false,
            lineStyle: {
              // color: '#00ffee'
            }
          },
          axisLabel: {
            interval: 0,
            formatter: function(value) {
              let result = '' // 拼接加\n返回的类目项
              const maxLength = 2 // 每项显示文字个数
              const valLength = value.length// X轴类目项的文字个数
              if (valLength > 3) {
                const rowNumber = Math.ceil(valLength / maxLength) // 类目项需要换行的行数
                if (rowNumber > 1) { // 如果文字大于3,
                  for (let i = 0; i < rowNumber; i++) {
                    let temp = ''// 每次截取的字符串
                    const start = i * maxLength// 开始截取的位置
                    const end = start + maxLength// 结束截取的位置
                    temp = value.substring(start, end) + '\n'
                    result += temp // 拼接生成最终的字符串
                  }
                  return result
                }
              } else {
                return value
              }
            },
            // 给坐标名添加颜色属性
            textStyle: {
              color: function(params, index) {
                if (that.yAxisShow) {
                  return that.defaultTextColor
                } else {
                  const colorList = that.colorList
                  return colorList[index]
                }
              }
            }
          }
        },
        yAxis: {
          type: 'value',
          show: this.yAxisShow, // 整体坐标轴
          axisTick: { // y轴坐标点
            show: false
          },
          axisLine: { // y轴线
            show: false
          },
          splitLine: { // 网格线
            show: true,
            lineStyle: {
              color: that.splitLineColor,
              width: 1,
              type: 'solid'
            }
          },
          axisLabel: {
            textStyle: {
              color: that.defaultTextColor
            },
            formatter: function(value) {
              const texts = []
              if (value >= 0 && value < 1) {
                texts.push('{a|} 加强干预')
              } else if (value >= 1 && value < 2) {
                texts.push('{b|} 适当干预')
              } else if (value >= 2 && value < 3) {
                texts.push('{c|} 加强关注')
              } else if (value >= 3 && value < 4) {
                texts.push('{d|} 能力达标')
              } else if (value >= 4 && value < 5) {
                texts.push('{e|} 优于同龄')
              } else if (value >= 5 && value < 6) {
                texts.push('{f|} 能力高标')
              }
              return texts
            },
            rich: {
              a: {
                backgroundColor: that.splitLineColor[0],
                width: that.defaultDotSize,
                height: that.defaultDotSize,
                borderRadius: that.defaultDotSize
              },
              b: {
                backgroundColor: that.splitLineColor[1],
                width: that.defaultDotSize,
                height: that.defaultDotSize,
                borderRadius: that.defaultDotSize
              },
              c: {
                backgroundColor: that.splitLineColor[2],
                width: that.defaultDotSize,
                height: that.defaultDotSize,
                borderRadius: that.defaultDotSize
              },
              d: {
                backgroundColor: that.splitLineColor[3],
                width: that.defaultDotSize,
                height: that.defaultDotSize,
                borderRadius: that.defaultDotSize
              },
              e: {
                backgroundColor: that.splitLineColor[4],
                width: that.defaultDotSize,
                height: that.defaultDotSize,
                borderRadius: that.defaultDotSize
              },
              f: {
                backgroundColor: that.splitLineColor[5],
                width: that.defaultDotSize,
                height: that.defaultDotSize,
                borderRadius: that.defaultDotSize
              }
            }

          }
        },
        series: [{
          data: that.data.nums,
          type: 'bar',
          barWidth: '30%', // 柱图宽度
          itemStyle: {
            normal: {
              // 这里是重点
              label: {
                show: that.barTextTipShow,		// 开启显示
                position: 'top',	// 在上方显示
                textStyle: { // 数值样式
                  fontSize: 14
                }
              },
              color: function(params) {
                // 注意，如果颜色太少的话，后面颜色不会自动循环，最好多定义几个颜色
                const colorList = that.colorList
                let index
                // 给大于颜色数量的柱体添加循环颜色的判断
                if (params.dataIndex >= colorList.length) {
                  index = params.dataIndex - colorList.length
                  return colorList[index]
                }
                return colorList[params.dataIndex]
              },
              barBorderRadius: [10, 10, 0, 0]
            }
          }
        }]
      }
      // console.log(optios)
      if (this.yAxisLimits) {
        optios.yAxis.min = this.yAxisLimits[0]
        optios.yAxis.max = this.yAxisLimits[1]
      }
      myChart.setOption(optios)
    }
  }
}
</script>

<style lang="scss" scoped>
    .etmBar{
      .chartLegend{
        display: flex;
        justify-content: space-between;
        padding: 14px 10px 0;
        span:first-child{
          background: #FF78A7;
          padding: 4px 7px;
          border-radius: 0 15px 15px 15px;
          font-size:12px;
          color: $white;
          display: flex;
          align-items: center;
        }
        span:last-child{
          padding: 4px 7px;
          font-size:12px;
          color: #FF78A7;
          display: flex;
          align-items: center;
        }
      }

    }

</style>
