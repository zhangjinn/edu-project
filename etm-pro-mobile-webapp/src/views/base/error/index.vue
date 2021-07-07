<template>
  <div class="errorPage">
    <div class="main">
      <img src="../../../assets/images/net.png">
    </div>
    <div class="title">数据加载失败，请检查网络后重新加载</div>
    <div class="reload"><span @click="reload">刷新重试</span></div>
  </div>
</template>

<script>
export default {
  name: 'Error',
  mounted() {
    window.onload = () => {
      this.$router.back(-1)
    }
  },
  methods: {
    reload() {
      this.$router.back(-1)
    }
  }
}
</script>

<style lang="scss" scoped>

    .errorPage {
        padding-top: 150px;
        min-height: 100vh;
        background-color: $white;

        .main {
            margin: 0 auto;
            width: 135px;
        }

        .title {
            margin: 12px 0;
            font-size: 14px;
            color: $text-6;
        }

        .reload {
            font-size: 15px;
            color: $theme;
        }
    }

</style>
