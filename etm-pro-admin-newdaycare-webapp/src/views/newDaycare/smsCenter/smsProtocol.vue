<template>
  <div
    class="smsProtocol-wrap"
    v-html="agreementHTML"
  />
</template>

<script>/**
 * smsProtocol create by Administrator
 * createTime 2020/09/04 9:51
 */
import { queryAgreementByType } from '@/api/base/base'

export default {
  name: 'SmsProtocol',
  components: {},
  filters: {},
  mixins: [],
  props: {},
  data () {
    return {
      agreementHTML: ''
    }
  },
  computed: {},
  watch: {},
  created () {
  },
  mounted () {
    queryAgreementByType('bpcMessageAgreement').then(res => {
      this.agreementHTML = res.data
    })
  },
  methods: {}
}
</script>
