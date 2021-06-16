<template>
  <div
    class="commitmentLetter-wrap"
    v-html="agreementHTML"
  />
</template>

<script>/**
 * commitmentLetter create by Administrator
 * createTime 2020/09/10 10:03
 */
import { queryAgreementByType } from '@/api/base/base'

export default {
  name: 'CommitmentLetter',
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
    queryAgreementByType('bpcPromiseAgreement').then(res => {
      this.agreementHTML = res.data
    })
  },
  methods: {}
}
</script>
