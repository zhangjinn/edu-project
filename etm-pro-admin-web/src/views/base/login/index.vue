<template>
  <div ref="loginContainer" class="loginContainer">

    <div class="content">
      <div class="login">
        <div class="loginLogo">
          <!--<div class="lang">-->
          <!--  <el-dropdown @command="change">-->
          <!--    <span class="el-dropdown-link">-->
          <!--      切换语言 | Language<i class="el-icon-arrow-down el-icon&#45;&#45;right" />-->
          <!--    </span>-->
          <!--    <el-dropdown-menu slot="dropdown">-->
          <!--      <el-dropdown-item command="zh">简体中文</el-dropdown-item>-->
          <!--      <el-dropdown-item command="en">English</el-dropdown-item>-->
          <!--    </el-dropdown-menu>-->
          <!--  </el-dropdown>-->
          <!--</div>-->
          <img :src="config.loginLogo" alt="loginLogo">
          <div class="loginLogoText">{{ config.loginTitle }}</div>
        </div>
        <div class="loginForm">
          <!-- <div class="title-container">
            <div class="loginTitle">
              <span :class="{active: loginType === 'account'}" @click.stop="switchLoginType('account')">{{ $t('login.accountLoginBtnText') }}</span>
              <span :class="{active: loginType === 'phone'}" @click.stop="switchLoginType('phone')">{{ $t('login.messageLoginBtnText') }}</span>
            </div>
          </div> -->

          <div class="loginArea">
            <div class="accountLogin">
              <account v-if="loginType === 'account'" ref="account" @submit="submit" />
              <phone v-else ref="phone" @submit="submit" />
            </div>
          </div>

          <login-button ref="loginBtn" class="loginButtonBox" :form="$refs" />
          <div class="switchLogin">
            <a v-show="loginType === 'account'" @click.stop="switchLoginType('phone')">短信验证登录</a>
            <a v-show="loginType === 'phone'" @click.stop="switchLoginType('account')">账号密码登录</a>
          </div>
        </div>

        <img class="loginBottom" :src="bottomLogo" alt="login-bottom">
      </div>

    </div>
    <footer>
      <span>
        <a target="_blank" href="http://etmcn.com/">
          &copy;&nbsp;etmcn.com
        </a>
      </span>
    </footer>
  </div>
</template>

<script>
import loginButton from './loginButton'
import account from './login/account'
import phone from './login/phone'
import { changeLang } from '@/i18n'
import { getConfig, removeAllInfo } from '@/utils/auth'
import pubsub from '@/utils/PubSub'

export default {
  name: 'Login',
  components: {
    loginButton,
    account,
    phone
  },
  data() {
    return {
      config: getConfig()
    }
  },
  computed: {
    loginType() {
      return this.$store.state.login.loginType
    },
    bottomLogo() {
      const url = this.config.loginBottomBg || ''
      if (url.includes('http')) {
        return url
      } else {
        return require('../../../assets/images/login-bottom.png')
      }
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        // this.redirect = route.query && route.query.redirect
        this.$store.commit('login/SET_REDIRECT', route.query && route.query.redirect)
      },
      immediate: true
    }
  },
  created() {
    pubsub.subscribe('configReady', () => {
      this.config = getConfig()
    })
  },
  mounted() {
    if (this.config.loginBg) this.$refs.loginContainer.style.background = `#fff url(${this.config.loginBg}) no-repeat`
    removeAllInfo()
  },
  methods: {
    change(lang) {
      console.log(lang)
      changeLang(lang)
    },
    switchLoginType(type) {
      this.$store.commit('login/SET_TYPE', type)
    },
    submit() {
      this.$refs.loginBtn.login()
    }
  }
}
</script>

<style lang="scss">
  .loginContainer {
    position: relative;
    height: 100vh;
    // background: $white url("../../../assets/images/login-bg.png") no-repeat;
    background-color: $white;
    background-image: url("../../../assets/images/login-bg.png");
    background-repeat: no-repeat;
    background-size: contain;
    overflow: hidden;
    font-family: "Microsoft YaHei",sans-serif;
    .content {
      width: 386px;
      height: 567px;
      position: absolute;
      top: -20px;
      left: 0;
      bottom: 0;
      right: 0;
      margin: auto;
      display: flex;
      border-radius: 10px;
      box-shadow:0px 2px 8px 0px rgba(143,156,209,0.1);
      @include bgc_white();
      .login {
        position: relative;
        width: 100%;
        @include c_white();
        font-size: 24px;
        font-weight: 400;
        overflow: hidden;
        .loginLogo{
          text-align: center;
          padding: 40px 0 0;
          border-radius: 10px 10px 0 0;
          font-size: 0;
          img {
            height: 70px;
            width: 70px;
          }
          .loginLogoText {
            margin-top: 24px;
            line-height: 1;
            font-size: 18px;
            color: #6D7486;
            font-weight: bold;
          }
          .lang {
            text-align: right;
            padding-right: 24px;
            margin-bottom: 16px;
            /deep/ .el-dropdown {
              color: #eee!important;
            }
          }
        }
        .loginForm{
          @include bgc_white();
          .switchLogin {
            margin-top: 18px;
            @include c_main_color();
            text-align: center;
            font-size: 12px;
          }
          .loginTitle{
            font-size: 20px;
            font-weight: 400;
            line-height: 20px;
            @include c_text_color();
            padding-top: 30px;
            text-align: center;
            span {
              cursor: pointer;
              &.active {
                @include c_main_color();
              }
              & + span {
                margin-left: 78px;
              }
            }
          }
        }
        .loginBottom {
          position: absolute;
          bottom: 0;
          display: block;
          height: 50px;
        }
      }
    }
    footer {
      position: fixed;
      bottom: 24px;
      justify-content: center;
      display: flex;
      align-items: center;
      width: 100%;
      span {
        font-size: 14px;
        a {
          color: #6D7486;
        }
      }
    }
  }
</style>
