<template>
  <div class="login-wrap">
    <div class="login-view">
      <div class="shadowBox" />
      <div class="left">
        <img alt="" :src="config.loginPost">
      </div>
      <div class="right">
        <header class="header">
          <div class="logo">
            <img alt="" :src="config.loginLogo">
          </div>

          <div v-if="isDisableWechat" class="qrcode">
            <img
              v-show="currentLoginType === 'pc'"
              alt=""
              src="../../../assets/images/login/qr.png"
              @click="handleChangeLoginType('wechatLogin')"
            >
            <img
              v-show="currentLoginType === 'wechat' || currentLoginType === 'wechatLogin'"
              alt=""
              src="../../../assets/images/login/pc.png"
              @click="handleChangeLoginType('pc')"
            >

          </div>
        </header>
        <div v-show="currentLoginType === 'pc'" class="account-login">
          <div class="tabs">
            <div
              :class="['tab-item', {'active' : active === 'account'}]"
              @click="handleActive('account')"
            >
              账号登录
            </div>
            <div
              :class="['tab-item', {'active' : active === 'phone'}]"
              @click="handleActive('phone')"
            >
              短信登录
            </div>
          </div>
          <div class="tab-content">
            <div v-show="active === 'account'" class="account">
              <el-form :model="login" :rules="loginRules" size="big" @submit.native.prevent="handleLogin">
                <el-form-item prop="telephone">
                  <el-input
                    v-model="login.telephone"
                    placeholder="请输入手机号码"
                    prefix-icon="el-icon-mobile-phone"
                    @input="login.telephone = login.telephone.slice(0,11)"
                  />
                </el-form-item>
                <el-form-item prop="password">
                  <el-input v-model="login.password" placeholder="请输入密码" prefix-icon="el-icon-lock" type="password" />
                </el-form-item>
                <el-form-item class="agreeItem" prop="password">
                  <etm-user-agreement />
                </el-form-item>
                <el-form-item prop="password">
                  <el-button class="login-btn" native-type="submit" type="primary">登录</el-button>
                </el-form-item>
              </el-form>
            </div>

            <div v-show="active === 'phone'" class="phone">
              <el-form :model="login" :rules="loginRules" size="big" @submit.native.prevent="handleLogin">
                <el-form-item prop="telephone">
                  <el-input
                    v-model="login.telephone"
                    placeholder="请输入手机号码"
                    prefix-icon="el-icon-mobile-phone"
                    @input="login.telephone = login.telephone.slice(0,11)"
                  />
                </el-form-item>
                <el-form-item prop="password">
                  <div style="display:flex;">
                    <el-input
                      v-model="login.captcha"
                      placeholder="请输入图形验证码"
                      prefix-icon="iconfont iconsafetycertificate"
                      @input="login.captcha = login.captcha.slice(0,6)"
                    />
                    <img
                      :src="login.captchaSrc"
                      alt="验证码"
                      class="picture"
                      @click.stop="refreshCaptcha"
                    >
                  </div>
                </el-form-item>
                <el-form-item
                  prop="password"
                >
                  <div style="display:flex;">
                    <el-input
                      v-model="login.smsCaptcha"
                      placeholder="请输入短信验证码"
                      prefix-icon="iconfont iconmail"
                      @input="login.smsCaptcha = login.smsCaptcha.slice(0,6)"
                    />
                    <span
                      class="code-text"
                      :class="login.codeText.includes('验证码') ? 'main' : ''"
                      @click="handleCode"
                    >{{ login.codeText }}</span>
                  </div>

                </el-form-item>
                <el-form-item class="agreeItem" prop="password">
                  <etm-user-agreement />
                </el-form-item>
                <el-form-item prop="password">
                  <el-button native-type="submit" class="login-btn" type="primary">登录</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
        <div v-show="currentLoginType === 'wechatLogin'" id="login_container" class="wechat-login" />
        <!--        <div v-show="currentLoginType === 'wechat'" class="wechat-verify">-->
        <!--          <div class="wechat-verify__header">-->
        <!--            <div class="wechat-verify__title">您的微信号已通过验证</div>-->
        <!--            <div class="wechat-verify__description">首次使用微信登录请先绑定手机号码</div>-->
        <!--          </div>-->
        <!--          <div class="wechat-verify__content">-->
        <!--            <el-form :model="login" :rules="loginRules">-->
        <!--              <el-form-item prop="telephone">-->
        <!--                <el-input-->
        <!--                  v-model="login.telephone"-->
        <!--                  placeholder="请输入手机号码"-->
        <!--                  prefix-icon="el-icon-mobile-phone"-->
        <!--                  @input="login.telephone = login.telephone.slice(0,11)"-->
        <!--                />-->
        <!--              </el-form-item>-->
        <!--              <el-form-item prop="password">-->
        <!--                <div style="display:flex;">-->
        <!--                  <el-input-->
        <!--                    v-model="login.captcha"-->
        <!--                    placeholder="请输入图形验证码"-->
        <!--                    prefix-icon="el-icon-lock"-->
        <!--                    @input="login.captcha = login.captcha.slice(0,6)"-->
        <!--                  />-->
        <!--                  <img-->
        <!--                    :src="login.captchaSrc"-->
        <!--                    alt="验证码"-->
        <!--                    class="picture"-->
        <!--                    @click.stop="refreshCaptcha"-->
        <!--                  >-->
        <!--                </div>-->
        <!--              </el-form-item>-->
        <!--              <el-form-item-->
        <!--                prop="password"-->
        <!--              >-->
        <!--                <div style="display:flex;">-->
        <!--                  <el-input-->
        <!--                    v-model="login.smsCaptcha"-->
        <!--                    placeholder="请输入短信验证码"-->
        <!--                    prefix-icon="el-icon-lock"-->
        <!--                    @input="login.smsCaptcha = login.smsCaptcha.slice(0,6)"-->
        <!--                  />-->
        <!--                  <span class="code-text" @click="handleCode">{{ login.codeText }}</span>-->
        <!--                </div>-->

        <!--              </el-form-item>-->
        <!--              <el-form-item prop="password">-->
        <!--                <etm-user-agreement />-->
        <!--              </el-form-item>-->
        <!--              <el-form-item prop="password">-->
        <!--                <el-button class="login-btn" type="primary" @click="handleBindWechat">登录</el-button>-->
        <!--              </el-form-item>-->
        <!--            </el-form>-->
        <!--          </div>-->
        <!--        </div>-->
      </div>
    </div>
    <footer class="footer" />
    <copyright v-show="false" />
  </div>

