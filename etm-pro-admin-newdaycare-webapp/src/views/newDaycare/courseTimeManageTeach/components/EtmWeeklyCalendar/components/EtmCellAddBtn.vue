<template>
  <div class="addScreen">
    <span><i class="el-icon-plus" /></span>
  </div>
</template>

<script>
export default {
  name: 'EtmCellAddBtn',
  props: {
    name: {
      type: String,
      default: function () {
        return '添加'
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .addScreen {
    @include etm-color();
    cursor: pointer;
    font-size: 14px;
    font-weight: 400;

    &:hover {
      opacity: 0.8;
    }

    .el-icon-plus {
      font-weight: bold;
    }
  }
</style>
