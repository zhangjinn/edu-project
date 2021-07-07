<template>
  <div v-wechat-title="subject" class="checkPage">
    <check v-if="subject" :subject="subject" />
  </div>
</template>

<script>
import check from '../components/check'

export default {
  name: 'Index',
  components: {
    check
  },
  data() {
    return {
      subject: ''
    }
  },
  created() {
    this.subject = this.$route.query.subject
  },
  methods: {}
}
</script>

<style lang="scss" scoped>

</style>
