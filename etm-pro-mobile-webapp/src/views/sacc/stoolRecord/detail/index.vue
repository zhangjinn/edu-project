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
import { getStoolRecordDetail } from '../../../../service/sacc/stoolRecord'

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
    getStoolRecordDetail(customerId).then(res => {
      const { data } = res.data
      this.timeData = data.dayStoolRecordVOList
      let lastTime
      if (data.dayStoolRecordVOList.length) {
        lastTime = data.dayStoolRecordVOList[0].stoolRecordVOList[0].stoolTime
      } else {
        lastTime = 0
      }
      this.itemData = {
        name,
        age,
        avatar,
        customerId,
        times: data.stoolNum,
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
