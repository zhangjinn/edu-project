<template>
  <div class="settingTitle">
    <div>
      <i class="iconfont iconleft" @click.stop="$router.back(-1)"/>
    </div>
    <slot/>
    <div>
      <slot name="right"></slot>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    noSetting: {
      type: Boolean,
      default: false
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
  background-color: $theme;

  span {
    font-size: 15px;
    color: $text-5;
  }

  i {
    color: $white;
  }

  i.noView {
    visibility: hidden;
  }

  ::v-deep .van-hairline--top-bottom::after, .van-hairline-unset--top-bottom::after {
    display: none;
  }
}
</style>
