<template>
  <etm-main-body>
    <main-content />
  </etm-main-body>
</template>
<script>
import etmMainBody from '@/layout/main/EtmMainBody'
import mainContent from './mainContent'
export default {
  name: 'Index',
  components: {
    etmMainBody,
    mainContent
  }

}
</script>

<style scoped>

</style>
