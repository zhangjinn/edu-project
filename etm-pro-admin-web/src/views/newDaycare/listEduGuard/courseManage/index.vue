<template>
  <div class="courseManage">
    <etm-main-body>
      <main-content />
    </etm-main-body>
  </div>
</template>

<script>
import etmMainBody from '@/layout/main/EtmMainBody'
import mainContent from './main'
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
