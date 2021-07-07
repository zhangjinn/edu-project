<template>
  <div class="order-wrap">
    <etm-drawer
      :visible.sync="showSide"
    >
      <etm-layout-split>
        <etm-title :show-line="false" border>
          订单详情
        </etm-title>

        <div>
          <etm-field-label label="订单号">{{ paymentInfo['orderNo'] }}</etm-field-label>
          <etm-field-label label="充值组织">{{ paymentInfo['organization'] }}</etm-field-label>
          <template v-for="(item, index) in paymentInfo.items">
            <etm-field-label v-if="item.type === 'CALL'" :key="index" label="电话充值套餐">{{ `￥${item['price']}元 ${params(item.num, item.type)}分钟` }}</etm-field-label>
            <etm-field-label v-if="item.type === 'MESSAGE'" :key="index" label="短信充值套餐">{{ `￥${item['price']}元 ${params(item.num, item.type)}条` }}</etm-field-label>
            <etm-field-label v-if="item.type === 'CLOUD_DISK'" :key="index" label="云盘套餐">{{ `￥${item['price']}元 ${params(item.num, item.type)}GB` }}</etm-field-label>
          </template>
          <etm-field-label label="支付金额">{{ paymentInfo['amount'] }}</etm-field-label>
          <etm-field-label label="支付方式">{{ payType[paymentInfo['payMethod']] }}</etm-field-label>
          <etm-field-label label="支付人">{{ paymentInfo['operator'] }}</etm-field-label>
          <etm-field-label label="支付时间">{{ paymentInfo['payTime'] | parseTime('{y}-{m}-{d} {h}:{i}') }}</etm-field-label>
        </div>
      </etm-layout-split>
    </etm-drawer>
  </div>
</template>

<script>
import {
  getRechargeOrderDetails
} from '@/api/base/paymentCenter'
import baseMixin from '@/layout/mixin/baseMixin'
export default {
  name: 'Order',
  filters: {

  },
  mixins: [baseMixin],
  props: {
    id: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      showSide: false,
      paymentInfo: {},
      payType: {
        'CASH': '现金',
        'ALIPAY': '支付宝',
        'WECHAT': '微信',
        'BANK': '银行转账'
      }
    }
  },
  watch: {
    id: {
      handler(n) {
        this.init()
      }
    }
  },
  methods: {
    params(num, type) {
      let result = num
      let remainder, method
      switch (type) {
        case 'CALL':
          remainder = num % 60
          method = remainder >= 30 ? Math.ceil : Math.floor
          result = method(num / 60)
          break
      }

      return result
    },
    show() {
      this.showSide = true
    },
    init() {
      getRechargeOrderDetails(this.id).then(res => {
        this.paymentInfo = res.data
      })
    }
  }
}
</script>

<style scoped lang="scss">
.order-wrap{

}
</style>
