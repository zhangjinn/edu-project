<template>
  <div class="deposit-wrap">
    <etm-layout-split>
      <etm-title border size="big">订金详情</etm-title>
      <template v-if="depositData">
        <div>
          <etm-field-label label="订金单号" type="left">{{ depositData.orderNo }}</etm-field-label>
          <etm-field-label label="学员姓名" type="left">{{ depositData.childName }}</etm-field-label>
          <etm-field-label label="订金金额" type="left">{{ depositData.money.toFixed(2) }}</etm-field-label>
          <etm-field-label label="支付方式" type="left">{{ depositData.paymentName }}</etm-field-label>
          <etm-field-label label="收费日期" type="left">{{ parseTime(depositData.dateCharge, '{y}-{m}-{d}') }}</etm-field-label>
          <etm-field-label label="订金状态" type="left">{{ status(depositData.status) }}</etm-field-label>
          <etm-field-label label="登记人" type="left">{{ depositData.createName }}</etm-field-label>
          <etm-field-label label="登记时间" type="left">{{ crateTime(depositData.crateTime) }}</etm-field-label>
          <etm-field-label label="备注" type="left">{{ depositData.remark }}</etm-field-label>
        </div>
      </template>
    </etm-layout-split>
  </div>

</template>

<script>
/**
 * deposit create by 油麦菜
 * createTime 2020/9/17 10:15
 */
import { parseTime } from '@/utils'
import { queryEarnestMoney } from '@/api/newDaycare/incomeFlow'
export default {
  name: 'Deposit',
  components: {},
  filters: {},
  mixins: [],
  props: {
    row: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      depositData: '',
      parseTime: parseTime
    }
  },
  computed: {
    crateTime() {
      return (time) => {
        return parseTime(time, '{y}-{m}-{d} {h}:{i}:{s}')
      }
    },
    status() {
      return (s) => {
        if (s === 'NOT_USED') {
          return '未使用'
        } else {
          return '已使用'
        }
      }
    }
  },
  watch: {
    row: function(val) {
      this.queryData(val)
    }
  },
  created() {
  },
  mounted() {
    this.queryData(this.row)
  },
  methods: {
    queryData(row) {
      queryEarnestMoney({
        earnestMoneyId: row.sourceId
      }).then(res => {
        this.depositData = res.data
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.deposit-wrap {

}
</style>
