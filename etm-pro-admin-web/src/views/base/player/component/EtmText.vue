<template>
  <div
    class="EtmText-wrap"
    :class="[
      'etm-text--'+ type
    ]"
    @click="handleClick"
  >
    <slot />
  </div>
</template>

<script>
/**
   * EtmText create by    dengShen
   * createTime   2020/3/16 15:47:49
   */
export default {
  name: 'EtmText',
  components: {},
  props: {
    type: {
      type: String,
      default: 'normal',
      validator(val) {
        return ['normal', 'primary', 'danger'].includes(val)
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
    this.init()
  },
  methods: {
    init() {
    },
    handleClick(e) {
      this.$emit('click', e)
    }
  }
}
</script>

<style lang="scss" scoped>
  .EtmText-wrap {
    display: inline-block;
    cursor: pointer;
    white-space: nowrap;
    margin-right: 18px;
  }

  .etm-text--primary {
    color: $main-color
  }

  .etm-text--danger {
    color: $error-color
  }

  .etm-text--normal {
    color: $title-color
  }
</style>
