<template>
  <div
    class="intPop-wrap"
    v-html="agreementHTML"
  />
</template>

<script>/**
 * intPop create by Administrator
 * createTime 2020/09/04 16:13
 */
import { queryAgreementByType } from '@/api/base/base'

export default {
  name: 'IntPop',
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
    queryAgreementByType('bpcTelephoneAgreement').then(res => {
      this.agreementHTML = res.data
    })
  },
  methods: {}
}
</script>
