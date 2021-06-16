<template>
  <div class="chinaMap-wrap">
    <div
      ref="chinaMap"
      style="height: 280px;
  width: 400px;"
    />
  </div>
</template>

<script>
/**
 * chinaMap create by Administrator
 * createTime 2020/11/18 15:36
 */
import 'echarts/map/js/china'

export default {
  name: 'ChinaMap',
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
    return {}
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
      const myChart = this.$echarts.init(this.$refs.chinaMap)
      // 清除画布
      myChart.clear()
      // 绘制图表
      myChart.setOption({
        backgroundColor: '#FFFFFF',
        title: {
          subtext: '',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: function (params) {
            let value = 0
            if (params.value && !isNaN(params.value)) {
              value = params.value
            }
            const res = '<span>' + params.name + '：</span><span>' + value + '人</span>'
            return res
          }
        },

        // 左侧小导航图标
        // visualMap: {
        //   show: false,
        //   x: 'left',
        //   y: 'center',
        //   splitList: [
        //     { start: 0, end: 1000 }
        //   ],
        //   color: ['#F6F4F2']
        // },

        // 配置属性
        series: [{
          name: '学员',
          type: 'map',
          mapType: 'china',
          roam: false, // 缩放拖动地图
          label: {
            normal: {
              show: false // 省份名称
            },
            emphasis: {
              show: false
              // color: '' // 悬浮字体颜色
            }
          },
          itemStyle: {
            areaColor: '#F6F4F2', // 地图背景色
            borderColor: '#AAAAAA',
            emphasis: {
              areaColor: 'rgba(21, 197, 239, .12)', // 悬浮背景色
              borderColor: '#15C5EF' // 悬浮边框色
            }
          },
          data: this.provinceData // 数据
        }]
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
