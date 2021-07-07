<template>
  <div class="detail">
    <ul>
      <li><etm-field-label type="left" label="菜肴名称">{{ baseInfo.dishName }}</etm-field-label></li>
      <li><etm-field-label type="left" label="菜肴类型">{{ baseInfo.dishType }}</etm-field-label></li>
      <li><etm-field-label type="left" label="食材用量">{{ baseInfo.ingredients }}</etm-field-label></li>
    </ul>
  </div>
</template>

<script>
import { getFoodDetail } from '@/api/guardcare/careManage/recipesManage'

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
      baseInfo: {
        dishName: null,
        dishType: null,
        ingredients: null
      }
    }
  },
  created() {
    this.getFoodDetailData()
  },
  methods: {
    getFoodDetailData() {
      const id = this.itemId
      getFoodDetail(id).then((res) => {
        const { data } = res
        this.baseInfo = {
          dishName: data.foodName,
          dishType: data.typeName,
          ingredients: data.description
        }
      })
    }
  }

}
</script>

<style scoped lang="scss">
  .detail{

  }
</style>
