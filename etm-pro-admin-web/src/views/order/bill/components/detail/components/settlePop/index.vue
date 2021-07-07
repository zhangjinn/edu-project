<template>
  <div class="container">
    <div class="msgRow bottomBorder">
      <el-row class="top">
        <el-col :span="4">
          <div class="itemTitle textIndent">收费项目</div>
        </el-col>
        <el-col :span="5">
          <div class="itemTitle textRight">收款金额</div>
        </el-col>
        <el-col :span="5">
          <div class="itemTitle textRight">消费金额</div>
        </el-col>
        <el-col :span="5">
          <div class="itemTitle textRight">退费金额</div>
        </el-col>
        <el-col :span="5">
          <div class="itemTitle textRight">入账金额</div>
        </el-col>
      </el-row>
      <el-row v-for="(item, index) in chargeData" :key="index">
        <el-col :span="4">
          <div class="itemMsg textIndent">{{ item.name }}</div>
        </el-col>
        <el-col :span="5">
          <div class="itemMsg textRight">{{ getTotal(item) }}</div>
        </el-col>
        <el-col :span="5">
          <div class="itemInput textRight">
            <el-input
              v-model="consuData[index].money"
              placeholder="0"
              class="inputInner"
              @keyup.native="proving(index, 'consu')"
              @blur="testMoney(index, 'consu')"
            />
          </div>
        </el-col>
        <el-col :span="5">
          <div class="itemInput textRight">
            <el-input
              v-model="refundData[index].money"
              placeholder="0"
              class="inputInner"
              @keyup.native="proving(index, 'refund')"
              @blur="testMoney(index, 'refund')"
            />
          </div>
        </el-col>
        <el-col :span="5">
          <div class="itemMsg textRight">{{ creditData[index].money }}</div>
        </el-col>
      </el-row>
    </div>
    <div v-if="showRefundWay" class="waySelect bottomBorder" :class="radio === '2' ? 'chooseShow' : ''">
      <div>
        <span>退费金额去向：</span>
        <template>
          <el-radio-group v-model="radio" @change="selectWay">
            <el-radio label="1">转入会员余额</el-radio>
            <el-radio label="2">直接退费</el-radio>
          </el-radio-group>
        </template>
      </div>
      <div v-if="radio === '2'" class="refundWay">
        <span>退费方式</span>
        <el-select v-model="value" placeholder="请选择退费方式" @change="selectOtherWay">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
    </div>
    <div class="totalBox">
      <div class="totalMsg">
        <span>收款金额：{{ totalMoney }}元</span>
      </div>
      <div class="totalMsg">
        <span v-if="refundTotal === 0">消费金额：{{ conseTotal }}元</span>
        <span v-else>{{ radio === '1' ? '转入余额' : '退费金额' }}：{{ refundTotal }}元</span>
      </div>
      <div class="totalMsg">
        <span>入账金额：</span>
        <span class="count">{{ creditTotal }}</span>
        <span>元</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Index',
  props: ['chargeData'],
  data() {
    return {
      consuData: [], // 消费金额
      refundData: [], // 退费金额
      creditData: [], // 入账金额
      radio: '1',
      options: [{
        value: 'WECHAT',
        label: '微信'
      }, {
        value: 'ALIPAY',
        label: '支付宝'
      }, {
        value: 'CASH',
        label: '现金'
      }, {
        value: 'UNIONPAY',
        label: '银行转账'
      }],
      value: '',
      totalMoney: 0, // 收费总金额
      conseTotal: 0, // 消费总金额
      refundTotal: 0, // 退费总金额
      creditTotal: 0, // 入账总金额
      postData: {
        item: [],
        way: 'BALANCE'
      },
      showRefundWay: false
    }
  },
  created() {
    this.chargeData.forEach(item => {
      const total = item.price * item.num
      this.consuData.push({ money: total })
      this.refundData.push({ money: 0 })
      this.creditData.push({ money: total })
      this.totalMoney += total
      this.conseTotal += total
      this.creditTotal += total
      this.postData.item.push({
        invoicesItemId: item.id,
        entryPrice: total,
        refundPrice: 0
      })
      this.sendData()
    })
  },
  methods: {
    getTotal(data) {
      return (data.price * data.num)
    },
    proving(index, type) {
      if (type === 'consu') {
        this.consuData[index].money = this.consuData[index].money.replace(/[^\.\d]/g, '')
      } else if (type === 'refund') {
        this.refundData[index].money = this.refundData[index].money.replace(/[^\.\d]/g, '')
      }
    },
    testMoney(index, type) {
      const total = this.chargeData[index].price * this.chargeData[index].num
      if (type === 'consu') {
        if (this.consuData[index].money > total) {
          this.consuData[index].money = total
        }
        this.refundData[index].money = total - this.consuData[index].money
      } else if (type === 'refund') {
        if (this.refundData[index].money > total) {
          this.refundData[index].money = total
        }
        this.consuData[index].money = total - this.refundData[index].money
      }
      this.creditData[index].money = this.consuData[index].money
      this.getTotalMoney()
    },
    sendData() {
      this.$emit('sendData', this.postData)
    },
    getTotalMoney() {
      this.conseTotal = 0
      this.creditTotal = 0
      this.refundTotal = 0
      this.consuData.forEach(item => {
        this.conseTotal += (item.money * 1)
      })
      this.creditData.forEach((item, index) => {
        this.creditTotal += (item.money * 1)
        this.postData.item[index].entryPrice = (item.money * 1)
      })
      this.refundData.forEach((item, index) => {
        this.refundTotal += (item.money * 1)
        this.postData.item[index].refundPrice = (item.money * 1)
      })
      if (this.refundTotal > 0) {
        this.showRefundWay = true
      } else {
        this.showRefundWay = false
      }
      this.sendData()
    },
    selectWay(val) {
      if (val === '1') {
        this.postData.way = 'BALANCE'
      } else {
        this.postData.way = ''
      }
      this.sendData()
    },
    selectOtherWay(val) {
      this.postData.way = val
      this.sendData()
    }
  }
}
</script>

<style lang="scss" scoped>
  .container {
    padding-top: 8px;

    .bottomBorder {
      border-bottom: .5px solid;
      @include bc_divide_color();
    }

    .msgRow {
      .top {
        @include bgc_hover_color();
      }

      .textIndent {
        text-indent: 24px;
      }

      .textRight {
        text-align: right;
      }

      .itemTitle {
        height: 40px;
        width: 90px;
        line-height: 40px;
        @include c_title_color();
      }

      .itemMsg {
        height: 44px;
        width: 90px;
        line-height: 44px;
        @include c_text_color();
      }

      .itemInput {
        padding-top: 5px;
        width: 90px;

        .inputInner {
          width: 72px;

          /deep/ .el-input__inner {
            height: 34px;
            text-align: right;
            -moz-appearance: textfield;

            &::-webkit-outer-spin-button,
            &::-webkit-inner-spin-button {
              -webkit-appearance: none;
            }
          }
        }
      }
    }

    .waySelect {
      position: relative;
      padding: 24px 0;
      @include c_text_color();

      &.chooseShow {
        padding-bottom: 62px;
      }

      .refundWay {
        position: absolute;
        top: 44px;
        left: 262px;
      }
    }

    .totalBox {
      padding: 20px 0;

      .totalMsg {
        display: inline-block;
        margin-right: 30px;
        @include c_text_color();

        .count {
          font-size: 18px;
          @include c_main_color();
        }
      }
    }
  }
</style>
