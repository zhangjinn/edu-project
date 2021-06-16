<template>
  <div class="detail">
    <etm-field-label
      type="left"
      label="收费科目"
    >
      {{ baseInfo.materialPriceName }}
    </etm-field-label>
    <etm-field-label
      type="left"
      label="费用标准名称"
    >
      {{ baseInfo.name }}
    </etm-field-label>
    <etm-field-label
      type="left"
      label="单价"
    >
      {{ formatMoney(baseInfo.price) }}元
    </etm-field-label>
    <etm-field-label
      type="left"
      label="是否启用"
    >
      {{ baseInfo.enable ? '是' : '否' }}
    </etm-field-label>
  </div>
</template>

<script>
import {
  queryPriceStandardById
} from '@/api/newDaycare/priceGuard'

export default {
  name: 'Detail',
  props: {
    standardId: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      baseInfo: {}
    }
  },
  created () {
    this.getMaterialPriceItemData()
  },
  methods: {
    getMaterialPriceItemData () {
      queryPriceStandardById({ materialPriceStandardId: this.standardId }).then((res) => {
        const { data } = res
        this.baseInfo = {
          materialPriceName: data.materialPriceName,
          name: data.name,
          price: data.price,
          enable: data.enable
        }
      })
    },
    formatMoney (money) {
      if (!isNaN(money)) {
        return money.toFixed(2)
      } else {
        return money
      }
    }
  }

}
</script>

<style scoped lang="scss">
</style>
