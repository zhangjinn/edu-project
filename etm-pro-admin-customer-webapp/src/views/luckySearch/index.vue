<template>
  <div class="index-wrap">
    <div class="bg">
      <div class="top-content">
        <div class="top-tag">
          <div class="left-tag" />
          <div class="time-tag">
            <span v-if="!isOver">距离下次收客时间还有</span>
            <span v-else>可收取客户</span>
            <div
              v-if="minutes && seconds"
              class="container"
            >
              <div class="time">
                {{ hour.slice(0, 1) }}
              </div>
              <div class="time">
                {{ hour.slice(1, 2) }}
              </div>
              <div class="colon">
                :
              </div>
              <div class="time">
                {{ minutes.slice(0, 1) }}
              </div>
              <div class="time">
                {{ minutes.slice(1, 2) }}
              </div>
              <div class="colon">
                :
              </div>
              <div class="time">
                {{ seconds.slice(0, 1) }}
              </div>
              <div class="time">
                {{ seconds.slice(1, 2) }}
              </div>
            </div>
          </div>
          <div class="right-tag" />
        </div>
        <div class="tip">
          每次收客后都会刷新冷却时间，当冷却时间为0时才可收客
        </div>
      </div>
      <div class="content">
        <div class="left-container">
          <earth />
          <div class="card-container">
            <customer-card
              :cards-prop="cardsData"
              :is-over="isOver"
              @getCustomerEmit="handleGetCustomer"
              @emptyData="emptyData"
            />
          </div>
        </div>
        <div class="right-container">
          <customer-table
            type="OUTER"
            :statistical="statistical"
            :table-data="tableData"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
   * index create by 油麦菜
   * createTime 2021/1/11 10:14
   */
import earth from '@/views/luckySearch/components/earth'
import customerTable from '@/views/luckySearch/components/customerTable'
import customerCard from '@/views/luckySearch/components/customerCard'
import {
  queryOuterCustomer,
  createOuterCustomer,
  queryOuterCustomerList,
  queryStatistical
} from '@/api/luckySearch'

export default {
  name: 'Index',
  components: {
    earth,
    customerTable,
    customerCard
  },
  filters: {},
  mixins: [],
  props: {},
  data () {
    return {
      nowTime: null,
      nextTakeTime: null,
      hour: '00',
      minutes: '00',
      seconds: '00',
      statistical: {},
      tableData: [],
      cardsData: [],
      isOver: true
    }
  },
  computed: {
  },
  watch: {
  },
  created () {
  },
  mounted () {
    this.init()
  },
  activated () {
    this.countDown()
  },
  methods: {
    init () {
      queryOuterCustomer().then(res => {
        this.cardsData = res.data
      })
      queryOuterCustomerList().then(res => {
        this.tableData = res.data
      })
      this.queryStatic()
    },
    queryStatic () {
      queryStatistical({ type: 'OUTER' }).then(res => {
        this.statistical = res.data
        this.nextTakeTime = res.data.nextTakeTime
        this.nowTime = res.data.nowTime
        this.countDown()
      })
    },
    countDown () {
      if (this.nextTakeTime) {
        this.isOver = false
        const timer = setInterval(() => {
          // const nowTimestamp = Date.now()
          const subTimestamp = this.nextTakeTime - this.nowTime
          if (subTimestamp <= 0) {
            timer && clearInterval(timer)
            this.$message({
              type: 'info',
              message: '可以获客啦~'
            })
            this.nowTime = null
            this.nextTakeTime = null
            this.isOver = true
          } else {
            const hour = Math.floor(subTimestamp / 1000 / 60 / 60 % 24)
            const minute = Math.floor(subTimestamp / 1000 / 60 % 60)
            const second = Math.floor(subTimestamp / 1000 % 60)
            this.hour = String(hour).padStart(2, '0')
            this.minutes = String(minute).padStart(2, '0')
            this.seconds = String(second).padStart(2, '0')
            this.nowTime += 1000
          }
          this.$on('hook:deactivated', () => {
            timer && clearInterval(timer)
          })
        }, 1000)
      }
    },
    handleGetCustomer (val) {
      createOuterCustomer(val).then(res => {
        this.tableData.push(val)
        this.$message({
          type: 'success',
          message: '添加天外来客成功'
        })
        this.queryStatic()
      })
    },
    emptyData () {
      queryOuterCustomer().then(res => {
        this.cardsData = res.data
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .index-wrap {
    //padding: 16px 0 16px;
    position: relative;
    min-width: 1200px;
    height: 100%;
    .bg {
      position: relative;
      padding: 8px 12px 8px 8px;
      /*height: calc(100vh - 95px - 32px);*/
      height: 100%;
      min-height: 768px;
      min-width: 1457px;
      background: url("../../assets/images/luckySearchBg.png") no-repeat;
      background-size: 100% 100%;
      border-radius: 4px;
      .top-content {
        width: 100%;
        position: relative;
        .top-tag {
          display: flex;
          .left-tag {
            /*width: calc(0.12 * 100vw);*/
            /*min-width: 141px;*/
            min-width: 227px;
            height: 25px;
            background: url("../../assets/images/left-tag.png") no-repeat;
            background-size: 100% 100%;
          }
          .time-tag {
            padding-top: 3px;
            min-width: 300px;
            height: 108px;
            font-size: 14px;
            font-weight: 700;
            color: #FFFFFF;
            text-align: center;
            background: url("../../assets/images/time-tag.png") no-repeat;
            background-size: 100% 100%;
            .container {
              display: flex;
              justify-content: center;
              padding-top: 5px;
              margin-bottom: 12px;
              .time {
                width: 27px;
                height: 34px;
                line-height: 34px;
                text-align: center;
                font-size: 26px;
                font-weight: 700;
                color: #FFFFFF;
                background: url("../../assets/images/time-bottom.png") no-repeat;
                background-size: contain;
              }
              .colon {
                padding: 0 4px;
                line-height: 34px;
                font-size: 24px;
                color: #ffffff;
                font-weight: 700;
              }
            }
          }
          .right-tag {
            /*width: calc(0.7 * 100vw);*/
            /*min-width: 731px;*/
            width: 100%;
            height: 25px;
            background: url("../../assets/images/right-tag.png") no-repeat;
            background-size: 100% 100%;
          }
        }
        .tip {
          padding: 0 100px;
          width: 726px;
          text-align: center;
          font-size: 12px;
          font-weight: 400;
          color: #E4F3FF;
          background: url("../../assets/images/calling.png") no-repeat;
          background-size: 100% 100%;
        }
      }
      .content {
        /*height: 100%;*/
        display: flex;
        justify-content: space-between;
        height: calc(100% - 126px);
        .left-container {
          display: flex;
          align-items: center;
          position: relative;
          /*margin-left: calc(0.025 * 100vw);*/
          margin-left: 40px;
          height: 100%;
          .card-container {
            position: absolute;
            top: 55%;
            width: 100%;
            height: 80%;
            transform: translateY(-50%);
            z-index: 15;
          }
        }
        .right-container {
          width: 50%;
          /*height: calc(0.78 * 100vh);*/
          min-height: 685px;
          max-height: 755px;
          transform: translateY(-70px);
          /*width: calc(0.5 * 100vw);*/
          /*min-width: 700px;*/
        }
      }
    }
  }
</style>