</template>

<script>/**
 * login create by haijinsha
 * createTime 2020/12/8 13:43
 */
import { queryCaptchaImg, queryWechatLoginInfo } from '@/api/base/login'
import { getPhoneVerifyCode } from '@/api/user'
import EtmUserAgreement from '@/views/base/loginV2/components/EtmUserAgreement'
import { validPhoneNumber } from '@/utils/validate'
import Copyright from '@/views/base/loginV2/components/copyright'
import { getQueryVariable } from '@/utils/base'
import { getConfig } from '@/utils/auth'
import { createBindWechatUserTelephone } from '@/api/base/userInfo'
import pubsub from '@/utils/PubSub'
import { isDisableWechat } from '@/auth'

export default {
  name: 'Login',
  components: { Copyright, EtmUserAgreement },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      isDisableWechat: false,
      active: 'account',
      showAgreement: false,
      showText: false,
      login: {
        type: 'PASSWORD',
        password: '',
        // 手机
        captcha: '',
        captchaSrc: '',
        codeText: '获取验证码',
        smsCode: '',
        telephone: '',
        picturecode: '',
        verifycode: '',
        code: '',
        smsCaptcha: '',
        token: ''
      },
      loginRules: {},
      timer: null,
      currentLoginType: 'pc',
      WechatInstance: null,
      config: {
        loginPost: '',
        loginLogo: ''
      }
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    this.init()
    this.refreshCaptcha()
    this.hasWechatLoginCode()
    this.handleWechatLogin()
    pubsub.subscribe('configReady', () => {
      this.$nextTick(() => {
        this.config = getConfig()
        this.isDisableWechat = isDisableWechat()
      })
    })
  },
  methods: {
    hasWechatLoginCode() {
      if (!getQueryVariable('code')) {
        let time = setInterval(() => {
          if (this.$route.query.code) {
            console.log('有code可以登录')
            this.handleLogin()
            clearInterval(time)
            time = null
          }
        }, 1000)
      } else {
        this.currentLoginType = 'wechatLogin'
        this.handleLogin()
      }
    },
    handleWechatLogin() {
      queryWechatLoginInfo({ oAuthType: 'WECHAT' }).then(async res => {
        // eslint-disable-next-line no-undef
        this.WechatInstance = await new WxLogin({
          self_redirect: false,
          id: 'login_container',
          appid: res.data.appId,
          scope: res.data.scope,
          redirect_uri: res.data.redirectUrl,
          state: encodeURIComponent(location.origin + location.pathname),
          style: '',
          href: 'https://qiniu.etmcn.com/wechatCss.css'
        }
        )
      })
    },
    handleChangeLoginType(type) {
      this.currentLoginType = type
    },
    init() {
    },
    handleActive(type) {
      this.active = type
    },
    async handleLogin() {
      console.log('handle login')
      const isWechatLogin = this.currentLoginType === 'wechatLogin'
      const isAccount = this.currentLoginType === 'pc' && this.active === 'account'
      const isPhone = this.currentLoginType === 'pc' && this.active === 'phone'
      let loginPromise = Promise.resolve()

      this.$store.commit('login/SET_LOADING', true)
      if (isWechatLogin) {
        this.login.code = this.$route.query.code
        this.login.type = 'WECHAT'
        this.login.telephone = null
        this.login.password = null
        this.login.smsCaptcha = null
        await this.$store.dispatch('user/login', this.login).then(async res => {
          loginPromise = await this.$store.dispatch('user/getEmployeeEnterprise')
        }).catch(() => {
          this.$router.push({ query: {}})
          this.handleWechatLogin()
          this.hasWechatLoginCode()
        })
        return
      }
      if (!validPhoneNumber(this.login.telephone)) {
        return this.$message.error('请输入正确的手机号码')
      }
      if (isAccount) {
        this.login.type = 'PASSWORD'
        loginPromise = this.$store.dispatch('user/login', this.login)
      }

      if (isPhone) {
        this.login.type = 'SMS_CAPTCHA'
        loginPromise = this.$store.dispatch('user/messageLogin', this.login)
      }

      loginPromise.then(data => {
        loginPromise = this.$store.dispatch('user/getEmployeeEnterprise')
        this.$store.commit('login/SET_LOADING', false)
      }).catch(() => {
        this.$store.commit('login/SET_LOADING', false)
      })
    },
    refreshCaptcha() {
      queryCaptchaImg().then(res => {
        this.login.token = res.token
        this.login.captchaSrc = res.data
      })
    },
    handleBindWechat() {
      const { smsCaptcha, telephone } = this.login
      createBindWechatUserTelephone({ smsCaptcha, telephone }).then(result => {
        console.log(`result: `, result)
        this.$store.dispatch('user/getEmployeeEnterprise')
      })
    },
    handleCode() {
      if (this.timer) {
        return
      }
      let time = 30
      const { telephone, captcha, token } = this.login
      if (!validPhoneNumber(telephone)) {
        return this.$message.error('手机号码不正确')
      }
      if (!captcha) {
        return this.$message.error('图形验证码不能为空')
      }
      getPhoneVerifyCode({ telephone, captcha, token, type: 'LOGIN' }).then(response => {
        this.timer = setInterval(() => {
          if (time <= 1) {
            setTimeout(() => {
              this.$set(this.login, 'codeText', this.$options.data().login.codeText)
            }, 1000)
            clearInterval(this.timer)
            this.timer = null
          }
          this.login.codeText = time + '秒'
          time--
        }, 1000)
      }).catch(error => {
        console.log(error)
        this.refreshCaptcha()
        this.loginForm.picturecode = ''
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.login-wrap {
  width: 100%;
  height: 100vh;
  background-color: #F0F2F5;
  position: relative;

  .login-view {
    margin: 0 auto;
    position: fixed;
    right: 0;
    bottom: calc(60vh - 324px);
    left: 0;
    width: 770px;
    height: 540px;
    background: #FFFFFF;
    box-shadow: 0px 4px 16px 0px rgba(221, 221, 221, 0.25);
    border-radius: 10px;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .shadowBox {
      position: absolute;
      left: 0;
      bottom: -80px;
      width: 100%;
      height: 80px;
      border-radius: 10px;
      background: linear-gradient(to bottom, rgba(255, 255, 255, .6), rgba(255, 255, 255, 0.2) 40%, rgba(255, 255, 255, 0));
    }

    .left, .right {
      flex: 0 0 50%;
      padding: 24px 32px;
      overflow: hidden;
    }

    .left {
      height: inherit;
      position: relative;

      &::after {
        position: absolute;
        top: 0;
        right: 0;
        content: '';
        display: block;
        width: 1px;
        height: inherit;
        background-color: #F2F4F9;

        box-shadow: 4px 0px 8px 0px rgba(58, 59, 61, 0.18), -4px 0px 8px 0px rgba(58, 59, 61, 0.18);
      }
    }

    .right {
      height: inherit;
      position: relative;
      padding-top: 100px;

      &::before {
        position: absolute;
        top: 0;
        left: -1px;
        content: '';
        display: block;
        width: 1px;
        height: inherit;
        background-color: #F2F4F9;

        box-shadow: 4px 0px 8px 0px rgba(58, 59, 61, 0.18), -4px 0px 8px 0px rgba(58, 59, 61, 0.18);
      }

      .el-form-item {
        margin-bottom: 24px;

        &.agreeItem {
          margin: -14px 0 10px;
        }
      }

      .header {
        width: 100%;
        height: 100px;
        position: absolute;
        left: 0;
        top: 0;

        .logo {
          display: inline-block;
          padding: 24px 0 0 32px;

          img {
            object-fit: contain;
          }
        }

        .qrcode {
          display: inline-block;
          position: absolute;
          right: 32px;
          top: 24px;
          cursor: pointer;
        }
      }

      .phone {
        position: relative;

        .picture {
          width: 100px;
          height: 40px;
          margin-left: 9px;
          border-radius: 4px;
          cursor: pointer;
        }

        .code-text {
          user-select: none;
          position: absolute;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
          color: $secondary-color;

          &.main {
            @include etm-color();
          }
        }
      }

      .account-login {

        .tabs {
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;

          .tab-item {
            flex: auto;
            text-align: center;
            font-size: 18px;
            color: #9EA5B6;
          }
        }

        .tab-content {
          margin-top: 24px;
          @extend .phone;
        }

        .active {
          position: relative;
          @include etm-color();

          &::after {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            bottom: -10px;
            display: block;
            margin: 0 auto;
            content: '';
            width: 30px;
            height: 2px;
            background-color: #1BCCD4;
            @include etm-bgc();
          }
        }
      }

      .wechat-login {
      }

      //.wechat-login-mask {
      //  width: 200px;
      //  height: 100px;
      //  background-color: $white;
      //  position: absolute;
      //  bottom: 0;
      //  left: 50%;
      //  transform: translateX(-50%);
      //}

      .wechat-verify {

        &__header {
          height: 56px;
          text-align: center;
        }

        &__title {
          color: $title-color;
          font-size: 18px;
        }

        &__description {
          color: $secondary-color;
          font-size: 14px;
        }

        &__content {
          margin-top: 24px;
          @extend .phone;

        }
      }

      .text {
        @include etm-color();
        cursor: pointer;
      }

      .login-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 40px;
      }
    }
  }

  .footer {
    position: absolute;
    bottom: 0;
    left: 0;
    background-color: #D4D4D4;
    width: 100%;
    height: calc(60vh - 324px);
  }
}
</style>
