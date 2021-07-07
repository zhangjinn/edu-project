<template>
  <div class="orderMange_neuroo">
    <etm-main-body
      bread
      :bread-data="bread"
      history-key="orderManage_neuroo"
    />
  </div>
</template>
<script>
import EtmMainBody from '@/layout/main/EtmMainBody/src/EtmMainBody'
import manage from './manage'
import modify from './modify'
export default {
  components: {
    EtmMainBody
  },
  data() {
    return {
      bread: [
        { name: '订单管理', route: 'manage', view: manage },
        { name: '订单修改', route: 'modify', view: modify }
      ]
    }
  },
  computed: {
  },
  methods: {
  }
}
</script>

<style scoped lang="scss">

</style>
