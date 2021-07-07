<template>
  <div class="structureC">
    <div class="left-part secondPageHeight">
      <slot name="left" />
    </div>
    <div class="right-part secondPageHeight">
      <slot name="right" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'StructureC'
}
</script>

<style scoped lang="scss">

  .structureC {
    display: flex;
    .left-part, .right-part {
      /*height: calc(100vh - 151px);*/
      overflow: auto;
      @include bgc_white();
      border-radius: 4px;
    }
    .left-part {
      width: 210px;
    }
    .right-part {
      width: calc(100% - 226px);
      margin-left: 16px;
    }
  }
</style>
