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
import { getEmotionRecordDetail } from '../../../../service/sacc/emotionRecord'

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
    this.itemData = {
      name,
      age,
      btns: true,
      avatar,
      customerId,
      isLeave
    }
    getEmotionRecordDetail(customerId).then(res => {
      const { data } = res.data
      this.timeData = data
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
