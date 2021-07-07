<template>
  <div class="settingTitle">
    <i class="iconfont iconleft" @click.stop="$router.back(-1)" />
    <slot />
    <i :class="noSetting ? 'iconfont iconsetting noView' : 'iconfont iconsetting'" @click.stop="$router.push('/guardcare_commentSetting')" />
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
    return {
    }
  },
  computed: {
  },
  methods: {
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
    color: $text-5;
  }
  i {
    color: $white;
  }
  i.noView {
    visibility: hidden;
  }
}
</style>
