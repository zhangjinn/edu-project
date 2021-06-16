<template>
  <span class="etmLabel">
    <slot />:
  </span>
</template>
<script>

export default {
  name: 'EtmLabel'

}
</script>

<style lang="scss" scoped>
.etmLabel{

  @include c_text_color();
}
</style>
