<template>
  <div class="etm-main-body">
    <sub-bread
      v-if="bread"
      :history-key="historyKey"
      :data="breadData"
    />
    <div v-else class="content">
      <slot />
    </div>
  </div>
</template>
<script>
import subBread from './subBread'
export default {
  name: 'EtmMainBody',
  components: {
    subBread
  },
  props: {
    bread: {
      type: Boolean,
      default: false
    },
    historyKey: {
      type: String,
      default: 'defaultSubBreadHistoryKey' + Math.random()
    },
    breadData: {
      type: Array,
      default() {
        return []
      }
    }
  }
}
</script>

<style lang="scss">
@import "../../styles/src/etm/mainBody.scss"
</style>

