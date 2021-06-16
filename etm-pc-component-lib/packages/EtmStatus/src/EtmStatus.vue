<template>
  <div class="EtmStatus-wrap">
    <span
      :class="[ 'EtmStatus', type ? 'EtmStatus--'+ type : '' ]"
    />
    <span class="EtmStatus--text"><slot /></span>
  </div>
</template>

<script>
/**
     *  2020/5/19 10:42
     *  haijinsha
     */
export default {
  name: 'EtmStatus',
  filters: {},
  mixins: [],
  props: {
    type: {
      type: String,
      default: 'active',
      validator(val) {
        return ['active', 'danger', 'inactive', 'primary'].includes(val)
      }
    }
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {}
}
</script>

<style lang="scss">
@import "../../styles/src/etm/status";
</style>
