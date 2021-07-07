<template>
  <div v-wechat-title="subject.checkSettingsName" class="checkPage">
    <check v-if="subject" :subject="subject" />
  </div>
</template>

<script>
import check from '../components/check'
import { queryCheckType } from '@/service/daycare/bodyCheck'

export default {
  name: 'Index',
  components: {
    check
  },
  data() {
    return {
      sub: null,
      subject: {}
    }
  },
  created() {
    this.sub = this.$route.query.subject
    // console.log(this.subject)
  },
  mounted() {
    this.getType()
  },
  methods: {
    getType() {
      queryCheckType({ checkSettingsId: this.sub }).then(res => {
        // console.log(res.data)
        this.subject = res.data.data
        // console.log(this.subject)
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
