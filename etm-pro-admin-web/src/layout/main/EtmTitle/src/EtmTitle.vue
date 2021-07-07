<template>
  <div class="EtmTitle-wrap">
    <div class="text" :class="[ border ? 'text--border': '']">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'EtmTitle',
  props: {
    border: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang="scss" scoped>
  .EtmTitle-wrap {
    height: 56px;
    display: flex;
    align-items: center;
    font-size: 16px;
    padding: 0 24px;
    position: relative;
    &:before {
      position: absolute;
      left: 0;
      top: 20px;
      display: inline-block;
      content: '';
      width: 3px;
      height: 16px;
      vertical-align: middle;
      @include bgc_main_color();
    }
    .text {
      width: 100%;
      height: inherit;
      display: flex;
      align-items: center;
      @include c_title_color();
      &--border{
        border-bottom: 1px solid;
        @include bc_divide_color();
      }
    }
  }
</style>
