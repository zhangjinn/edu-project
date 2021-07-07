<template>
  <div class="tabs">
    <van-tabs v-model="activeName">
      <van-tab title="在园表现" name="school" />
      <van-tab title="在家表现" name="home" />
    </van-tabs>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      activeName: this.props
    }
  },
  watch: {
    activeName(v) {
      this.$emit('update:value', v)
    }
  }
}
</script>

<style scoped lang="scss">
.tabs {
  ::v-deep .van-tabs__line {
    background-color: $theme;
  }
  ::v-deep .van-tabs {
    padding: 0 7px;
    background-color: $white;
  }
  ::v-deep .van-tab {
    color: #9a9a9a;
    flex: none;
    margin-right: 5px;
  }
  ::v-deep .van-tab--active {
    color: $theme;
  }
}
</style>
