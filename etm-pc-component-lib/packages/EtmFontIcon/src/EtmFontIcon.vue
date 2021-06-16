<template>
  <i class="EtmFontIcon-wrap" :class="['EtmFontIcon-wrap-' + name, iconTag]" @click="handleClick" />
</template>

<script>
export default {
  name: 'EtmFontIcon',
  props: {
    name: {
      type: String,
      default: 'plus',
      validator(val) {
        return ['plus', 'minus'].includes(val)
      }
    }
  },
  computed: {
    iconTag() {
      return `el-icon-${this.name}`
    }
  },
  methods: {
    handleClick(e) {
      this.$emit('click', e)
    }
  }
}
</script>

<style lang="scss">
  @import "../../styles/src/etm/fontIcon";
</style>
