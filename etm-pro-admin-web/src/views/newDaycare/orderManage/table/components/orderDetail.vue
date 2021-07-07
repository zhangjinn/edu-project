<template>
  <div class="orderDrawer-wrap">
    <etm-title border size="big">账单详情</etm-title>
    <div class="orderList">
      <div class="orderItem">
        <div class="totalBox">
          <el-row class="total">
            <el-col :span="8">
              <etm-field-label label="账单编号">{{ orderData.code }}</etm-field-label>
            </el-col>
            <el-col :span="8">
              <etm-field-label label="收费方式">{{ transferChargeType(orderData.chargeType) }}</etm-field-label>
            </el-col>
            <el-col :span="8">
              <etm-field-label label="收费时段">{{ transferChargeTime(orderData) }}</etm-field-label>
            </el-col>
            <el-col :span="8">
              <etm-field-label label="订金">￥{{ formatMoney(orderData.depositAmount) }}</etm-field-label>
            </el-col>
            <el-col :span="8">
              <etm-field-label label="应收总金额">￥{{ formatMoney(orderData.totalAmount) }}</etm-field-label>
            </el-col>
            <el-col :span="8">
              <etm-field-label label="实收总金额">
                <span class="main">￥{{ formatMoney(orderData.actualAmount) }}</span>
              </etm-field-label>
            </el-col>
            <el-col :span="8">
              <etm-field-label label="制单日期">{{ transferDate(orderData.createTime) }}</etm-field-label>
            </el-col>
            <el-col :span="8">
              <etm-field-label label="制单人">{{ orderData.createBy }}</etm-field-label>
            </el-col>
            <el-col :span="8">
              <etm-field-label label="审核日期">{{ transferDate(orderData.auditTime) }}</etm-field-label>
            </el-col>
            <el-col :span="8">
              <etm-field-label label="审核人">{{ orderData.auditBy }}</etm-field-label>
            </el-col>
          </el-row>
        </div>
        <div class="rowBox">
          <div class="row rowTitle">
            <div class="col colHeader" style="width: 26%;">项目名称</div>
            <div class="col colHeader" style="width: 18%;">单价</div>
            <div class="col colHeader" style="width: 21%;">数量/月份</div>
            <div class="col colHeader" style="width: 28%;">小计</div>
            <div class="col colHeader" style="width: 7%;" />
          </div>
          <div v-if="orderData.orderItemList" class="rowBody">
            <div v-for="(orderItem, ind) in orderData.orderItemList" :key="ind" class="itemColumn">
              <div class="row column">
                <div class="col colItem" style="width: 26%;">
                  <div class="itemImg">
                    <img src="../../../../../assets/images/etm-logo.png">
                  </div>
                  <div class="name">{{ orderItem.orderItemName }}</div>
                </div>
                <div class="col colItem" style="width: 18%;">
                  <div v-if="orderItem.orderItemItemList && orderItem.orderItemItemList.length === 1">
                    <div class="actual">实收：¥ {{ formatMoney(orderItem.orderItemItemList[0].actualUnitAmount) }}</div>
                    <div class="origin">应收：¥ {{ formatMoney(orderItem.orderItemItemList[0].unitAmount) }}</div>
                  </div>
                  <div v-else-if="!orderItem.orderItemItemList || !orderItem.orderItemItemList.length">
                    <div class="actual">实收：¥ {{ formatMoney(orderItem.actualUnitAmount) }}</div>
                    <div class="origin">应收：¥ {{ formatMoney(orderItem.unitAmount) }}</div>
                  </div>
                </div>
                <div class="col colItem" style="width: 21%;">
                  <span v-if="orderItem.orderItemItemList && orderItem.orderItemItemList.length === 1">{{ transferDate(orderItem.orderItemItemList[0].month, 'month') }}</span>
                  <span v-else-if="!orderItem.orderItemItemList || !orderItem.orderItemItemList.length">{{ orderItem.number }}</span>
                </div>
                <div class="col colItem" style="width: 28%;">
                  <div v-if="orderItem.orderItemItemList && orderItem.orderItemItemList.length === 1">
                    <div class="actual">实收：¥ {{ formatMoney(orderItem.orderItemItemList[0].actualAmount) }}</div>
                    <div class="origin">应收：¥ {{ formatMoney(orderItem.orderItemItemList[0].totalAmount) }}</div>
                  </div>
                  <div v-else>
                    <div class="actual">实收：¥ {{ formatMoney(orderItem.actualAmount) }}</div>
                    <div class="origin">应收：¥ {{ formatMoney(orderItem.totalAmount) }}</div>
                  </div>
                </div>
                <div class="col colItem" style="width: 7%;" />
              </div>
              <template v-if="orderItem.orderItemItemList && orderItem.orderItemItemList.length > 1">
                <div v-for="(orderItemItem, i) in orderItem.orderItemItemList" :key="i" class="row childColumn">
                  <div class="col colItem" style="width: 26%;" />
                  <div class="col colItem" style="width: 18%;">
                    <div>
                      <div class="actual">实收：¥ {{ formatMoney(orderItemItem.actualUnitAmount) }}</div>
                      <div class="origin">应收：¥ {{ formatMoney(orderItemItem.unitAmount) }}</div>
                    </div>
                  </div>
                  <div class="col colItem" style="width: 21%;">
                    <span>{{ transferDate(orderItemItem.month, 'month') }}</span>
                  </div>
                  <div class="col colItem" style="width: 28%;">
                    <div>
                      <div class="actual">实收：¥ {{ formatMoney(orderItemItem.actualAmount) }}</div>
                      <div class="origin">应收：¥ {{ formatMoney(orderItemItem.totalAmount) }}</div>
                    </div>
                  </div>
                  <div class="col colItem" style="width: 7%;" />
                </div>
              </template>
            </div>
          </div>
          <div v-else>
            <etm-empty />
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import { parseTime } from '@/utils'

