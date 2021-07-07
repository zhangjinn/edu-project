<template>
  <div class="data-card">
    <div v-for="(item, index) in dataCards" :key="index" class="data-card-wrap">
      <van-cell v-if="item.requested">
        <div class="title">
          <div class="image">
            <img :src="item.icon" alt="">
          </div>
          <span>{{ item.name }}</span>
        </div>
        <div class="data">
          <van-row>
            <van-col span="12">
              <div class="number" :style="{color: item.color}">
                <span>{{ item.currentMonth[0].toLocaleString() }}</span>
                <span v-if="item.currentMonth.length > 1">/{{ item.currentMonth[1] }}</span>
              </div>
              <div class="month-text">
                本月
              </div>
            </van-col>
            <van-col span="12">
              <div class="last-month-number">
                <span>{{ item.lastMonth[0].toLocaleString() }}</span>
                <span v-if="item.lastMonth.length > 1">/{{ item.lastMonth[1] }}</span>
              </div>
              <div class="month-text">
                上月
              </div>
            </van-col>
          </van-row>
        </div>
        <div class="cell-bg">
          <img :src="item.cellBg" alt="">
        </div>
      </van-cell>
    </div>
  </div>
</template>

<script>
import { dataCare } from '@/service/daycare/homePage'

export default {
  name: 'DataCard',
  data() {
    return {
      dataCards: [
        {
          name: '收入金额',
          icon: require('@/assets/images/daycare/money-icon.png'),
          cellBg: require('@/assets/images/daycare/money-icon-bg.png'),
          currentMonth: [],
          lastMonth: [],
          color: '#FFAD45',
          requested: false
        },
        {
          name: '支出金额',
          icon: require('@/assets/images/daycare/money-icon.png'),
          cellBg: require('@/assets/images/daycare/money-icon-bg.png'),
          currentMonth: [],
          lastMonth: [],
          color: '#FFAD45',
          requested: false
        },
        {
          name: '排课节数/排课学员',
          icon: require('@/assets/images/daycare/clazz-teacher-icon.png'),
          cellBg: require('@/assets/images/daycare/clazz-teacher-icon-bg.png'),
          currentMonth: [],
          lastMonth: [],
          color: '#5297FF',
          requested: false
        },
        {
          name: '请假学员',
          icon: require('@/assets/images/daycare/leave-icon.png'),
          cellBg: require('@/assets/images/daycare/leave-icon-bg.png'),
          currentMonth: [],
          lastMonth: [],
          color: '#F65AF4',
          requested: false
        },
        {
          name: '老师平均人效',
          icon: require('@/assets/images/daycare/clazz-teacher-icon.png'),
          cellBg: require('@/assets/images/daycare/clazz-teacher-icon-bg.png'),
          currentMonth: [],
          lastMonth: [],
          color: '#5297FF',
          requested: false
        }
      ]
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const types = ['INCOME_AMOUNT', 'EXPENDITURE_AMOUNT', 'SCHEDULE_COURSE', 'ASK_FOR_LEAVE', 'AVERAGE_TEACHER_EFFICIENCY']
      types.forEach((item, index) => {
        dataCare({ type: item }).then(res => {
          if (res.data.message === '成功') {
            // console.log(item)
            // console.log(res.data)
            this.dataCards[index].currentMonth = res.data.data.currentMonth
            this.dataCards[index].lastMonth = res.data.data.lastMonth
            this.dataCards[index].requested = true
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.data-card {
  .data-card-wrap {
    margin-bottom: 12px;

    .van-cell {
      .van-cell__value {
        position: static;
      }

      .title {
        display: flex;
        align-items: center;
        color: #222222;
        .image {
          width: 20px;
          height: 20px;
        }
        span {
          margin-left: 8px;
          font-size: 14px;
        }
      }

      .data {
        margin-top: 8px;
        font-size: 18px;
        .number {
          color: $theme;
          font-size: 18px;
          font-weight: 700;
        }
        .last-month-number {
          color: #555555;
          font-weight: 700;
        }
        .month-text {
          color: #999999;
          font-size: 12px;
        }
      }

      .cell-bg {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 44px;
      }
    }
  }
}
</style>
