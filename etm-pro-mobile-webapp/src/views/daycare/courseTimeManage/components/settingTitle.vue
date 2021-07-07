<template>
  <div class="settingTitle">
    <div class="title-left">
      <i v-if="goBack" class="iconfont iconleft" @click.stop="$router.back(-1)" />
      <slot name="left" />
    </div>
    <div class="title ell"><slot /></div>
    <div class="title-right">
      <slot name="right" />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    goBack: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {}
  },
  computed: {},
  methods: {}
}
</script>

<style scoped lang="scss">
.settingTitle {
  height: 34px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;

  .ell{
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }

  .title-left,
  .title-right{
    width: 20%;
  }

  .title-left{
    text-align: left;
  }

  .title-right{
    text-align: right;
  }

  .title{
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  span {
    font-size: 15px;
    color: $text-5;
  }

  i {
    color: #555555;
  }

  i.noView {
    visibility: hidden;
  }

  ::v-deep .van-hairline--top-bottom::after, .van-hairline-unset--top-bottom::after {
    display: none;
  }
}
</style>
