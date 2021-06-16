<template>
  <i
    class="EtmFontIcon"
    :class="iconTag"
  />
</template>

<script>
export default {
  name: 'IconFontClass',
  props: {
    name: {
      type: String,
      default: 'plus',
      validator (val) {
        return ['plus', 'minus'].includes(val)
      }
    }
  },
  computed: {
    iconTag () {
      return `el-icon-${this.name}`
    }
  }
}
</script>

<style scoped lang="scss">
  .EtmFontIcon {
    cursor: pointer;
    font-weight: bold;
  }

  .el-icon-plus {
    @include etm-color();
  }

  .el-icon-minus {
    @include c_error_color();
  }
</style>
