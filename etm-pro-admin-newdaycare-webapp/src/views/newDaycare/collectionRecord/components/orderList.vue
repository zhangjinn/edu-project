<template>
  <div class="orderList-wrap">
    <etm-layout-split>
      <etm-title
        :show-line="false"
        border
        size="big"
      >
        订金详情
      </etm-title>
      <div>
        <etm-field-label
          label="订金单号"
          type="left"
        >
          {{ earnestDetail.orderNo }}
        </etm-field-label>
        <etm-field-label
          label="学员姓名"
          type="left"
        >
          {{ earnestDetail.childName }}
        </etm-field-label>
        <etm-field-label
          label="业务类型"
          type="left"
        >
          {{ type[earnestDetail.type] }}
        </etm-field-label>
        <etm-field-label
          label="订金金额"
          type="left"
        >
          {{ earnestDetail.money }}
        </etm-field-label>
        <etm-field-label
          label="支付方式"
          type="left"
        >
          {{ payType[earnestDetail.paymentId] }}
        </etm-field-label>
        <etm-field-label
          label="支付单号"
          type="left"
        >
          {{ earnestDetail.paymentOrderNo }}
        </etm-field-label>
        <etm-field-label
          label="收费日期"
          type="left"
        >
          {{ earnestDetail.dateCharge }}
        </etm-field-label>
        <etm-field-label
          label="订金状态"
          type="left"
        >
          {{
            earnestDetail.status !== 'USED' ? '未使用' : '已使用'
          }}
        </etm-field-label>
        <etm-field-label
          label="登记人"
          type="left"
        >
          {{ earnestDetail.createName }}
        </etm-field-label>
        <etm-field-label
          label="登记时间"
          type="left"
        >
          {{ earnestDetail.crateTime }}
        </etm-field-label>
        <etm-field-label
          label="备注"
          type="left"
        >
          {{ earnestDetail.remark }}
        </etm-field-label>
      </div>
    </etm-layout-split>
  </div>
</template>

<script>
import { queryDeposit, queryPayType } from '@/api/newDaycare/contract'
import { parseTime } from '@/utils'
import { deepClone } from '@/views/newDaycare/contract/common'

/**
 * orderList create by Administrator
 * createTime 2021/3/10/010 16:54
 */
export default {
  name: 'OrderList',
  components: {},
  filters: {},
  mixins: [],
  props: {
    prop: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      earnestDetail: {},
      type: {
        TEACH: '早教',
        TODDLER: '幼儿园',
        CARE: '托育园'
      },
      payType: []
    }
  },
  computed: {},
  watch: {
  },
  created () {
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      queryPayType().then(res => {
        const _result = {}

        res.data.forEach(cur => {
          _result[cur.financePayTypeId] = cur.financePayTypeName
        })

        this.payType = _result
      })
      queryDeposit({ earnestMoneyId: this.prop.id }).then(res => {
        res.data.dateCharge = parseTime(res.data.dateCharge, '{y}-{m}-{d}')
        // console.log(res.data)
        res.data.crateTime = parseTime(res.data.crateTime, '{y}-{m}-{d}')
        res.data.chargeDate = parseTime(res.data.dateCharge, '{y}-{m}-{d}')
        res.data.paymentType = `${res.data.paymentId}`

        this.earnestDetail = deepClone(res.data)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
