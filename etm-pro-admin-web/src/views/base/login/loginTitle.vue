<template>
  <div class="loginTitle">
    <div class="menu">
      <i class="iconfont icon-erweima1" />
    </div>
    <div class="switch">
      <el-button
        type="text"
        :class="{active: isAccountLogin}"
        @click.stop="switchToAccountLogin"
      >账号登录</el-button>
      <el-divider direction="vertical" />
      <el-button
        type="text"
        :class="{active: !isAccountLogin}"
        @click.stop="switchToMailLogin"
      >短信登录</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginTitle',
  data() {
    return {

    }
  },
  computed: {
    isAccountLogin() {
      return this.$store.state.login.loginType === 'account'
    }
  },
  methods: {
    switchToAccountLogin() {
      this.$store.commit('login/SET_TYPE', 'account')
    },
    switchToMailLogin() {
      this.$store.commit('login/SET_TYPE', 'phone')
    }
  }
}
</script>

<style lang="scss">
  @import "src/styles/variables";
  @import "src/styles/mixin";

  .loginTitle {
    text-align: center;
    font-weight: bold;
    .menu {
      @include clearfix();
      i {
        font-size: 55px;
        float: right;
        @include c_colorTextSecondary();
      }
    }
    .switch {
      margin-top: 5px;
      margin-bottom: 25px;
      .el-divider--vertical {
        margin: 0 20px;
      }
      .el-button {
        font-size: 14px;
        font-weight: bold;
        padding: 0!important;
        span {
          @include c_colorTextSecondary();
        }
        &.active span {
          @include c_themeColor();
        }
      }
    }
  }
</style>
