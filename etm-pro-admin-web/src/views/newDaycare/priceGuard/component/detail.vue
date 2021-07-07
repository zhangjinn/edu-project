<template>
  <div class="detail">
    <ul>
      <li>
        <etm-field-label type="left" label="费用名称">{{ baseInfo.name }}</etm-field-label>
      </li>
      <li>
        <etm-field-label type="left" label="单价">{{ baseInfo.sellPrice }}元</etm-field-label>
      </li>
      <li>
        <etm-field-label type="left" label="费用性质">{{ baseInfo.property }}</etm-field-label>
      </li>
    </ul>
  </div>
</template>

<script>
import { enumerationFilter } from '@/utils'
import {
  queryGuardPriceById
} from '@/api/newDaycare/priceGuard'

export default {
  name: 'Detail',
  props: {
    itemId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      baseInfo: {},
      propertyOptions: [
        {
          value: 'once',
          name: '一次性'
        }, {
          value: 'cycle',
          name: '周期性'
        }
      ]
    }
  },
  created() {
    this.getMaterialPriceItemData()
  },
  methods: {
    getMaterialPriceItemData() {
      const materiaPricelId = this.itemId
      queryGuardPriceById({ materialPriceId: materiaPricelId }).then((res) => {
        const { data } = res
        this.baseInfo = {
          name: data.materialPriceName,
          sellPrice: data.sellPrice,
          property: enumerationFilter(data.property, this.propertyOptions)
        }
      })
    }
  }

}
</script>

<style scoped lang="scss">
.detail {

}
</style>
