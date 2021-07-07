<template>
  <div class="matter-list-wrap">
    <van-nav-bar
      title="交代列表"
      left-arrow
      fixed
      placeholder
      z-index="999"
      @click-left="onClickLeft"
    />
    <van-tabs v-model="active" @change="change">
      <van-tab title="待确认" />
      <van-tab title="已确认" />
    </van-tabs>
    <confirmed :active="active" />
  </div>
</template>

<script>
import confirmed from './hasConfirm/confirmed'
export default {
  name: 'Index',
  components: {
    confirmed
  },
  data() {
    return {
      active: 0
    }
  },
  methods: {
    change() {
      // console.log(this.active)
    },
    onClickLeft() {
      this.$router.push('/daycare_homepage')
    }
  }
}
</script>

<style lang="scss" scoped>
.matter-list-wrap {
  /deep/.van-nav-bar {
    height: 34px;
    line-height: 34px;
    background: $theme;
    .van-icon {
      color: #FFFFFF;
    }
    .van-nav-bar__title {
      font-size: 15px;
      color: #FFFFFF;
    }
  }
  .van-tans {
  }
}
</style>
