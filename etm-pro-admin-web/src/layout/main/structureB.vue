<template>
  <div class="structureB">
    <div class="up-part">
      <slot name="up" />
    </div>
    <div class="down-part">
      <div class="down-left-part">
        <slot name="left" />
      </div>
      <div class="down-right-part">
        <slot name="right" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StructureB'
}
</script>

<style scoped lang="scss">
  @import "~@/styles/variables.scss";
  @import "~@/styles/mixin.scss";
  .structureB {
    .up-part, .down-left-part, .down-right-part {
      @include bgc_white();
      border-radius: 4px;
    }
    .up-part {
      height: 86px;
      overflow: auto;
    }
    .down-part {
      display: flex;
      height: calc(100vh - 215px);
      margin-top: 16px;
      .down-left-part {
        overflow: auto;
        width: 510px;
      }
      .down-right-part {
        overflow: auto;
        margin-left: 16px;
        width: calc(100% - 526px);
      }
    }
  }
</style>
