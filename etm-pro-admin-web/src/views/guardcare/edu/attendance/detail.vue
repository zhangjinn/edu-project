<template>
  <div class="detail">
    detail
  </div>
</template>
<script>
import { queryLeaveItemDetail } from '@/api/guardcare/edu/attendance'
export default {
  data() {
    return {
    }
  },
  computed: {
  },
  methods: {
    getData(id) {
      queryLeaveItemDetail(id).then(res => {

      }).catch(err => {
        console.error(err)
      })
    }
  }
}
</script>

<style scoped>
</style>