/**
 * orderDrawer create by Administrator
 * createTime 2020/9/24 15:47
 */
export default {
  name: 'OrderDrawer',
  components: {},
  filters: {},
  mixins: [],
  props: {
    orderData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {
    transferChargeType(chargeType) {
      switch (chargeType) {
        case 'PER_MONTH':
          return '按月'
        case 'PER_TERM':
          return '按学期'
        default:
          return chargeType
      }
    },
    transferChargeTime(data) {
      if (data.chargeType === 'PER_MONTH') {
        return this.transferDate(data.chargeRangeStart, 'month') + '至' + this.transferDate(data.chargeRangeEnd, 'month')
      } else if (data.chargeType === 'PER_TERM') {
        return data.termName
      } else {
        return '--'
      }
    },
    transferDate(date, type) { // 日期转换
      if (!date) {
        return date
      } else if (type === 'month') {
        return parseTime(date, '{y}-{m}')
      } else {
        return parseTime(date, '{y}-{m}-{d}')
      }
    },
    formatMoney(money) {
      if (!isNaN(money)) {
        return money.toFixed(2)
      } else {
        return money
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.orderDrawer-wrap {
  .orderList {
    .orderItem {
      .totalBox {
        .main {
          font-weight: bold;
          @include c_main_color();
        }
      }
      .rowBox {
        font-size: 14px;

        .row, .col {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0 10px;
        }

        .rowTitle {
          background: #fafafa;

          .colHeader {
            height: 42px;
            color: #9a9a9a;
          }
        }

        .rowBody {
          .itemColumn {
            border-bottom: 1px solid #eee;
            border-top: 1px solid #eee;

            & + .itemColumn {
              margin-top: 16px;
            }

            .column {
              padding: 16px 0;
            }

            .childColumn {
              padding: 16px 0;
              border-top: 1px dashed #eee;
            }

            .colItem {
              .itemImg {
                margin-right: 15px;
                padding-top: 11px;
                width: 100px;
                height: 54px;
                text-align: center;
                border-radius: 2px;
                @include bgc_divide_color();

                img {
                  width: 32px;
                }
              }

              .name {
                flex: 1 1 0%;
                text-align: left;
              }

              .actual {
                height: 14px;
                line-height: 14px;
              }

              .origin {
                margin-top: 16px;
                height: 14px;
                line-height: 14px;
                @include c_secondary_color();
              }
            }
          }
        }
      }
    }
  }
}
</style>
