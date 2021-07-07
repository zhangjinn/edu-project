<template>
  <div class="morningCheck">
    <check type="morning" :date="date" />
  </div>
</template>

<script>
import check from '../component/check'

export default {
  name: 'Index',
  components: {
    check
  },
  data() {
    return {
      date: null
    }
  },
  created() {
    this.date = this.$route.query.time
  }
}
</script>

<style scoped>

</style>
