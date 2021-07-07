<template>
  <div class="settingTitle">
    <i class="iconfont iconleft" @click.stop="back" />
    <slot />
    <i
      :class="noSetting ? 'iconfont iconsetting noView' : 'iconfont iconsetting'"
      @click.stop="$router.push('daycare_commentCareSetting')"
    />
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
  methods: {
    back() {
      this.$emit('backTo')
    }
  }
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
    color: white;
    line-height: 34px;
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
