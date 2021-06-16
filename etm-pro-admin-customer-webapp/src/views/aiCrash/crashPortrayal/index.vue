<template>
  <div class="crash-portrayal-wrap">
    <div class="ai-crash">
      <crash-data
        ref="crashDataRef"
        :portrayal-list="portrayalList"
        :disable="drawPortrayalStatus === 'drawing'"
        @exportSuccess="exportSuccess"
        @success="init()"
      />
      <div class="crash-content">
        <div class="component">
          <div class="position">
            <i class="iconfont iconlocation" />
            <span>{{ address }}</span>
          </div>
          <template v-if="drawPortrayalStatus === 'start'">
            <choose-batch
              ref="chooseBatchRef"
              @emitFormData="emitFormData"
            />
          </template>
          <template v-else-if="drawPortrayalStatus === 'drawing'">
            <div class="drawing">
              <span>{{ `客户群画像中...${timekeeping}s  ${percent}%` }}</span>
            </div>
          </template>
          <template v-else-if="drawPortrayalStatus === 'end'">
            <div class="draw-end">
              <div class="statistic">
                碰客结果统计
              </div>
              <template v-for="(value, key, index) in crashOverData">
                <div
                  :key="index"
                  class="result"
                >
                  <span class="label">{{ setText(key) }}：</span>
                  <span class="count">{{ value }}</span>
                </div>
              </template>
            </div>
          </template>
        </div>
        <div class="content">
          <tag-card
            :portrayal-list="portrayalList"
            :draw-portrayal-status.sync="drawPortrayalStatus"
            :can-draw-portrayal="canDrawPortrayal"
            :portrayal-text="portrayalText"
            :choose-batch-form-data="chooseBatchFormData"
            :el-form-ref="elFormRef"
            @drawPortrayal="drawPortrayal"
            @crashOver="crashOver"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
   * index create by 油麦菜
   * createTime 2021/1/29 13:40
   */
import crashData from './components/crashData'
import chooseBatch from './components/chooseBatch'
import tagCard from './components/tagCard'
import { queryAICrashStatistics, queryAreaByCode } from '@/api/aiCrash'
import { getEnterpriseCurrent } from '@/api/base/base'

