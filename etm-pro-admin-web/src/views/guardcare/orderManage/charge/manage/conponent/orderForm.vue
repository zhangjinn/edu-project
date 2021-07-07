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
      <div
        v-for="(item,index) in formData.orderList"
        :key="index"
        class="itemList"
        :class="searchResult.includes(index) ? 'isNone' : ''"
      >
        <el-row class="total">
          <el-col :span="6">
            姓名：{{ item.childName }}
          </el-col>
          <el-col :span="6">
            应收总价：¥{{ item.totalAmount }}
          </el-col>
          <el-col :span="6">
            定金：¥{{ item.depositAmount || 0 }}
          </el-col>
          <el-col :span="6">
            实收总价：
            <span class="main">¥{{ item.actualAmount }}</span>
          </el-col>
        </el-row>
        <etm-table :data="item.orderItemList" :border="false" :stripe="false" class="itemTable">
          <el-table-column slot="left" label="项目名称" width="240px">
            <template slot-scope="scoped">
              <div class="itemName">
                <div class="itemImg">
                  <img src="../../../../../../assets/images/etm-logo.png">
                </div>
                <div class="name">{{ scoped.row.orderItemName }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column slot="left" label="单价">
            <template slot-scope="scoped">
              <div class="actual">实收：¥ {{ scoped.row.actualUnitAmount }}</div>
              <div class="origin">应收：¥ {{ scoped.row.unitAmount }}</div>
            </template>
          </el-table-column>
          <el-table-column slot="left" label="数量" prop="number" />
          <el-table-column slot="left" label="小计" width="240px">
            <template slot-scope="scoped">
              <div class="actualInput">实收：¥
                <el-input-number
                  v-model="scoped.row.actualAmount"
                  controls-position="right"
                  :min="0"
                  :data-none="scoped"
                  @change="changeTotal($event, scoped.$index, index)"
                />
              </div>
              <div class="origin">应收：¥ {{ scoped.row.totalAmount }}</div>
            </template>
          </el-table-column>
          <el-table-column slot="right" label="操作" width="90px">
            <template slot-scope="scoped">
              <etm-text type="danger" @click="removeItem(scoped.$index, index)">删除</etm-text>
            </template>
          </el-table-column>
        </etm-table>
      </div>
    </div>
    <div v-if="formData.orderList && formData.orderList.length === searchResult.length" class="noData">
      <img src="../../../../../../assets/images/guardcare/img-fygl.png">
      <div>搜索结果为空~</div>
    </div>
  </div>

</template>

<script>
/**
 * order create by Administrator
 * createTime 2020/8/21 11:46
 */
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
    changeTotal(value, tableIndex, index) { // 修改实收小计：index为第几个账单，tableIndex为账单里的第几项数据
      const item = this.formData.orderList[index].orderItemList[tableIndex]
      const total = item.actualUnitAmount * item.number
      const amount = this.formData.orderList[index].actualAmount - total
      // 计算实收小计改变的幼儿的实收总价
      this.formData.orderList[index].actualAmount = Number((value + amount).toFixed(2))
      // 计算实收小计改变的列的实收单价
      const actualPrice = value / this.formData.orderList[index].orderItemList[tableIndex].number
      this.formData.orderList[index].orderItemList[tableIndex].actualUnitAmount = Number(actualPrice.toFixed(2))
    },
    removeItem(tableIndex, index) { // 删除收费项目
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
          // 计算删除收费项目的幼儿的应收总价和实收总价
          const item = this.formData.orderList[index].orderItemList[tableIndex]
          const total = item.unitAmount * item.number // 删除项的应收小计 = 应收单价 * 数量
          const amount = this.formData.orderList[index].totalAmount - total // 应收总价 = 原应收总价 - 删除项的应收小计
          const actualTotal = item.actualUnitAmount * item.number // 删除项的实收小计 = 实收单价 * 数量
          const actualAmount = this.formData.orderList[index].actualAmount - actualTotal // 实收总价 = 原实收总价 - 删除项的实收小计
          this.formData.orderList[index].totalAmount = Number(amount.toFixed(2)) // 保留两位小数
          this.formData.orderList[index].actualAmount = Number(actualAmount.toFixed(2)) // 保留两位小数
          this.formData.orderList[index].orderItemList.splice(tableIndex, 1) // 数据去掉删除项
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
    }
  }
}
</script>
<style lang="scss" scoped>
.orderForm-wrap {
  .orderList {
    .itemList {
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

      .itemTable {
        .itemName {
          display: flex;

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
            max-width: 100px;
          }
        }

        .actual {
          height: 14px;
          line-height: 14px;
        }

        .actualInput {
          height: 32px;
          line-height: 32px;

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
