<template>
  <div class="detail">
    <etm-field-label type="left" label="订单编号">{{ info.code }}</etm-field-label>
    <etm-field-label type="left" label="家长姓名">{{ info.parentName }}</etm-field-label>
    <etm-field-label type="left" label="家长电话">{{ info.parentPhone }}</etm-field-label>
    <etm-field-label type="left" label="幼儿姓名">{{ info.childName }}</etm-field-label>
    <etm-field-label type="left" label="所属年级">{{ info.grade }}</etm-field-label>
    <etm-field-label type="left" label="所属班级">{{ info.clazz }}</etm-field-label>
    <etm-field-label type="left" label="支付金额">{{ info.actualAmount }}</etm-field-label>
    <etm-field-label type="left" label="支付方式">{{ info.payType === 'ONLINE' ? '线上' : '线下' }}</etm-field-label>
    <etm-field-label type="left" label="购买时长">{{ info.buyedMonth }}个月</etm-field-label>
    <etm-field-label type="left" label="支付日期">{{ transferDate(info.paymentDate) }}</etm-field-label>
    <etm-field-label type="left" label="到期日期">{{ transferDate(info.expireDate) }}</etm-field-label>
  </div>
</template>
<script>
import {
  queryCloudList
} from '@/api/newDaycare/cloudVideoOrder'
import { parseTime } from '@/utils'

export default {
  name: 'Detail',
  props: {
    orderNumber: {
      type: [Number, String],
      default: null
    }
  },
  data() {
    return {
      info: {}
    }
  },
  created() {
    this.getOrderDetail()
  },
  methods: {
    transferDate(date) { // 日期转换
      if (isNaN(date)) {
        return date
      } else {
        console.log(parseTime(date, '{y}-{m}-{d}'))
        return parseTime(date, '{y}-{m}-{d}')
      }
    },
    getOrderDetail() {
      const orderNumber = this.orderNumber
      queryCloudList({ orderNumber }).then((res) => {
        const data = res.data.content[0]
        this.info = data
      })
    }
  }
}
</script>

<style scoped>

</style>
