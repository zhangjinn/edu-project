<template>
  <div class="mapComponent-wrap">
    <div
      ref="mapChart"
      style="height: 600px;
  width: 100%;"
    />
    <div class="scaleBtn">
      <div
        class="iconBtn"
        @click="reduceScale"
      >
        <span class="iconfont iconminus" />
      </div>
      <div
        class="iconBtn"
        @click="addScale"
      >
        <span class="iconfont iconplus" />
      </div>
    </div>
  </div>
</template>

<script>
/**
 * mapComponent create by Administrator
 * createTime 2021/2/4 14:32
 */
import { mapGetters } from 'vuex'
import loadBMap from '@/views/newDaycare/dashBoardHead/component/map'
// import 'echarts/map/js/china'
// import 'echarts/map/js/world'
import 'echarts/extension/bmap/bmap'

export default {
  name: 'MapComponent',
  components: {},
  filters: {},
  mixins: [],
  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {}
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ])
  },
  watch: {},
  created () {
  },
  mounted () {
    loadBMap('OHVREiGHyubUoTEayGpF2WxARdZ3XHGG').then(() => {
      // 配置option
      this.drawLine()
    })
  },
  methods: {
    drawLine () {
      const myChart = this.$echarts.init(this.$refs.mapChart)
      // 清除画布
      myChart.clear()
      myChart.setOption({
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'item',
          formatter: function (param) {
            const data = param.data
            let res = `<div style="padding: 16px 0 0 16px;font-size: 16px;">${data.name}</div>`
            if (data.careFlag && data.guardFlag) {
              res += `<div style="padding: 12px 16px 0 16px;">
                        <span style="display: inline-block;width: 96px;">幼儿园满员数</span>
                        <span style="display: inline-block;width: 48px;">${data.guardFullAmount}</span>
                        <span style="display: inline-block;width: 96px;">托育园满员数</span>
                        <span>${data.careFullAmount}</span>
                        </div>
                        <div style="padding: 4px 16px 0 16px;">
                        <span style="display: inline-block;width: 96px;">幼儿园学员数</span>
                        <span style="display: inline-block;width: 48px;">${data.guardCurrentAmount}</span>
                        <span style="display: inline-block;width: 96px;">托育园学员数</span>
                        <span>${data.careCurrentAmount}</span>
                        </div>`
            } else if (data.careFlag) {
              res += `<div style="padding: 12px 16px 0 16px;">
                        <span style="display: inline-block;width: 96px;">托育园满员数</span>
                        <span style="display: inline-block;width: 48px;">${data.careFullAmount}</span>
                        <span style="display: inline-block;width: 96px;">托育园学员数</span>
                        <span>${data.careCurrentAmount}</span>
                        </div>`
            } else if (data.guardFlag) {
              res += `<div style="padding: 12px 16px 0 16px;">
                        <span style="display: inline-block;width: 96px;">幼儿园满员数</span>
                        <span style="display: inline-block;width: 48px;">${data.guardFullAmount}</span>
                        <span style="display: inline-block;width: 96px;">幼儿园学员数</span>
                        <span>${data.guardCurrentAmount}</span>
                        </div>`
            }
            res += `<div style="padding: 4px 0 16px 16px;">
                        <span style="display: inline-block;width: 96px;">员工总数</span>
                        <span>${data.totalEmployeeAmount}</span>
                        </div>`
            return res
          }
        },
        bmap: {
          center: [104.114129, 37.550339],
          zoom: 5,
          roam: 'move',
          mapStyle: {
            styleJson: [
              {
                featureType: 'water',
                elementType: 'all',
                stylers: {
                  color: '#044161'
                }
              },
              {
                featureType: 'land',
                elementType: 'all',
                stylers: {
                  color: '#004981'
                }
              },
              {
                featureType: 'boundary',
                elementType: 'geometry',
                stylers: {
                  color: '#064f85'
                }
              },
              {
                featureType: 'railway',
                elementType: 'all',
                stylers: {
                  visibility: 'off'
                }
              },
              {
                featureType: 'highway',
                elementType: 'geometry',
                stylers: {
                  color: '#004981'
                }
              },
              {
                featureType: 'highway',
                elementType: 'geometry.fill',
                stylers: {
                  color: '#005b96',
                  lightness: 1
                }
              },
              {
                featureType: 'highway',
                elementType: 'labels',
                stylers: {
                  visibility: 'off'
                }
              },
              {
                featureType: 'arterial',
                elementType: 'geometry',
                stylers: {
                  color: '#004981'
                }
              },
              {
                featureType: 'arterial',
                elementType: 'geometry.fill',
                stylers: {
                  color: '#00508b'
                }
              },
              {
                featureType: 'poi',
                elementType: 'all',
                stylers: {
                  visibility: 'off'
                }
              },
              {
                featureType: 'green',
                elementType: 'all',
                stylers: {
                  color: '#056197',
                  visibility: 'off'
                }
              },
              {
                featureType: 'subway',
                elementType: 'all',
                stylers: {
                  visibility: 'off'
                }
              },
              {
                featureType: 'manmade',
                elementType: 'all',
                stylers: {
                  visibility: 'off'
                }
              },
              {
                featureType: 'local',
                elementType: 'all',
                stylers: {
                  visibility: 'off'
                }
              },
              {
                featureType: 'arterial',
                elementType: 'labels',
                stylers: {
                  visibility: 'off'
                }
              },
              {
                featureType: 'boundary',
                elementType: 'geometry.fill',
                stylers: {
                  color: '#029fd4'
                }
              },
              {
                featureType: 'building',
                elementType: 'all',
                stylers: {
                  color: '#1a5787'
                }
              },
              {
                featureType: 'label',
                elementType: 'all',
                stylers: {
                  visibility: 'off'
                }
              }
            ]
          }
        },
        series: [
          {
            name: '会员',
            type: 'scatter',
            coordinateSystem: 'bmap',
            data: this.convertData(),
            encode: {
              value: 2
            },
            symbolSize: function (val) {
              return 8
            },
            label: {
              formatter: '{b}',
              position: 'right'
            },
            itemStyle: {
              color: '#428dff'
            },
            emphasis: {
              label: {
                show: false
              }
            }
          }
        ]
      })
    },
    convertData () {
      const res = []
      for (var i = 0; i < this.data.length; i++) {
        res.push({
          name: this.data[i].organizationName,
          value: [this.data[i].longitude, this.data[i].latitude],
          guardFullAmount: this.data[i].guardFullAmount,
          careFullAmount: this.data[i].careFullAmount,
          guardCurrentAmount: this.data[i].guardCurrentAmount,
          careCurrentAmount: this.data[i].careCurrentAmount,
          totalEmployeeAmount: this.data[i].totalEmployeeAmount,
          careFlag: this.data[i].careFlag,
          guardFlag: this.data[i].guardFlag
        })
      }
      return res
    },
    reduceScale () {
      const myChart = this.$echarts.init(this.$refs.mapChart)
      const currentZoom = myChart.getOption().bmap[0].zoom
      const increaseAmplitude = 1
      myChart.setOption({
        bmap: {
          zoom: currentZoom - increaseAmplitude
        }
      })
    },
    addScale () {
      const myChart = this.$echarts.init(this.$refs.mapChart)
      const currentZoom = myChart.getOption().bmap[0].zoom
      const increaseAmplitude = 1
      myChart.setOption({
        bmap: {
          zoom: currentZoom + increaseAmplitude
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.mapComponent-wrap {
  position: relative;

  ::v-deep .anchorBL {
    display: none;
  }

  .scaleBtn {
    display: flex;
    position: absolute;
    right: 16px;
    top: 16px;
    z-index: 9;

    .iconBtn {
      background-color: #fff;
      border-radius: 4px;
      box-shadow: 0 4px 8px 0 rgba(34, 34, 34, 0.1);
      cursor: pointer;
      height: 24px;
      line-height: 24px;
      text-align: center;
      width: 24px;

      .iconfont {
        font-size: 12px;
        width: 24px;
      }

      &:not(:first-child) {
        margin-left: 8px;
      }

      &:hover {
        @include etm-color();
      }
    }
  }
}
</style>
