<template>
  <div
    class="EtmText-wrap"
  >
    <button
      type="button"
      :class="[
        'etm-text--button',
        'etm-text--'+ type
      ]"
      @click="handleClick"
    >
      <slot>按钮</slot>
    </button>
  </div>
</template>

<script>
/**
 * EtmText create by    dengShen
 * createTime   2020/5/13 15:47:49
 */
export default {
  name: 'EtmText',
  components: {},
  props: {
    type: {
      type: String,
      default: 'primary',
      validator(val) {
        return ['normal', 'primary', 'danger', 'success', 'warn'].includes(val)
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
  methods: {
    handleClick(e) {
      this.$emit('click', e)
    }
  }
}
</script>

<style lang="scss">
  @import "../../styles/src/etm/text";
</style>
