<template>
  <div class="detailWrap">
    <item-card :item-data="itemData" />
    <div class="wrap">
      <time-line :time-data="timeLineData" />
    </div>
  </div>
</template>

<script>
import itemCard from '../components/itemCard'
import timeLine from '../components/timeLine'
import { getMealRecordDetail } from '../../../../service/sacc/dietRecord'

export default {
  components: {
    itemCard,
    timeLine
  },
  data() {
    return {
      itemData: {},
      timeLineData: [],
      customerId: undefined
    }
  },
  created() {
    const { name, age, avatar, customerId, isLeave } = this.$route.query
    this.customerId = customerId
    getMealRecordDetail(customerId).then(res => {
      const { data } = res.data
      this.itemData = {
        name,
        age,
        avatar,
        btns: true,
        times: data.eatNum,
        customerId,
        isLeave
      }
      this.timeLineData = data.dayRecordVOList
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
