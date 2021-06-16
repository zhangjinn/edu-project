<template>
  <div class="etm-main-body">
    <sub-bread
      v-if="bread"
      :history-key="historyKey"
      :data="breadData"
    />
    <div
      v-else
      class="content"
    >
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
      default () {
        return []
      }
    }
  }
}
</script>

<style scoped lang="scss">
.etm-main-body {
  height: inherit;

  .content {
    //@include bgc_white();
    /*height: calc(100vh - 143px);*/
    margin: 16px 0;
  }
}
</style>
