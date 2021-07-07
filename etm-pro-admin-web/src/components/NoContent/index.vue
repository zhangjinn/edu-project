<template>
  <div class="noContent">
    <div class="img">
      <img width="80" height="80" src="../../assets/images/noData.png">
    </div>
    <div class="text">{{ title }}</div>
  </div>
</template>

<script>
export default {
  name: 'NoContent',
  props: {
    title: {
      type: String,
      default: '暂无内容'
    }

  }
}

</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  .noContent{
    .img{
      margin: 24px auto 8px;
      width: 80px;
      height: 80px;
      img{
        width: 100%;
      }
    }
    .text{
      text-align: center;
      @include c_colorTextSecondary();
    }
  }
</style>
