<template>
  <div class="EtmDot-wrap">
    <span
      class="etm-dot"
      :class="[
        type ? 'etm-dot--'+ type : ''
      ]
      "
    />
  </div>
</template>

<script>
/**
   *  2020/4/3 10:42
   *  haijinsha
   */
export default {
  name: 'EtmDot',
  filters: {},
  mixins: [],
  props: {
    type: {
      type: String,
      default: 'active'
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

<style lang="scss" scoped>
  .EtmDot-wrap {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
    margin-right: 10px;
    .etm-dot {
      display: inline-block;
      width: 6px;
      height: 6px;
      -webkit-border-radius: 50%;
      -moz-border-radius: 50%;
      border-radius: 50%;

      &--active {
        background-color: #67C23A;
      }

      &--disabled {
        background-color: #F5222D;
      }

      &--inactive {
        background-color: #999;
      }
    }
  }
</style>
