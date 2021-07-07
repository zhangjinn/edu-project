<template>
  <div class="depositDrawer-wrap">
    <etm-title :show-line="false" border size="big">关联单号</etm-title>
    <div class="detail">
      <etm-field-label type="left" label="关联账单编号">{{ depositData.code }}</etm-field-label>
      <etm-field-label type="left" label="幼儿姓名">{{ depositData.childName }}</etm-field-label>
      <etm-field-label type="left" label="订金金额（元）">{{ depositData.amount }}</etm-field-label>
      <etm-field-label type="left" label="支付方式">{{ transferPayment(depositData.paymentType) }}</etm-field-label>
      <etm-field-label type="left" label="收费日期">{{ transferDate(depositData.paymentDate) }}</etm-field-label>
      <etm-field-label type="left" label="备注">{{ depositData.remark }}</etm-field-label>
    </div>
  </div>

</template>

<script>
import { parseTime } from '@/utils'

/**
 * depositDrawer create by Administrator
 * createTime 2020/9/27 13:34
 */
export default {
  name: 'DepositDrawer',
  components: {},
  filters: {},
  mixins: [],
  props: {
    depositData: {
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
    transferPayment(type) { // 支付方式
      // WECHAT :微信 ALIPAY :支付宝 CASH :现金 ONLINE_BANKING :网银
      switch (type) {
        case 'WECHAT':
          return '微信'
        case 'ALIPAY':
          return '支付宝'
        case 'CASH':
          return '现金'
        case 'ONLINE_BANKING':
          return '网银'
        default:
          return type
      }
    },
    transferDate(date) {
      if (isNaN(date)) {
        return date
      } else {
        return parseTime(date, '{y}-{m}-{d}')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.depositDrawer-wrap {

}
</style>
