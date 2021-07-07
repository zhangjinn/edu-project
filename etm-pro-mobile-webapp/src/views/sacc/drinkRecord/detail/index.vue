<template>
  <div class="detailWrap">
    <item-card :item-data="itemData" />
    <div class="wrap">
      <time-line :time-data="timeData" />
    </div>
  </div>
</template>

<script>
import itemCard from '../components/itemCard'
import timeLine from '../components/timeLine'
import { getDrinkRecordDetail } from '../../../../service/sacc/drinkRecord'

export default {
  components: {
    itemCard,
    timeLine
  },
  data() {
    return {
      itemData: {},
      timeData: [],
      customerId: undefined
    }
  },
  created() {
    const { name, age, avatar, customerId, isLeave } = this.$route.query
    this.customerId = customerId
    getDrinkRecordDetail(customerId).then(res => {
      const { data } = res.data
      this.timeData = data.drinkingDetails
      let lastTime
      if (data.drinkingDetails.length) {
        lastTime = data.drinkingDetails[0].list[0].drinkingTime
      } else {
        lastTime = 0
      }
      this.itemData = {
        name,
        age,
        avatar,
        customerId,
        times: data.drinkingCount,
        btns: true,
        lastTime,
        isLeave
      }
    })
  }
}
</script>

<style lang="scss" scoped>

    .detailWrap {
        height: calc(100vh - 50px);
        background-color: $white;
    }
</style>
