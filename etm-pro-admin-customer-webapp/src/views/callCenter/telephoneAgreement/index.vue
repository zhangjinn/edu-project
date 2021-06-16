<template>
  <div
    class="telephoneAgreement"
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
    queryAgreementByType('bpcTelephoneAgreement').then(res => {
      this.agreementHTML = res.data
    })
  }
}
</script>
