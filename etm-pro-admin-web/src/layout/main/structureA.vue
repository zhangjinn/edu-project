<template>
  <div class="structureA">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'StructureA'
}
</script>

<style scoped lang="scss">
  @import "~@/styles/variables.scss";
  @import "~@/styles/mixin.scss";
  .structureA {
    height: calc(100vh - 125px);
    @include bgc_white();
    border-radius: 4px;
    overflow: auto;
  }
</style>