export default {
  name: 'Index',
  components: {
    crashData,
    chooseBatch,
    tagCard
  },
  filters: {},
  mixins: [],
  props: {},
  data () {
    return {
      component: {
        chooseBatch: chooseBatch
      },
      type: 'chooseBatch',
      canDrawPortrayal: false,
      drawPortrayalStatus: 'start',
      crashOverData: {
        itemTotal: 0,
        highItemTotal: 0,
        middleItemTotal: 0,
        lowItemTotal: 0,
        noItemTotal: 0
      },
      chooseBatchFormData: {},
      portrayalList: {
        remainNum: 0,
        unPortrayedTotal: 0,
        portrayedTotal: 0,
        highItemTotal: 0,
        middleItemTotal: 0,
        lowItemTotal: 0
      },
      batchId: 0,
      doTouchTotal: 0,
      timekeeping: 0,
      percent: 0,
      timer: null,
      elFormRef: null,
      address: ''
    }
  },
  computed: {
    portrayalText () {
      let text = '开始画像'
      if (this.drawPortrayalStatus === 'start') {
        text = '开始画像'
      } else if (this.drawPortrayalStatus === 'drawing') {
        text = ''
      } else if (this.drawPortrayalStatus === 'end') {
        text = '重新开始'
      }
      return text
    }
  },
  watch: {
    drawPortrayalStatus (val) {
      if (val === 'start') {
        this.$nextTick(_ => {
          this.elFormRef = this.$refs.chooseBatchRef.$children[0]
        })
      }
    }
  },
  created () {
  },
  mounted () {
    this.elFormRef = this.$refs.chooseBatchRef.$children[0]
    this.init()
  },
  methods: {
    init () {
      getEnterpriseCurrent().then(res => {
        const { areaCode } = res.data
        queryAreaByCode({ code: areaCode }).then(r => {
          console.log(r.data)
          const { provinceName, cityName, countyName } = r.data
          this.address = `${provinceName}${cityName || ''}${countyName || ''}`
        })
      })
      queryAICrashStatistics().then(res => {
        this.portrayalList = Object.fromEntries(Object.entries(res.data).filter(item => {
          return ['remainNum', 'unPortrayedTotal', 'portrayedTotal'].includes(item[0])
        }))
      })
    },
    emitFormData (val) {
      this.chooseBatchFormData = val
      this.canDrawPortrayal = !!this.chooseBatchFormData.batchId
    },
    drawPortrayal () {
      // console.log(this.drawPortrayalStatus)
      // if (!this.canDrawPortrayal) {
      //   return this.$message({
      //     type: 'info',
      //     message: '请选择批次'
      //   })
      // }
      if (this.drawPortrayalStatus === 'start') {
        this.drawPortrayalStatus = 'drawing'
        const speed = 333
        const time = Date.now()
        this.timer && clearInterval(this.timer)
        this.timer = setInterval(_ => {
          this.timekeeping = Math.floor((Date.now() - time) / 1000)
          this.percent = Math.floor((Date.now() - time) / speed)
          // TODO:需要单独整个99%，当后端返回结束条件时，才能跳100%
          if (this.drawPortrayalStatus === 'end') {
            clearInterval(this.timer)
            this.percent = 100
            this.drawPortrayalStatus = 'end'
            return this.$message({
              type: 'success',
              message: '画像完成'
            })
          } else {
            if (this.percent >= 100) {
              this.percent = 99
            }
          }
        }, 30)
      } else if (this.drawPortrayalStatus === 'drawing') {
        this.$message({
          type: 'info',
          message: '画像中，请稍等...'
        })
      } else if (this.drawPortrayalStatus === 'end') {
        this.drawPortrayalStatus = 'start'
        this.canDrawPortrayal = false
        this.timekeeping = 0
        this.percent = 0
      }
    },
    crashOver (val) {
      if (val) {
        this.crashOverData.itemTotal = val.itemTotal
        this.crashOverData.highItemTotal = val.highItemTotal
        this.crashOverData.middleItemTotal = val.middleItemTotal
        this.crashOverData.lowItemTotal = val.lowItemTotal
        this.crashOverData.noItemTotal = val.noItemTotal
      } else {
        this.crashOverData = {
          itemTotal: 0,
          highItemTotal: 0,
          middleItemTotal: 0,
          lowItemTotal: 0,
          noItemTotal: 0
        }
      }
      this.drawPortrayalStatus = 'end'
      this.init()
    },
    setText (val) {
      switch (val) {
        case 'itemTotal':
          return '本次碰客'
        case 'highItemTotal':
          return '高度符合'
        case 'middleItemTotal':
          return '中度符合'
        case 'lowItemTotal':
          return '低度符合'
        case 'noItemTotal':
          return '不符合'
      }
    },
    exportSuccess () {
      this.$refs.chooseBatchRef && this.$refs.chooseBatchRef.init()
    }
  }
}
</script>
<style lang="scss" scoped>
  .crash-portrayal-wrap {
    //padding: 16px 0 16px;
    min-width: 1500px;
    min-height: 770px;
    .ai-crash {
      padding: 0 16px 16px;
      display: flex;
      flex-direction: column;
      width: 100%;
      height: calc(100vh - 116px);
      min-height: 810px;
      background: url("../../../assets/images/crashPortrayalBg.png") no-repeat;
      background-size: 100% 100%;
      .crash-content {
        position: relative;
        display: flex;
        flex-direction: column;
        flex: 1;
        background: url("../../../assets/images/crash-content-bg.png") no-repeat;
        background-size: 100% 100%;
        &:after {
          position: absolute;
          right: 10px;
          top: 12px;
          content: '';
          display: block;
          width: 38.7%;
          height: 35px;
          background: url("../../../assets/images/crash-right-tag.png") no-repeat;
          background-size: 100% 100%;
        }
        .component {
          position: relative;
          margin: 60px 0 0;
          .position {
            position: absolute;
            right: 33px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 14px;
            font-weight: 400;
            color: #FFFFFF;

            span {
              line-height: 24px;
            }
          }
          .drawing {
            margin-left: 25px;
            padding-left: 15px;
            width: 457px;
            height: 40px;
            line-height: 40px;
            font-size: 14px;
            font-weight: 700;
            color: #FFFFFF;
            background: url("../../../assets/images/drawingPortrayal.png") no-repeat;
            background-size: 100% 100%;
          }
          .draw-end {
            display: flex;
            align-items: center;
            margin-left: 25px;
            width: 884px;
            height: 40px;
            background: url("../../../assets/images/drawPortrayalEnd.png") no-repeat;
            background-size: 100% 100%;
            .statistic {
              padding: 0 16px;
              font-size: 14px;
              font-weight: 700;
              color: #FFBE31;
            }
            .result {
              padding: 0 16px;
              display: flex;
              .label {
                font-size: 14px;
                font-weight: 400;
                color: #FFFFFF;
              }
              .count {
                font-size: 14px;
                font-weight: 700;
                color: #FFBE31;
              }
            }
          }
        }
        .content {
          flex: 1;
          min-height: 560px;
        }
      }
    }
  }
</style>
