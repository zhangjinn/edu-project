<template>
  <div class="settingTitle">
    <i class="iconfont iconleft" @click.stop="clickToPath" />
    <slot />
    <i
      v-if="noSetting"
      :class="noSetting ? 'iconfont iconsetting noView' : 'iconfont iconsetting'"
      @click.stop="$router.push(toPath)"
    />
    <!-- 占位 -->
    <span v-else />
  </div>
</template>
<script>
export default {
  props: {
    noSetting: {
      type: Boolean,
      default: false
    },
    toPath: {
      type: [String, Number],
      default: ''
    },
    bgColor: {
      type: String,
      default: '#10C2C4'
    }
  },
  data() {
    return {}
  },
  computed: {},
  methods: {
    clickToPath() {
      if (!this.toPath) {
        this.$router.back()
      } else {
        this.$router.push(this.toPath)
      }
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
  color: #fff;

  span {
    font-size: 15px;
    //color: $text-5;
  }

  i {
    //color: #999999;
    color: #fff;
  }

  i.noView {
    visibility: hidden;
  }

  ::v-deep .van-hairline--top-bottom::after, .van-hairline-unset--top-bottom::after {
    display: none;
  }
}
</style>
