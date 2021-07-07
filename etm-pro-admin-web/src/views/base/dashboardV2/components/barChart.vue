<template>
  <div class="barChart-wrap">
    <etm-title :title="config.displayName" :show-line="false" border>
      <div slot="tool" class="tool">
        <el-select v-model="selectType" @change="handleChange">
          <el-option label="按年" value="YEAR" />
          <el-option label="按月" value="MONTH" />
        </el-select>
        <el-date-picker
          v-model="selectDate"
          :type="selectType.toLowerCase()"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          @change="handleChange"
        />
      </div>
    </etm-title>
    <div ref="barChart" style="width: 100%;height: 257px;" />
  </div>

</template>

<script>
/**
 * barChart create by Administrator
 * createTime 2020/9/21 8:58
 */

import { getStartDateAndEndDateByDate } from '@/utils/date'
import { queryDashboardDataChart } from '@/api/base/dashboard'
import { mapGetters } from 'vuex'
import { parseTime } from '@/utils'

export default {
  name: 'DashboardChart',
  components: {},
  filters: {},
  mixins: [],
  props: {
    chartConfig: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      config: {},
      resultData: {},
      selectType: 'YEAR',
      selectDate: parseTime(new Date(), '{y}-{m}-{d}'),
      myChart: null
    }
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ])
  },
  watch: {
    sidebar: {
      handler() {
        this.sizeFun()
      },
      deep: true
    }
  },
  created() {
    try {
      this.chartConfig.config = JSON.parse(this.chartConfig.config)
      this.chartConfig.dataApi = JSON.parse(this.chartConfig.dataApi)
    } catch (e) {
      console.error('this.chartConfig: ', this.chartConfig, e)
    }

    this.config = Object.assign({}, this.chartConfig)
  },
  activated() {
    this.sizeFun()
  },
  mounted() {
    setTimeout(() => {
      this.drawLine()
    }, 0)
    window.addEventListener('resize', this.sizeFun)
  },
  methods: {
    sizeFun() {
      this.$nextTick(() => {
        setTimeout(() => {
          this.myChart.resize()
        }, 100)
      })
    },
    handleChange() {
      this.drawLine()
    },
    drawLine() {
      let startTime = null
      let endTime = null
      if (this.selectType === 'MONTH') {
        const { startDate, endDate } = getStartDateAndEndDateByDate(new Date(this.selectDate))
        startTime = startDate
        endTime = endDate
      } else {
        const year = this.selectDate.split('-')[0]
        startTime = year + '-01-01'
        endTime = year + '-12-31'
      }
      queryDashboardDataChart({
        url: this.config.dataApi.url,
        options: {
          type: this.config.dataApi.params.type,
          status: this.selectType.toUpperCase(),
          startTime, endTime
        }
      }).then(res => {
        const data = res.data
        const config = this.config
        // 基于准备好的dom，初始化echarts实例
        const myChart = this.$echarts.init(this.$refs.barChart)
        this.myChart = myChart
        // 清除画布
        myChart.clear()
        // 绘制图表
        const options = {
          // tooltip: {
          //   formatter: function(params) {
          //     return params.marker + '<span>' + params.seriesName + '：</span><span>' + params.value + '</span>'
          //   }
          // },
          color: config.config.labels.map(i => i.color),
          tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(255,255,255,0.9)',
            textStyle: {
              color: '#333'
            },
            // axisPointer: {
            //   type: 'cross',
            //   label: {
            //     backgroundColor: '#555'
            //   }
            // },
            extraCssText: 'border-radius: 10px'
          },
          legend: {
            bottom: 0,
            selectedMode: false,
            top: 'bottom',
            left: 'center',
            itemWidth: 8, // 设置宽度
            itemHeight: 8, // 设置高度
            itemGap: 40, // 设置间距
            data: config.config.labels.map((item, index) => {
              return {
                name: item.label,
                icon: 'circle',
                textStyle: {
                  color: item.color
                }
              }
            })

          },
          splitLine: {
            show: true,
            lineStyle: { type: 'dashed'// 设置背景为虚线
            }
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
            data: data.map(item => item.date),
            axisLine: {
              lineStyle: {
                color: '#999'
              }
            }
          },
          yAxis: {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: '#999'
              }
            },
            splitLine: {
              lineStyle: {
                color: '#EEEEEE'
              }
            }
          },
          series: [
            {
              name: config.config.labels[0].label,
              barWidth: 14,
              data: data.map(item => item.theLordValues),
              type: config.config.chartType,
              smooth: config.config.chartType === 'line',
              areaStyle: {
                normal: {
                  color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: config.config.labels[0].color
                  }, {
                    offset: 1,
                    color: 'rgba(225,255,255,0.5)'
                  }])
                }
              },
              itemStyle: config.config.chartType === 'bar' && {
                // 柱形图圆角，鼠标移上去效果，如果只是一个数字则说明四个参数全部设置为那么多
                emphasis: {
                  barBorderRadius: 30
                },

                normal: {
                  // 柱形图圆角，初始化效果
                  barBorderRadius: [10, 10, 10, 10],
                  label: {
                    show: false, // 是否展示
                    textStyle: {
                      fontWeight: 'bolder',
                      fontSize: '12',
                      fontFamily: '微软雅黑'
                    }
                  }
                }
              }
            },
            {
              name: config.config.labels[1].label,
              barWidth: 14,
              data: data.map(item => item.timesValues),
              type: config.config.chartType,
              smooth: config.config.chartType === 'line',
              areaStyle: {
                normal: {
                  color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: config.config.labels[1].color
                  }, {
                    offset: 1,
                    color: 'rgba(225,255,255,0.5)'
                  }])
                }
              },
              itemStyle: config.config.chartType === 'bar' && {
                // 柱形图圆角，鼠标移上去效果，如果只是一个数字则说明四个参数全部设置为那么多
                emphasis: {
                  barBorderRadius: 50
                },

                normal: {
                  // 柱形图圆角，初始化效果
                  barBorderRadius: [10, 10, 10, 10],
                  label: {
                    show: false, // 是否展示
                    textStyle: {
                      fontWeight: 'bolder',
                      fontSize: '12',
                      fontFamily: '微软雅黑'
                    }
                  }
                }
              }
            }
          ]
        }
        myChart.setOption(options)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.barChart-wrap {
  .tool {
    display: flex;
    align-items: center;
    justify-content: space-between;

    & > div:not(:last-child) {
      margin-right: 8px;
    }
  }
}
</style>
