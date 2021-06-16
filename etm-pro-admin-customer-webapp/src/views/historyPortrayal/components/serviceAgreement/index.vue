<template>
  <div
    class="serviceAgreement"
    v-html="agreementHTML"
  />
</template>

<script>
import { queryAgreementByType } from '@/api/base/base'

export default {
  name: 'Index',
  data () {
    return {
      agreementHTML: ''
    }
  },
  mounted () {
    queryAgreementByType('bpcRechargeAgreement').then((res) => {
      this.agreementHTML = res.data
    })
  }
}
</script>
