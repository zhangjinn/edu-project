<template>
  <div class="videoDrawer-wrap">
    <etm-title :show-line="false" border size="big">关联单号</etm-title>
    <div class="detail">
      <etm-field-label type="left" label="关联账单编号">{{ videoData.code }}</etm-field-label>
      <etm-field-label type="left" label="幼儿姓名">{{ videoData.childName }}</etm-field-label>
      <etm-field-label type="left" label="所属年级">{{ videoData.grade }}</etm-field-label>
      <etm-field-label type="left" label="所属班级">{{ videoData.clazz }}</etm-field-label>
      <etm-field-label type="left" label="家长姓名">{{ videoData.parentName }}</etm-field-label>
      <etm-field-label type="left" label="家长电话">{{ videoData.parentPhone }}</etm-field-label>
      <etm-field-label type="left" label="购买时长（月）">{{ videoData.buyedMonth }}</etm-field-label>
      <etm-field-label type="left" label="支付类型">{{ transferType(videoData.payType) }}</etm-field-label>
      <etm-field-label type="left" label="支付金额（元）">{{ videoData.actualAmount }}</etm-field-label>
      <etm-field-label type="left" label="支付日期">{{ transferDate(videoData.paymentDate) }}</etm-field-label>
      <etm-field-label type="left" label="到期日期">{{ transferDate(videoData.expireDate) }}</etm-field-label>
    </div>
  </div>

</template>

<script>
import { parseTime } from '@/utils'

/**
 * videoDrawer create by Administrator
 * createTime 2020/11/2 13:43
 */
export default {
  name: 'VideoDrawer',
  components: {},
  filters: {},
  mixins: [],
  props: {
    videoData: {
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
    transferType(type) {
      switch (type) {
        case 'OFFLINE':
          return '线下'
        case 'ONLINE':
          return '线上'
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
.videoDrawer-wrap {

}
</style>
