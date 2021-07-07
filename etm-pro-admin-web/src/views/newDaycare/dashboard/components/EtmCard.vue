<template>
  <div class="etmCard-wrap">
    <el-col :xs="12" :sm="{span: '4-8'}" :md="{span: '4-8'}" :lg="{span: '4-8'}">
      <div v-if="resultData.type === 1" class="itemBox">
        <div class="itemTitle">本月{{ resultData.title }} <span class="icon el-icon-error" @click="$emit('close', resultData)" /></div>
        <div class="itemAmount outcome">
          <span v-if="resultData.isMoney" class="unit">￥</span>
          <span v-for="(num,i) of resultData.currentMonth" :key="i" class="number">{{ num }}</span>
        </div>
        <div class="itemLastAmount">
          <span>上月</span>
          <div>
            <span v-for="(num,i) of resultData.lastMonth" :key="i"><span v-if="resultData.isMoney" class="unit">￥</span>{{ num }}</span>
          </div>
        </div>
      </div>

      <div v-if="resultData.type === 2" class="itemBox">
        <div class="itemTitle">本月{{ resultData.title }} <span class="icon el-icon-error" @click="$emit('close', resultData)" /></div>
        <div class="itemAmount outcome">
          <span v-if="resultData.isMoney" class="unit">￥</span>
          <span
            v-for="(num,i) of resultData.currentMonth"
            :key="i"
            :style="{color: resultData.color[i]}"
            class="number"
          >
            {{ i!== 0 ? '/':'' }}{{ num }}
          </span>
        </div>
        <div class="itemLastAmount">
          <span>上月</span>
          <div>
            <span v-for="(num,i) of resultData.lastMonth" :key="i">
              <!--<span v-if="resultData.isMoney" class="unit">￥</span>-->
              <span>{{ i!== 0 ? '/':'' }}</span>
              {{ num }}
            </span>
          </div>
        </div>
      </div>
    </el-col>
  </div>
</template>
<script>
/**
 * code 类比ID
 * isMoney 金额类型
 * color.length 多颜色
 *  ataUrl 接口地址
 *
 */

/**
 INCOME_AMOUNT :收入金额
 CONTRACT_AMOUNT :签约金额
 EXPENDITURE_AMOUNT :支出金额
 SIGN_IN :签到
 ABSENT_FROM_WORK :缺勤
 ASK_FOR_LEAVE :请假
 REFUND_AMOUNT :退费金额
 SIGN_AMOUNT :签约单数
 CONSUME_COURSE :消课金额/消课课时
 SCHEDULE_COURSE :排课节数/排课学员
 AVERAGE_TEACHER_EFFICIENCY :老师平均人效
 FOLLOW_UP :跟进人数
 */
const map = [
  { dataUrl: 'INCOME_AMOUNT', isMoney: true, type: 1, code: '收入金额', title: '收入金额', color: ['#FF6969'] },
  { dataUrl: 'CONTRACT_AMOUNT', isMoney: true, type: 1, code: '签约金额', title: '签约金额', color: ['#FF6969'] },
  { dataUrl: 'CONSUME_COURSE', isMoney: true, type: 2, code: '消课金额/消课课时', title: '消课金额/消课课时', color: ['#FF6969', '#569EFF'] },
  { dataUrl: 'SCHEDULE_COURSE', isMoney: false, type: 2, code: '排课节数/排课学员', title: '排课节数/排课学员', color: ['#569EFF', '#569EFF'] },
  { dataUrl: 'SIGN_AMOUNT', isMoney: false, type: 1, code: '签约单数', title: '签约单数', color: ['#FFA336'] },
  { dataUrl: '111', isMoney: false, type: 1, code: '到访人数', title: '到访人数', color: ['#FFA336'] },
  { dataUrl: 'FOLLOW_UP', isMoney: false, type: 1, code: '跟进人数', title: '跟进人数', color: ['#569EFF'] },
  { dataUrl: '111', isMoney: false, type: 1, code: '邀约人数', title: '邀约人数', color: ['#569EFF'] },
  { dataUrl: 'AVERAGE_TEACHER_EFFICIENCY', isMoney: false, type: 1, code: '老师平均人效', title: '老师平均人效', color: ['#569EFF'] },
  { dataUrl: 'SIGN_IN', isMoney: false, type: 1, code: '签到学员', title: '签到学员', color: ['#569EFF'] },
  { dataUrl: '111', isMoney: false, type: 1, code: '未到人数', title: '未到人数', color: ['#8F7CF3'] },
  { dataUrl: 'ABSENT_FROM_WORK', isMoney: false, type: 1, code: '缺勤学员', title: '缺勤学员', color: ['#8F7CF3'] },
  { dataUrl: 'ASK_FOR_LEAVE', isMoney: false, type: 1, code: '请假学员', title: '请假学员', color: ['#8F7CF3'] },
  { dataUrl: 'REFUND_AMOUNT', isMoney: true, type: 1, code: '退费金额', title: '退费金额', color: ['#15C691'] },
  { dataUrl: 'EXPENDITURE_AMOUNT', isMoney: true, type: 1, code: '支出金额', title: '支出金额', color: ['#15C691'] }
]

import service from '@/utils/request'

export default {
  name: 'EtmCard',
  props: {
    cardData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      resultData: Object.assign({}, this.cardData)
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const find = map.find(item => item.code === this.cardData.code)
      this.resultData = Object.assign(this.cardData, find)
      service({
        method: 'get',
        url: '/newdaycare/workbench/statistics/data_card',
        params: { type: this.cardData.dataUrl }
      }).then(res => {
        const { currentMonth, lastMonth } = res.data
        this.resultData.currentMonth = currentMonth
        this.resultData.lastMonth = lastMonth
        this.$forceUpdate()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .etmCard-wrap {
    .el-col-sm-4-8, .el-col-md-4-8, .el-col-lg-4-8 {
      width: 20%;

      .itemBox {
        position: relative;
        padding: 16px;
        width: 100%;
        @include bgc_white();
        border-radius: 4px;
        height: 146px;
        display: flex;
        flex-direction: column;
        color: $secondary-color;

        &:hover {
          .itemTitle {
            .icon {
              display: block;
            }
          }
        }

        .itemTitle {
          padding: 8px 0 16px;
          height: 38px;
          line-height: 14px;
          @include c_secondary_color();
          position: relative;

          .icon {
            display: none;
            position: absolute;
            right: 0;
            top: 0;
            font-size: 18px;

            &:hover {
              color: red;
            }
          }
        }

        .itemAmount {
          display: flex;
          align-items: flex-end;
          padding-bottom: 16px;
          font-weight: bold;
          height: 32px;

          &.income {
            color: #FFA336;
          }

          &.outcome {
            color: #FF696A;
          }

          &.check {
            color: #569EFF;
          }

          .attendance {
            color: #15C692;
          }

          .unit {
            display: inline-block;
            height: 16px;
            line-height: 16px;
            font-size: 16px;
          }

          .number {
            display: inline-block;
            height: 22px;
            line-height: 22px;
            font-size: 22px;
          }
        }

        .itemLastAmount {
          display: flex;
          justify-content: space-between;
          padding-top: 16px;
          border-top: 1px solid #F2F2F2;
        }

        .bgImg {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 80px;

          img {
            display: block;
            width: 100%;
          }
        }
      }
    }
  }
</style>
