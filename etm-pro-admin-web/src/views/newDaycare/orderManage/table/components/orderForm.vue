<template>
  <div class="orderForm-wrap">
    <etm-title>账单信息 （{{ formData.orderList && formData.orderList.length }}人）
      <template slot="tool">
        <el-input
          v-model="searchValue"
          prefix-icon="el-icon-search"
          placeholder="请输入幼儿姓名搜索"
          @keyup.enter.native="searchOrder"
        />
      </template>
    </etm-title>
    <div class="orderList">
      <template v-for="(item,index) in formData.orderList">
        <div
          v-if="item.orderItemList.length"
          :key="index"
          class="itemList"
          :class="searchResult.includes(index) ? 'isNone' : ''"
        >
          <el-row class="total">
            <el-col :span="6">
              姓名：{{ item.childName }}
            </el-col>
            <el-col :span="6">
              应收总价：¥{{ formatMoney(item.totalAmount) }}
            </el-col>
            <el-col :span="6">
              定金：¥{{ formatMoney(item.depositAmount) || 0 }}
            </el-col>
            <el-col :span="6">
              实收总价：
              <span class="main">¥{{ formatMoney(item.actualAmount) }}</span>
            </el-col>
          </el-row>
          <div class="rowBox">
            <div class="row rowTitle">
              <div class="col colHeader" style="width: 26%;">项目名称</div>
              <div class="col colHeader" style="width: 18%;">单价</div>
              <div class="col colHeader" style="width: 21%;">数量/月份</div>
              <div class="col colHeader" style="width: 28%;">小计</div>
              <div class="col colHeader" style="width: 7%;" />
            </div>
            <div class="rowBody">
              <div v-for="(orderItem, ind) in item.orderItemList" :key="ind" class="itemColumn">
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
                    <span v-if="orderItem.orderItemItemList && orderItem.orderItemItemList.length === 1">{{ transferMonth(orderItem.orderItemItemList[0].month) }}</span>
                    <span v-else-if="!orderItem.orderItemItemList || !orderItem.orderItemItemList.length">{{ orderItem.number }}</span>
                  </div>
                  <div class="col colItem" style="width: 28%;">
                    <div class="colSubtotal">
                      <div v-if="orderItem.orderItemItemList && orderItem.orderItemItemList.length === 1" class="actualInput">实收：¥
                        <el-input-number
                          v-model="orderItem.orderItemItemList[0].actualAmount"
                          controls-position="right"
                          :min="0"
                          @change="changChildTotal($event, 0, ind, index)"
                        />
                      </div>
                      <div v-else-if="orderItem.orderItemItemList && orderItem.orderItemItemList.length > 1">实收：¥ {{ formatMoney(orderItem.actualAmount) }}</div>
                      <div v-else class="actualInput">实收：¥
                        <el-input-number
                          v-model="orderItem.actualAmount"
                          controls-position="right"
                          :min="0"
                          @change="changeTotal($event, ind, index)"
                        />
                      </div>
                      <div class="origin">应收：¥ {{ formatMoney(orderItem.totalAmount) }}</div>
                    </div>
                  </div>
                  <div class="col colItem" style="width: 7%;">
                    <etm-text type="danger" @click="removeItem(ind, index)">删除</etm-text>
                  </div>
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
                      <span>{{ transferMonth(orderItemItem.month) }}</span>
                    </div>
                    <div class="col colItem" style="width: 28%;">
                      <div class="colSubtotal">
                        <div class="actualInput">实收：¥
                          <el-input-number
                            v-model="orderItemItem.actualAmount"
                            controls-position="right"
                            :min="0"
                            @change="changChildTotal($event, i, ind, index)"
                          />
                        </div>
                        <div class="origin">应收：¥ {{ formatMoney(orderItemItem.totalAmount) }}</div>
                      </div>
                    </div>
                    <div class="col colItem" style="width: 7%;" />
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
    <div v-if="formData.orderList && formData.orderList.length === searchResult.length" class="noData">
      <img src="../../../../../assets/images/guardcare/img-fygl.png">
      <div>搜索结果为空~</div>
    </div>
  </div>

</template>

<script>/**
 * order create by Administrator
 * createTime 2020/8/21 11:46
 */

import { parseTime } from '@/utils'

