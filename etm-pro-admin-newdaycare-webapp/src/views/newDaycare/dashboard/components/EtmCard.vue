<template>
  <div class="etmCard-wrap">
    <el-col
      :xs="12"
      :sm="{span: '4-8'}"
      :md="{span: '4-8'}"
      :lg="{span: '4-8'}"
    >
      <div
        v-if="resultData.type === 1"
        class="itemBox"
      >
        <div class="itemTitle">
          本月{{ resultData.title }} <span
            class="icon el-icon-error"
            @click="$emit('close', resultData)"
          />
        </div>
        <div class="itemAmount outcome">
          <span
            v-if="resultData.isMoney"
            class="unit"
          >￥</span>
          <span
            v-for="(num,i) of resultData.currentMonth"
            :key="i"
            class="number"
          >{{ num }}</span>
        </div>
        <div class="itemLastAmount">
          <span>上月</span>
          <div>
            <span
              v-for="(num,i) of resultData.lastMonth"
              :key="i"
            ><span
              v-if="resultData.isMoney"
              class="unit"
            >￥</span>{{ num }}</span>
          </div>
        </div>
      </div>

      <div
        v-if="resultData.type === 2"
        class="itemBox"
      >
        <div class="itemTitle">
          本月{{ resultData.title }} <span
            class="icon el-icon-error"
            @click="$emit('close', resultData)"
          />
        </div>
        <div class="itemAmount outcome">
          <span
            v-if="resultData.isMoney"
            class="unit"
          >￥</span>
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
            <span
              v-for="(num,i) of resultData.lastMonth"
              :key="i"
            >
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
import service from '@/utils/request'

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

export default {
  name: 'EtmCard',
  props: {
    cardData: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      resultData: Object.assign({}, this.cardData)
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
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
    .el-col-sm-4-8,
    .el-col-md-4-8,
    .el-col-lg-4-8 {
      width: 20%;

      .itemBox {
        @include bgc_white();
        border-radius: 4px;
        color: $color-secondary;
        display: flex;
        flex-direction: column;
        height: 146px;
        padding: 16px;
        position: relative;
        width: 100%;

        &:hover {
          .itemTitle {
            .icon {
              display: block;
            }
          }
        }

        .itemTitle {
          @include c_secondary_color();
          height: 38px;
          line-height: 14px;
          padding: 8px 0 16px;
          position: relative;

          .icon {
            display: none;
            font-size: 18px;
            position: absolute;
            right: 0;
            top: 0;

            &:hover {
              color: #f00;
            }
          }
        }

        .itemAmount {
          align-items: flex-end;
          display: flex;
          font-weight: bold;
          height: 32px;
          padding-bottom: 16px;

          &.income {
            color: #ffa336;
          }

          &.outcome {
            color: #ff696a;
          }

          &.check {
            color: #569eff;
          }

          .attendance {
            color: #15c692;
          }

          .unit {
            display: inline-block;
            font-size: 16px;
            height: 16px;
            line-height: 16px;
          }

          .number {
            display: inline-block;
            font-size: 22px;
            height: 22px;
            line-height: 22px;
          }
        }

        .itemLastAmount {
          border-top: 1px solid #f2f2f2;
          display: flex;
          justify-content: space-between;
          padding-top: 16px;
        }

        .bgImg {
          bottom: 0;
          position: absolute;
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
