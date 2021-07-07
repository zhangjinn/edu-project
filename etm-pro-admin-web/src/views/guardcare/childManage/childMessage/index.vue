<template>
  <div class="childMessage">
    <etm-main-body>
      <manage />
    </etm-main-body>
  </div>
</template>

<script>
import manage from './manage'

export default {
  name: 'Index',
  components: {
    manage
  },
  data() {
    return {
    }
  }
}
</script>

<style scoped>

</style>