export default {
  name: 'OrderForm',
  components: {},
  filters: {},
  mixins: [],
  props: {
    formData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      searchValue: '',
      searchResult: []
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {
    // 修改实收小计：index为第几个账单，ind为账单里的第几项数据
    /**
     * unitAmount:应收单价
     * actualUnitAmount:实收单价
     * totalAmount:应收小计
     * actualAmount:实收小计
     **/
    changeTotal(value, ind, index) {
      if (!value) {
        value = 0
        this.formData.orderList[index].orderItemList[ind].actualAmount = 0
      }
      const item = this.formData.orderList[index].orderItemList[ind] // 改变的那一列数据
      const total = item.actualUnitAmount * item.number // 实收单价*数量
      const amount = this.formData.orderList[index].actualAmount - total // 先计算旧的实收小计
      // 计算实收小计改变的幼儿的实收总价
      this.formData.orderList[index].actualAmount = Number((value + amount).toFixed(2))
      // 计算实收小计改变的列的实收单价
      const actualPrice = value / this.formData.orderList[index].orderItemList[ind].number
      this.formData.orderList[index].orderItemList[ind].actualUnitAmount = Number(actualPrice.toFixed(2))
    },
    // 修改实收小计：index为第几个账单，ind为账单里的第几项数据，i为周期性费用里的第几小项
    changChildTotal(value, i, ind, index) {
      if (!value) {
        value = 0
        this.formData.orderList[index].orderItemList[ind].orderItemItemList[i].actualAmount = 0
      }
      const childItem = this.formData.orderList[index].orderItemList[ind].orderItemItemList[i] // 改变的那一小列数据
      const item = this.formData.orderList[index].orderItemList[ind] // 改变的那一列所属的一大列数据
      const childAmount = item.actualAmount - childItem.actualUnitAmount // 大列小计 - 小列旧的实收单价
      const amount = this.formData.orderList[index].actualAmount - this.formData.orderList[index].orderItemList[ind].actualAmount // 改变的幼儿的实收总价 - 旧的改变的项目的实收小计
      this.formData.orderList[index].orderItemList[ind].orderItemItemList[i].actualUnitAmount = value // 改变的小列的实收单价修改
      this.formData.orderList[index].orderItemList[ind].actualAmount = Number((value + childAmount).toFixed(2)) // 改变的大列的实收小计修改
      // 计算实收小计改变的幼儿的实收总价
      this.formData.orderList[index].actualAmount = Number((value + childAmount + amount).toFixed(2))
    },
    removeItem(ind, index) { // 删除收费项目
      this.$etmTip.init({
        type: 'error',
        title: `确认删除该数据？`,
        content: `删除后将无法撤销，是否继续操作？`,
        confirmBtn: '删除',
        cancelBtn: '取消',
        cancel: () => {
          this.$etmTip.close()
        },
        confirm: () => {
          if (this.formData.orderList[index].orderItemList.length === 1) {
            this.$message.warning('当前项目不可删除')
          } else {
            // 计算删除收费项目的幼儿的应收总价和实收总价
            const item = this.formData.orderList[index].orderItemList[ind]
            const amount = this.formData.orderList[index].totalAmount - item.totalAmount // 应收总价 = 原应收总价 - 删除项的应收小计
            const actualAmount = this.formData.orderList[index].actualAmount - item.actualAmount // 实收总价 = 原实收总价 - 删除项的实收小计
            this.formData.orderList[index].totalAmount = Number(amount.toFixed(2)) // 保留两位小数
            this.formData.orderList[index].actualAmount = Number(actualAmount.toFixed(2)) // 保留两位小数
            this.formData.orderList[index].orderItemList.splice(ind, 1) // 数据去掉删除项
          }
          this.$etmTip.close()
        }
      })
      this.$etmTip.open()
    },
    searchOrder() {
      this.searchResult = []
      this.formData.orderList.forEach((item, index) => {
        if (this.searchValue && item.childName && !item.childName.includes(this.searchValue)) {
          this.searchResult.push(index)
        }
      })
    },
    transferMonth(time) {
      if (time) {
        return parseTime(time, '{y}-{m}')
      } else {
        return time
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
.orderForm-wrap {
  .orderList {
    .itemList {
      & + .itemList{
        margin-top: 16px;
      }
      &.isNone {
        display: none;
      }

      .total {
        padding-bottom: 16px;

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
              .colSubtotal{
                width: 160px;
                .el-input-number{
                  width: 100px;
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

              .actualInput {
                height: 32px;
                line-height: 32px;

                ::v-deep input {
                  padding: 0 12px;
                  width: 100px;
                }

                ::v-deep .el-input-number__increase {
                  display: none;
                }

                ::v-deep .el-input-number__decrease {
                  display: none;
                }
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

  .noData {
    margin: 48px 0;
    text-align: center;

    div {
      margin-top: 16px;
      @include c_secondary_color();
    }
  }
}
</style>
